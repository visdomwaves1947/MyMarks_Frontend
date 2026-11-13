import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lightbulb, RotateCcw, Target, Trophy } from 'lucide-react';
import { Cross, Tick } from './QuizPlayer';
import { celebrate, playSound, wantsLessMotion } from '../../utils/quizEffects';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const RING = 2 * Math.PI * 52;

// Counts up from 0 to a number over a moment
function useCountUp(target, milliseconds = 1000) {
  const [value, setValue] = useState(wantsLessMotion() ? target : 0);
  useEffect(() => {
    if (wantsLessMotion()) {
      setValue(target);
      return undefined;
    }
    const started = performance.now();
    let frame = 0;
    const step = (now) => {
      const part = Math.min((now - started) / milliseconds, 1);
      // Fast at first, slowing into the final number
      setValue(Math.round(target * (1 - (1 - part) ** 3)));
      if (part < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, milliseconds]);
  return value;
}

/**
 * The end of a go: the marks in a ring that fills, pass or not (with confetti for a pass),
 * and every question with the student's answer, the right one and why.
 */
export default function QuizResult({ assignment, course, outcome, preview = false, onRetry, retrying = false }) {
  const { result, attempts = 0, best = null } = outcome;
  const { score, total, percent, passed, passPercent, review } = result;
  const shown = useCountUp(percent);
  const [onlyWrong, setOnlyWrong] = useState(false);
  const wrong = review.filter((item) => !item.correct);
  const perfect = total > 0 && score === total;

  useEffect(() => {
    playSound(passed ? 'pass' : 'done');
    return passed ? celebrate(perfect ? 2200 : 1400) : undefined;
  }, [passed, perfect]);

  const title = perfect ? 'Perfect score!' : passed ? 'You passed!' : 'Keep practising';
  const line = perfect
    ? 'Every answer right. Excellent work.'
    : passed
      ? 'Well done. Look at the ones you missed below.'
      : `You need ${passPercent}% to pass. Read the answers below, then try again.`;
  const list = onlyWrong ? wrong : review;

  return (
    <div data-testid="quiz-result" data-passed={passed ? 'true' : 'false'} className="space-y-5">
      <section className="quiz-in rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 text-center shadow-sm">
        <div className="relative mx-auto h-40 w-40">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
            <circle cx="60" cy="60" r="52" fill="none" strokeWidth="10" className="stroke-slate-200 dark:stroke-slate-700" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              className={passed ? 'stroke-emerald-500' : 'stroke-amber-500'}
              strokeDasharray={RING}
              strokeDashoffset={RING * (1 - shown / 100)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span data-testid="quiz-result-percent" data-percent={percent} className="text-4xl font-black tabular-nums text-slate-950 dark:text-white">
              {shown}%
            </span>
            <span data-testid="quiz-result-score" className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {score} of {total} right
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          <span
            className={`quiz-bounce flex h-10 w-10 items-center justify-center rounded-full text-white ${passed ? 'bg-emerald-500' : 'bg-amber-500'}`}
            style={{ animationDelay: '0.5s' }}
          >
            {passed ? <Trophy size={20} /> : <Target size={20} />}
          </span>
          <h2 data-testid="quiz-result-title" className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
            {title}
          </h2>
        </div>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{line}</p>

        <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs font-bold">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">{score} right</span>
          <span className="rounded-full bg-rose-100 px-3 py-1 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">{total - score} wrong</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-200">Pass mark {passPercent}%</span>
          {best && attempts > 1 && (
            <span data-testid="quiz-result-best" className="rounded-full bg-blue-100 px-3 py-1 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              Best of {attempts} goes: {best.percent}%
            </span>
          )}
        </div>
        {preview && <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">You tried this as an administrator, so nothing was saved.</p>}

        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-2.5">
          <button
            type="button"
            data-testid="quiz-retry"
            disabled={retrying}
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 cursor-pointer disabled:opacity-60"
          >
            <RotateCcw size={15} />
            <span>{retrying ? 'Starting...' : 'Try again'}</span>
          </button>
          <Link
            to={`/courses/${course.slug}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-3 text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <ArrowLeft size={15} />
            <span>Back to {course.name}</span>
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-black text-slate-950 dark:text-white">Your answers</h3>
          {wrong.length > 0 && wrong.length < review.length && (
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input type="checkbox" checked={onlyWrong} onChange={(event) => setOnlyWrong(event.target.checked)} className="h-4 w-4 accent-blue-600" />
              <span>Show only the ones I missed ({wrong.length})</span>
            </label>
          )}
        </div>
        <ol className="mt-3 space-y-3">
          {list.map((item) => {
            const number = review.indexOf(item) + 1;
            return (
              <li
                key={item._id}
                data-testid="quiz-review-item"
                data-correct={item.correct ? 'true' : 'false'}
                className={`rounded-2xl border p-4 ${
                  item.correct ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20' : 'border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white ${item.correct ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                    {item.correct ? <Tick size={16} /> : <Cross size={16} />}
                  </span>
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="whitespace-pre-line font-bold text-slate-950 dark:text-white">
                      {number}. {item.text}
                    </p>
                    {!item.correct && (
                      <p className="mt-1 text-rose-700 dark:text-rose-300">
                        Your answer: {item.choice === null ? 'not answered' : `${LETTERS[item.choice]}. ${item.options[item.choice]}`}
                      </p>
                    )}
                    <p className="mt-1 text-emerald-700 dark:text-emerald-300">
                      Right answer: {LETTERS[item.answer]}. {item.options[item.answer]}
                    </p>
                    {item.explanation && (
                      <p className="mt-1.5 flex gap-2 text-slate-700 dark:text-slate-300">
                        <Lightbulb size={15} className="mt-0.5 shrink-0 text-amber-500" />
                        <span className="whitespace-pre-line">{item.explanation}</span>
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
