import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ListChecks, Lock, Play, RotateCcw } from 'lucide-react';
import { fetchCourseAssignments } from '../../services/assignmentsApi';
import { chapterKeyOf, chapterNameOf } from '../../utils/chapters';

/**
 * The course page's chapter assignments: a card for each chapter that has one, with the student's
 * best result. With a chapter picked above, only that chapter's assignment shows.
 * onLocked('sign-in' | 'buy') is called for a visitor, or a student without the course.
 */
export default function CourseAssignments({ course, chapters, selectedChapter = 'all', currentUser = null, onLocked }) {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const signedInAs = currentUser?._id || currentUser?.email || currentUser?.role || '';

  useEffect(() => {
    let live = true;
    if (!course?._id) return undefined;
    fetchCourseAssignments(course._id)
      .then((list) => live && setAssignments(list))
      .catch(() => live && setAssignments([]));
    return () => {
      live = false;
    };
    // Signing in changes the best results and what is locked
  }, [course?._id, signedInAs]);

  // In chapter order, each with its chapter; an assignment of a chapter no longer in the course is left out
  const cards = useMemo(() => {
    const byKey = new Map(assignments.map((assignment) => [assignment.chapterKey, assignment]));
    const seen = new Set();
    const list = [];
    for (const chapter of chapters) {
      const key = chapterKeyOf(chapter);
      const assignment = byKey.get(key);
      if (!assignment || seen.has(key)) continue;
      seen.add(key);
      if (selectedChapter !== 'all' && chapter.chapterId !== selectedChapter) continue;
      list.push({ assignment, chapterName: chapterNameOf(chapter) });
    }
    return list;
  }, [assignments, chapters, selectedChapter]);

  if (cards.length === 0) return null;

  const open = (assignment) => {
    if (assignment.lockReason) onLocked?.(assignment.lockReason);
    else navigate(`/assignments/${assignment._id}`);
  };

  return (
    <section data-testid="course-assignments" aria-label="Chapter assignments" className="mb-8">
      <div className="mb-3 flex items-center gap-2">
        <ListChecks size={18} className="text-blue-600 dark:text-cyan-400" />
        <h3 className="text-base sm:text-lg font-black text-slate-950 dark:text-white">Chapter assignments</h3>
        <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">Test yourself after each chapter</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(({ assignment, chapterName }) => {
          const { best, lockReason } = assignment;
          const action = lockReason
            ? { label: lockReason === 'buy' ? 'Buy to take it' : 'Sign in to take it', icon: <Lock size={14} /> }
            : assignment.inProgress
              ? { label: 'Continue', icon: <Play size={14} fill="currentColor" /> }
              : best
                ? { label: 'Try again', icon: <RotateCcw size={14} /> }
                : { label: 'Start', icon: <ArrowRight size={14} /> };
          return (
            <button
              key={assignment._id}
              type="button"
              data-testid="course-assignment"
              data-chapter={assignment.chapterKey}
              onClick={() => open(assignment)}
              className="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-left shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    best?.passed
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300'
                  }`}
                >
                  {best?.passed ? <CheckCircle2 size={20} /> : <ListChecks size={20} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{chapterName}</p>
                  <p className="truncate text-sm font-black text-slate-950 dark:text-white">{assignment.title}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {assignment.questionCount} {assignment.questionCount === 1 ? 'question' : 'questions'} · pass {assignment.passPercent}%
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span
                  data-testid="course-assignment-best"
                  className={`rounded-full px-2.5 py-1 text-[11px] font-black ${
                    !best
                      ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      : best.passed
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                  }`}
                >
                  {best ? `Best ${best.score}/${best.total} · ${best.percent}%` : 'Not taken yet'}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-cyan-400 group-hover:underline">
                  {action.icon}
                  <span>{action.label}</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
