import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ListChecks, Lock, LogIn, Play, RotateCcw, ShoppingCart, Trophy } from 'lucide-react';
import QuizPlayer from '../components/assignments/QuizPlayer';
import QuizResult from '../components/assignments/QuizResult';
import NoticePanel from '../components/ui/NoticePanel';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { fetchAssignment, startAssignment } from '../services/assignmentsApi';

const PANEL = 'bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm';
const PRIMARY = 'px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60';
const SECONDARY =
  'px-5 py-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60';

/**
 * A chapter's assignment: what it is and the student's best result, then its questions one at a time,
 * then the result. A visitor is asked to sign in, and a student without the course to buy it.
 */
export default function AssignmentPage({ currentUser, onOpenSignIn }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({ status: 'loading', data: null });
  // 'intro', 'quiz' or 'result'
  const [stage, setStage] = useState('intro');
  const [attempt, setAttempt] = useState(null);
  const [round, setRound] = useState(0);
  const [outcome, setOutcome] = useState(null);
  const [starting, setStarting] = useState(false);
  const [problem, setProblem] = useState('');
  const signedInAs = currentUser?._id || currentUser?.email || currentUser?.role || '';

  useEffect(() => {
    let live = true;
    setState({ status: 'loading', data: null });
    setStage('intro');
    setAttempt(null);
    setOutcome(null);
    setProblem('');
    fetchAssignment(id)
      .then((data) => live && setState({ status: 'ready', data }))
      .catch((error) => live && setState({ status: error.status === 404 ? 'missing' : 'error', data: null }));
    return () => {
      live = false;
    };
    // Signing in changes who may take it
  }, [id, signedInAs]);

  const assignment = state.data?.assignment;
  const course = state.data?.course;
  const open = state.data?.attempt;
  const preview = Boolean(state.data?.preview);
  useDocumentMeta({
    title: assignment ? `${assignment.title} | MyMarks` : 'Assignment | MyMarks',
    description: assignment ? `${assignment.questionCount} questions on ${assignment.chapterName || 'this chapter'}.` : 'A chapter assignment on MyMarks.',
  });

  const begin = async () => {
    setStarting(true);
    setProblem('');
    try {
      const data = await startAssignment(id);
      setAttempt({ _id: data.attempt._id, answers: [] });
      setRound((count) => count + 1);
      setOutcome(null);
      setStage('quiz');
      window.scrollTo({ top: 0 });
    } catch (error) {
      if (error.status === 401) onOpenSignIn?.();
      setProblem(error.message || 'Could not start the assignment. Please try again.');
    } finally {
      setStarting(false);
    }
  };
  const resume = () => {
    setAttempt({ _id: open._id, answers: open.answers });
    setRound((count) => count + 1);
    setStage('quiz');
  };
  const finished = (result) => {
    setOutcome(result);
    // The intro, if they come back to it, shows the new best and has no go left open
    setState((before) => ({
      ...before,
      data: { ...before.data, attempt: null, assignment: { ...before.data.assignment, attempts: result.attempts, best: result.best ?? before.data.assignment.best } },
    }));
    setStage('result');
    window.scrollTo({ top: 0 });
  };

  let body;
  if (state.status === 'loading') {
    body = <p className="text-sm text-slate-500 dark:text-slate-400">Loading the assignment...</p>;
  } else if (state.status !== 'ready') {
    body = (
      <NoticePanel
        testId="assignment-missing"
        icon={<ListChecks size={26} />}
        title={state.status === 'missing' ? 'This assignment is not available' : 'We could not load this assignment'}
        actions={[{ to: '/demo#courses', label: 'Browse Courses' }]}
      >
        {state.status === 'missing' ? 'It may have been removed or is not published yet.' : 'Please check your connection and try again.'}
      </NoticePanel>
    );
  } else if (assignment.lockReason) {
    const mustSignIn = assignment.lockReason === 'sign-in';
    body = (
      <div data-testid="assignment-locked" className={`${PANEL} max-w-lg mx-auto p-8 text-center space-y-3`}>
        <span className="mx-auto w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <Lock size={26} />
        </span>
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">{assignment.title}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {assignment.questionCount} {assignment.questionCount === 1 ? 'question' : 'questions'} on {assignment.chapterName || 'this chapter'}.{' '}
          {mustSignIn ? 'Sign in to take this assignment.' : `This assignment is part of the ${course.name} course. Buy the course to take it.`}
        </p>
        {mustSignIn ? (
          <button type="button" onClick={onOpenSignIn} className={PRIMARY}>
            <LogIn size={15} />
            <span>Sign In</span>
          </button>
        ) : (
          <button type="button" onClick={() => navigate(`/checkout?course=${encodeURIComponent(course.slug)}`)} className={PRIMARY}>
            <ShoppingCart size={15} />
            <span>Buy {course.name}</span>
          </button>
        )}
      </div>
    );
  } else if (stage === 'quiz' && attempt) {
    body = (
      <QuizPlayer
        key={`${attempt._id}-${round}`}
        assignment={assignment}
        attemptId={attempt._id}
        earlier={attempt.answers}
        preview={preview}
        onFinished={finished}
        onRestart={begin}
      />
    );
  } else if (stage === 'result' && outcome) {
    body = <QuizResult assignment={assignment} course={course} outcome={outcome} preview={preview} onRetry={begin} retrying={starting} />;
  } else {
    const answered = open?.answers.length || 0;
    body = (
      <section data-testid="assignment-intro" className={`${PANEL} quiz-in p-6 sm:p-8`}>
        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <ListChecks size={28} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">{assignment.chapterName || 'Chapter assignment'}</p>
            <h1 data-testid="assignment-title" className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
              {assignment.title}
            </h1>
          </div>
        </div>
        {assignment.instructions && <p className="mt-4 whitespace-pre-line text-sm text-slate-700 dark:text-slate-300">{assignment.instructions}</p>}

        <dl className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {[
            ['Questions', assignment.questionCount],
            ['Pass mark', `${assignment.passPercent}%`],
            ['Time limit', 'None'],
            ['Goes', 'As many as you like'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-slate-100 dark:bg-slate-800/70 px-3 py-3">
              <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</dt>
              <dd className="mt-0.5 text-sm font-black text-slate-950 dark:text-white">{value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          Choose an answer and you see at once whether it is right, with the explanation. Your best result is kept.
        </p>
        {assignment.best && (
          <p
            data-testid="assignment-best"
            className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
              assignment.best.passed
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
            }`}
          >
            <Trophy size={14} />
            <span>
              Your best: {assignment.best.score}/{assignment.best.total} · {assignment.best.percent}%
              {assignment.best.passed ? ' · passed' : ''}
            </span>
          </p>
        )}
        {preview && <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">You are trying this as an administrator. Nothing is saved.</p>}
        {problem && (
          <p role="alert" className="mt-3 text-sm font-semibold text-rose-600">
            {problem}
          </p>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
          {answered > 0 ? (
            <>
              <button type="button" data-testid="assignment-continue" onClick={resume} className={PRIMARY}>
                <Play size={15} fill="currentColor" />
                <span>
                  Continue ({answered} of {assignment.questionCount} answered)
                </span>
              </button>
              <button type="button" data-testid="assignment-start" disabled={starting} onClick={begin} className={SECONDARY}>
                <RotateCcw size={15} />
                <span>{starting ? 'Starting...' : 'Start again'}</span>
              </button>
            </>
          ) : (
            <button type="button" data-testid="assignment-start" disabled={starting} onClick={begin} className={PRIMARY}>
              <Play size={15} fill="currentColor" />
              <span>{starting ? 'Starting...' : assignment.best ? 'Try again' : 'Start the assignment'}</span>
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <div data-testid="assignment-page" className="min-h-[calc(100vh-86px)] bg-[#EBF0F7] dark:bg-[#070B14] text-slate-900 dark:text-slate-100 py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link
            to={course ? `/courses/${course.slug}` : '/demo#courses'}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-300"
          >
            <ArrowLeft size={16} />
            <span>{course ? `Back to ${course.name}` : 'Browse Courses'}</span>
          </Link>
          {stage !== 'intro' && assignment && !assignment.lockReason && (
            <p className="min-w-0 truncate text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
              {assignment.chapterName ? `${assignment.chapterName} · ` : ''}
              {assignment.title}
            </p>
          )}
        </div>
        {body}
      </div>
    </div>
  );
}
