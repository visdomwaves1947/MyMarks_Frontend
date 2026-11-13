import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BarChart3, ExternalLink, ListChecks, Pencil, Plus, Trash2, X } from 'lucide-react';
import AssignmentEditor from './AssignmentEditor';
import useDialog from '../../../hooks/useDialog';
import { fetchAdminCourses, fetchCoursePage } from '../../../services/courseApi';
import { deleteAssignment, fetchAdminAssignments, fetchAssignmentResults, updateAssignment } from '../../../services/assignmentsApi';
import { chapterKeyOf, chapterNameOf } from '../../../utils/chapters';

const CARD = 'rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-sm';
const SMALL_BUTTON =
  'px-2.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';
const QUIET = `${SMALL_BUTTON} border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800`;
const INPUT =
  'px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40';

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;
const dayOf = (value) => (value ? new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '');

// Who took an assignment, best result first. The first go shows what a student knew before seeing the answers.
function ResultsWindow({ assignment, onClose }) {
  const [state, setState] = useState({ status: 'loading', students: [] });
  useEffect(() => {
    let live = true;
    fetchAssignmentResults(assignment._id)
      .then((data) => live && setState({ status: 'ready', students: data.students || [] }))
      .catch(() => live && setState({ status: 'error', students: [] }));
    return () => {
      live = false;
    };
  }, [assignment._id]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4">
      <div role="dialog" aria-modal="true" aria-label={`Results of ${assignment.title}`} data-testid="assignment-results" className={`${CARD} w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden`}>
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="min-w-0">
            <p className="truncate text-base font-black text-slate-950 dark:text-white">{assignment.title}: results</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {assignment.chapterName} · pass mark {assignment.passPercent}%
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {state.status === 'loading' && <p className="text-sm text-slate-500">Loading the results...</p>}
          {state.status === 'error' && <p className="text-sm text-rose-600">Could not load the results. Please try again.</p>}
          {state.status === 'ready' && state.students.length === 0 && (
            <p className="text-sm text-slate-600 dark:text-slate-300">No student has finished this assignment yet.</p>
          )}
          {state.students.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 dark:text-slate-400">
                  <th className="py-1.5 font-bold">Student</th>
                  <th className="py-1.5 font-bold">First go</th>
                  <th className="py-1.5 font-bold">Best</th>
                  <th className="py-1.5 font-bold">Goes</th>
                  <th className="py-1.5 font-bold">Last</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {state.students.map((student) => (
                  <tr key={student._id} data-testid="assignment-result-row">
                    <td className="py-2 pr-2">
                      <p className="font-semibold text-slate-900 dark:text-white">{student.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{student.email || student.mobileNumber}</p>
                    </td>
                    <td className="py-2 pr-2 whitespace-nowrap text-slate-700 dark:text-slate-200">
                      {student.first ? `${student.first.score}/${student.first.total} · ${student.first.percent}%` : ''}
                    </td>
                    <td className="py-2 pr-2 whitespace-nowrap">
                      <span className={`font-bold ${student.best.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {student.best.score}/{student.best.total} · {student.best.percent}%
                      </span>
                    </td>
                    <td className="py-2 pr-2">{student.attempts}</td>
                    <td className="py-2 whitespace-nowrap text-slate-600 dark:text-slate-300">{dayOf(student.lastAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Admin, Assignments: each chapter of a course can have one assignment of multiple-choice questions.
 * The admin types the questions, marks the right answers and publishes it; students then find it
 * under the chapter on the course page.
 */
export default function AssignmentsPanel({ showToast }) {
  const { confirm } = useDialog();
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [chapters, setChapters] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [status, setStatus] = useState('loading');
  const [editing, setEditing] = useState(null);
  const [results, setResults] = useState(null);

  const say = useCallback((message, type) => showToast?.(message, type), [showToast]);
  const course = useMemo(() => courses.find((item) => item._id === courseId) || null, [courses, courseId]);

  useEffect(() => {
    fetchAdminCourses()
      .then((list) => {
        const usable = (list || []).filter((item) => item.status !== 'archived');
        setCourses(usable);
        setCourseId((current) => current || usable[0]?._id || '');
        if (usable.length === 0) setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  const load = useCallback(async () => {
    if (!course) return;
    setStatus('loading');
    try {
      const [page, list] = await Promise.all([fetchCoursePage(course.slug), fetchAdminAssignments(course._id)]);
      // The chapters students see on the course page; two with the same key share one assignment
      const seen = new Set();
      const rows = [];
      for (const chapter of page?.curriculum?.chapters || []) {
        const key = chapterKeyOf(chapter);
        if (seen.has(key)) continue;
        seen.add(key);
        rows.push({ key, name: chapterNameOf(chapter) });
      }
      setChapters(rows);
      setAssignments(list);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, [course]);
  useEffect(() => {
    load();
  }, [load]);

  const byKey = useMemo(() => new Map(assignments.map((assignment) => [assignment.chapterKey, assignment])), [assignments]);
  // Assignments of chapters that were renumbered or removed from the course
  const strays = useMemo(() => {
    const keys = new Set(chapters.map((chapter) => chapter.key));
    return assignments.filter((assignment) => !keys.has(assignment.chapterKey));
  }, [assignments, chapters]);

  const keep = (saved) => setAssignments((list) => [...list.filter((item) => item._id !== saved._id), { stats: list.find((item) => item._id === saved._id)?.stats, ...saved }]);

  const setPublished = async (assignment, published) => {
    try {
      keep(await updateAssignment(assignment._id, { status: published ? 'published' : 'draft' }));
      say(published ? 'Published. Students can take it now.' : 'Unpublished. Students no longer see it.', 'success');
    } catch (error) {
      say(error.message, 'error');
    }
  };

  const remove = async (assignment) => {
    const taken = assignment.stats?.attempts || 0;
    const ok = await confirm({
      title: `Delete "${assignment.title}"?`,
      message: taken
        ? `Its ${plural(assignment.questionCount, 'question')} and the results of ${plural(assignment.stats.students, 'student')} are deleted. This cannot be undone.`
        : `Its ${plural(assignment.questionCount, 'question')} are deleted. This cannot be undone.`,
      confirmLabel: 'Delete',
      tone: 'danger',
    });
    if (!ok) return;
    try {
      await deleteAssignment(assignment._id);
      setAssignments((list) => list.filter((item) => item._id !== assignment._id));
      say('Assignment deleted.', 'success');
    } catch (error) {
      say(error.message, 'error');
    }
  };

  const row = (chapter, assignment) => {
    const stats = assignment?.stats;
    return (
      <li
        key={chapter.key}
        data-testid="assignment-chapter"
        data-chapter={chapter.key}
        className="py-3.5 flex flex-col lg:flex-row lg:items-center gap-3"
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-950 dark:text-white">{chapter.name}</p>
          {assignment ? (
            <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
              <span
                data-testid="assignment-status"
                className={`mr-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-black ${
                  assignment.status === 'published'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                }`}
              >
                {assignment.status === 'published' ? 'Published' : 'Draft'}
              </span>
              <span data-testid="assignment-summary">
                {assignment.title} · {plural(assignment.questionCount, 'question')} · pass {assignment.passPercent}%
              </span>
              {stats?.attempts > 0 && (
                <span data-testid="assignment-stats">
                  {' '}
                  · {plural(stats.students, 'student')} · average {stats.averagePercent}%
                </span>
              )}
            </p>
          ) : (
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">No assignment yet</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          {assignment ? (
            <>
              <button type="button" data-testid="assignment-edit" onClick={() => setEditing({ chapter, assignment })} className={`${SMALL_BUTTON} bg-slate-900 hover:bg-slate-700 text-white`}>
                <Pencil size={13} />
                <span>Edit questions</span>
              </button>
              <button
                type="button"
                data-testid="assignment-toggle"
                disabled={assignment.status !== 'published' && assignment.questionCount === 0}
                onClick={() => setPublished(assignment, assignment.status !== 'published')}
                className={QUIET}
              >
                {assignment.status === 'published' ? 'Unpublish' : 'Publish'}
              </button>
              <button type="button" data-testid="assignment-results-open" onClick={() => setResults(assignment)} className={QUIET}>
                <BarChart3 size={13} />
                <span>Results</span>
              </button>
              <a href={`/assignments/${assignment._id}`} target="_blank" rel="noreferrer" className={QUIET}>
                <ExternalLink size={13} />
                <span>Try it</span>
              </a>
              <button type="button" aria-label={`Delete the assignment of ${chapter.name}`} onClick={() => remove(assignment)} className={`${QUIET} hover:text-rose-600`}>
                <Trash2 size={13} />
              </button>
            </>
          ) : (
            <button type="button" data-testid="assignment-add" onClick={() => setEditing({ chapter, assignment: null })} className={`${SMALL_BUTTON} bg-blue-600 hover:bg-blue-700 text-white`}>
              <Plus size={13} />
              <span>Add assignment</span>
            </button>
          )}
        </div>
      </li>
    );
  };

  return (
    <div data-testid="assignments-panel" className="space-y-5">
      <section className={`${CARD} p-5 sm:p-6`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300">
              <ListChecks size={22} />
            </span>
            <div>
              <h2 className="text-lg font-black text-slate-950 dark:text-white">Assignments</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                One assignment of multiple-choice questions for each chapter. Students find it under the chapter on the course page, and see at once
                whether each answer is right.
              </p>
            </div>
          </div>
          <label className="shrink-0">
            <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Course</span>
            <select data-testid="assignment-course-select" className={`${INPUT} min-w-[14rem]`} value={courseId} onChange={(event) => setCourseId(event.target.value)}>
              {courses.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                  {item.status !== 'published' ? ' (draft)' : ''}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className={`${CARD} p-5 sm:p-6`}>
        {status === 'loading' && <p className="text-sm text-slate-500 dark:text-slate-400">Loading the chapters...</p>}
        {status === 'error' && <p className="text-sm text-rose-600">Could not load the assignments. Please try again.</p>}
        {status === 'ready' && courses.length === 0 && <p className="text-sm text-slate-600 dark:text-slate-300">Add a course first, in Courses &amp; Streams.</p>}
        {status === 'ready' && course && chapters.length === 0 && strays.length === 0 && (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {course.name} has no chapters yet. Add its chapters in Courses &amp; Streams, then come back to give each one an assignment.
          </p>
        )}
        {status === 'ready' && chapters.length > 0 && (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">{chapters.map((chapter) => row(chapter, byKey.get(chapter.key)))}</ul>
        )}
        {status === 'ready' && strays.length > 0 && (
          <div className="mt-5 border-t border-slate-200 dark:border-slate-800 pt-4">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">For chapters that are no longer in the course (students do not see these)</p>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {strays.map((assignment) => row({ key: assignment.chapterKey, name: assignment.chapterName || `Chapter ${assignment.chapterKey}` }, assignment))}
            </ul>
          </div>
        )}
      </section>

      {editing && course && (
        <AssignmentEditor
          course={course}
          chapter={editing.chapter}
          assignment={editing.assignment}
          showToast={showToast}
          onSaved={keep}
          onClose={() => setEditing(null)}
        />
      )}
      {results && <ResultsWindow assignment={results} onClose={() => setResults(null)} />}
    </div>
  );
}
