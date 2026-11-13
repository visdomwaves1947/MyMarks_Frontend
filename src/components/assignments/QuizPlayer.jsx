import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Flame, Lightbulb, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { answerAssignmentQuestion, finishAssignment } from '../../services/assignmentsApi';
import { burstFrom, buzz, clearConfetti, playSound, setSoundOn, soundIsOn } from '../../utils/quizEffects';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const PRAISE = ['Correct!', 'Well done!', 'Spot on!', 'Brilliant!', 'That is right!'];
const COMFORT = ['Not quite', 'Good try', 'Not this time'];
const pick = (list) => list[Math.floor(Math.random() * list.length)];

// A tick and a cross that draw themselves
export function Tick({ size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path className="quiz-draw" d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}
export function Cross({ size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
      <path className="quiz-draw" d="M6.5 6.5l11 11" />
      <path className="quiz-draw" style={{ animationDelay: '0.2s' }} d="M17.5 6.5l-11 11" />
    </svg>
  );
}

const OPTION_LOOK = {
  idle: 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:border-blue-400 hover:bg-blue-50/70 dark:hover:bg-blue-950/30 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer quiz-in',
  checking: 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-slate-900 dark:text-white ring-4 ring-blue-200 dark:ring-blue-900 animate-pulse',
  waiting: 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white opacity-60',
  correct: 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 quiz-pop',
  wrong: 'border-rose-500 bg-rose-500 text-white shadow-lg shadow-rose-500/25 quiz-shake',
  right: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 quiz-reveal',
  dim: 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white opacity-50',
};
const LETTER_LOOK = {
  correct: 'bg-white/25 text-white',
  wrong: 'bg-white/25 text-white',
  right: 'bg-emerald-500 text-white',
};

/**
 * One go at a chapter's assignment, a question at a time. A click on an answer sends it to be checked;
 * what comes back decides the show: a right answer turns green, bounces and throws confetti, a wrong
 * one turns red and shakes while the right one lights up, and the explanation slides in under them.
 */
export default function QuizPlayer({ assignment, attemptId, earlier = [], preview = false, onFinished, onRestart }) {
  const { questions } = assignment;
  const [answers, setAnswers] = useState(
    () => new Map(earlier.map((given) => [String(given.question), { choice: given.choice, correct: given.correct, answer: given.answer, explanation: given.explanation || '' }]))
  );
  const [index, setIndex] = useState(() => {
    const open = questions.findIndex((question) => !earlier.some((given) => String(given.question) === String(question._id)));
    return open === -1 ? questions.length - 1 : open;
  });
  const [checking, setChecking] = useState(null);
  const [streak, setStreak] = useState(0);
  const [praise, setPraise] = useState('');
  const [problem, setProblem] = useState(null);
  const [finishing, setFinishing] = useState(false);
  const [sound, setSound] = useState(soundIsOn);
  const root = useRef(null);
  const options = useRef([]);
  const feedback = useRef(null);
  const nextButton = useRef(null);
  const keys = useRef(() => {});

  const question = questions[index];
  const given = answers.get(String(question._id)) || null;
  const score = [...answers.values()].filter((answer) => answer.correct).length;
  const last = index === questions.length - 1;

  const choose = async (choice) => {
    if (given || checking !== null || finishing) return;
    setChecking(choice);
    setProblem(null);
    try {
      const result = await answerAssignmentQuestion(assignment._id, { attemptId, questionId: question._id, choice });
      const mine = { choice: result.choice ?? choice, correct: result.correct, answer: result.answer, explanation: result.explanation || '' };
      setAnswers((before) => new Map(before).set(String(question._id), mine));
      if (mine.correct) {
        const run = streak + 1;
        setStreak(run);
        setPraise(run >= 3 ? `${run} in a row!` : pick(PRAISE));
        playSound('correct');
        burstFrom(options.current[mine.choice], { strong: run >= 3 });
      } else {
        setStreak(0);
        setPraise(pick(COMFORT));
        clearConfetti();
        playSound('wrong');
        buzz([70, 40, 70]);
      }
    } catch (error) {
      const code = error.data?.code;
      setProblem({
        message: error.message || 'Could not check the answer. Please try again.',
        restart: code === 'changed' || code === 'finished' || error.status === 404,
      });
    } finally {
      setChecking(null);
    }
  };

  const finish = async () => {
    setFinishing(true);
    setProblem(null);
    try {
      const sent = preview ? [...answers].map(([questionId, answer]) => ({ questionId, choice: answer.choice })) : undefined;
      onFinished(await finishAssignment(assignment._id, { attemptId, answers: sent }));
    } catch (error) {
      setProblem({ message: error.message || 'Could not finish the assignment. Please try again.', restart: false });
      setFinishing(false);
    }
  };

  const next = () => {
    if (!given || finishing) return;
    if (last) {
      finish();
      return;
    }
    setPraise('');
    clearConfetti();
    setIndex(index + 1);
    const top = root.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) root.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Once an answer is marked, its explanation and the Next button come into view
  useEffect(() => {
    if (!given) return;
    feedback.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    nextButton.current?.focus({ preventScroll: true });
  }, [given, index]);

  // Keys: 1 to 6 or A to F choose an answer; Enter or the right arrow goes on
  keys.current = (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const tag = event.target?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (given) {
      // Enter on a focused button already presses it
      if (event.key === 'ArrowRight' || (event.key === 'Enter' && tag !== 'BUTTON' && tag !== 'A')) {
        event.preventDefault();
        next();
      }
      return;
    }
    const key = event.key.toLowerCase();
    const place = /^[1-6]$/.test(key) ? Number(key) - 1 : LETTERS.map((letter) => letter.toLowerCase()).indexOf(key);
    if (place >= 0 && place < question.options.length) {
      event.preventDefault();
      choose(place);
    }
  };
  useEffect(() => {
    const onKey = (event) => keys.current(event);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      clearConfetti();
    };
  }, []);

  const stateOf = (place) => {
    if (!given) {
      if (checking === place) return 'checking';
      return checking !== null ? 'waiting' : 'idle';
    }
    if (place === given.choice) return given.correct ? 'correct' : 'wrong';
    return place === given.answer ? 'right' : 'dim';
  };

  const toggleSound = () => {
    const on = !sound;
    setSound(on);
    setSoundOn(on);
    if (on) playSound('done');
  };

  return (
    <div ref={root} data-testid="quiz" data-streak={streak} className="scroll-mt-24 space-y-4">
      {/* Where the student is, their score, and the run of right answers */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <p data-testid="quiz-position" className="text-sm font-bold text-slate-700 dark:text-slate-200">
            Question {index + 1} of {questions.length}
          </p>
          <div className="flex items-center gap-2">
            {streak >= 2 && (
              <span
                key={streak}
                data-testid="quiz-streak"
                className="quiz-bounce inline-flex items-center gap-1 rounded-full bg-orange-100 dark:bg-orange-950/50 px-2.5 py-1 text-xs font-black text-orange-600 dark:text-orange-300"
              >
                <Flame size={14} className="fill-current" />
                <span>{streak} in a row</span>
              </span>
            )}
            <span className="relative inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-black text-slate-800 dark:text-slate-100">
              <span data-testid="quiz-score">
                Score {score}/{questions.length}
              </span>
              {given?.correct && (
                <span key={`plus-${index}`} aria-hidden="true" className="quiz-float pointer-events-none absolute -top-3 right-1 text-sm font-black text-emerald-500">
                  +1
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={sound}
              aria-label={sound ? 'Turn the sounds off' : 'Turn the sounds on'}
              title={sound ? 'Sounds are on' : 'Sounds are off'}
              className="rounded-full p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {sound ? <Volume2 size={17} /> : <VolumeX size={17} />}
            </button>
          </div>
        </div>
        <div
          role="progressbar"
          aria-label="Questions answered"
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-valuenow={answers.size}
          className={`mt-2.5 flex ${questions.length > 40 ? 'gap-px' : 'gap-1'}`}
        >
          {questions.map((item, place) => {
            const done = answers.get(String(item._id));
            const state = done ? (done.correct ? 'correct' : 'wrong') : place === index ? 'current' : 'todo';
            return (
              <span
                key={item._id}
                data-testid="quiz-step"
                data-state={state}
                className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
                  { correct: 'bg-emerald-500', wrong: 'bg-rose-500', current: 'bg-blue-500', todo: 'bg-slate-200 dark:bg-slate-700' }[state]
                }`}
              />
            );
          })}
        </div>
      </div>

      {problem && (
        <div role="alert" data-testid="quiz-problem" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          <span>{problem.message}</span>
          {problem.restart && (
            <button type="button" onClick={onRestart} className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700 cursor-pointer">
              <RotateCcw size={13} />
              <span>Start again</span>
            </button>
          )}
        </div>
      )}

      {/* The question and its answers */}
      <section
        key={question._id}
        data-testid="quiz-question"
        className="quiz-in rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 shadow-sm"
      >
        <h2 data-testid="quiz-question-text" className="whitespace-pre-line text-lg sm:text-2xl font-bold leading-snug text-slate-950 dark:text-white">
          {question.text}
        </h2>
        <div className="mt-5 grid gap-3">
          {question.options.map((option, place) => {
            const state = stateOf(place);
            return (
              <button
                // eslint-disable-next-line react/no-array-index-key
                key={place}
                ref={(element) => {
                  options.current[place] = element;
                }}
                type="button"
                data-testid="quiz-option"
                data-state={state}
                disabled={Boolean(given) || checking !== null || finishing}
                onClick={() => choose(place)}
                style={state === 'idle' ? { animationDelay: `${80 + place * 70}ms` } : undefined}
                className={`flex min-h-[3.5rem] w-full items-center gap-3 rounded-2xl border-2 px-3.5 py-3 text-left text-base font-semibold transition-[background-color,border-color,opacity,transform] duration-200 disabled:cursor-default ${OPTION_LOOK[state]}`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                    LETTER_LOOK[state] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {LETTERS[place]}
                </span>
                <span className="min-w-0 flex-1 whitespace-pre-line break-words">{option}</span>
                {(state === 'correct' || state === 'right') && (
                  <span className={state === 'right' ? 'text-emerald-600 dark:text-emerald-300' : ''}>
                    <Tick />
                  </span>
                )}
                {state === 'wrong' && <Cross />}
              </button>
            );
          })}
        </div>
        {!given && (
          <p className="mt-4 hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
            Tip: press {LETTERS.slice(0, question.options.length).join(', ')} or 1 to {question.options.length} to answer.
          </p>
        )}
      </section>

      {/* How it went, why, and on to the next one */}
      {given && (
        <div
          ref={feedback}
          role="status"
          data-testid="quiz-feedback"
          data-result={given.correct ? 'correct' : 'wrong'}
          className={`quiz-in scroll-mb-6 rounded-3xl border-2 p-4 sm:p-5 ${
            given.correct
              ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40'
              : 'border-rose-300 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/40'
          }`}
        >
          <div className="flex items-start gap-3">
            <span className={`quiz-bounce flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white ${given.correct ? 'bg-emerald-500' : 'bg-rose-500'}`}>
              {given.correct ? <Tick size={24} /> : <Cross size={24} />}
            </span>
            <div className="min-w-0 flex-1">
              <p data-testid="quiz-feedback-title" className={`text-lg font-black ${given.correct ? 'text-emerald-800 dark:text-emerald-200' : 'text-rose-800 dark:text-rose-200'}`}>
                {praise || (given.correct ? 'Correct!' : 'Not quite')}
              </p>
              {!given.correct && (
                <p data-testid="quiz-right-answer" className="mt-0.5 text-sm text-slate-800 dark:text-slate-100">
                  The right answer is{' '}
                  <strong>
                    {LETTERS[given.answer]}. {question.options[given.answer]}
                  </strong>
                </p>
              )}
              {given.explanation && (
                <p data-testid="quiz-explanation" className="mt-2 flex gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <Lightbulb size={16} className="mt-0.5 shrink-0 text-amber-500" />
                  <span className="whitespace-pre-line">{given.explanation}</span>
                </p>
              )}
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              ref={nextButton}
              type="button"
              data-testid="quiz-next"
              disabled={finishing}
              onClick={next}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 sm:w-auto cursor-pointer disabled:opacity-60"
            >
              <span>{finishing ? 'Adding up your marks...' : last ? 'See my result' : 'Next question'}</span>
              {!finishing && <ArrowRight size={16} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
