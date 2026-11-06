import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, Gift, PlayCircle, RefreshCw, Trash2 } from 'lucide-react';
import useDialog from '../../../hooks/useDialog';
import { fetchAdminCourses } from '../../../services/courseApi';
import { fetchStudentLearning, grantStudentCourse, revokeStudentCourse } from '../../../services/adminLearningApi';
import { formatClock, watchedPercent } from '../../../utils/watchTime';

const when = (value) =>
  value
    ? new Date(value).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })
    : '';

const rupees = (paise) => `₹${(Number(paise || 0) / 100).toLocaleString('en-IN')}`;

const STATUS = {
  razorpay: { label: 'Bought online', style: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60' },
  admin: { label: 'Given by admin', style: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60' },
  revoked: { label: 'Removed', style: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' },
  created: { label: 'Payment not finished', style: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60' },
};

const statusOf = (purchase) => (purchase.status === 'paid' ? STATUS[purchase.source] || STATUS.razorpay : STATUS[purchase.status]);

function SectionTitle({ icon: Icon, title, detail }) {
  return (
    <div className="flex items-center justify-between gap-2 mb-2">
      <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
        <Icon size={15} className="text-blue-600 dark:text-blue-400" />
        <span>{title}</span>
      </h4>
      {detail && <span className="text-[11px] text-slate-500 dark:text-slate-400">{detail}</span>}
    </div>
  );
}

/**
 * In the student's details: the courses they have (bought or given), giving and removing a course,
 * and where they stopped in every lesson they started.
 */
export default function StudentLearning({ student }) {
  const { confirm } = useDialog();
  const studentId = student?._id || student?.id;
  const [state, setState] = useState({ status: 'loading', purchases: [], watching: [], error: '' });
  const [courses, setCourses] = useState([]);
  const [give, setGive] = useState({ courseId: '', note: '' });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null); // { tone, text }
  const [openCourse, setOpenCourse] = useState(null);

  const read = useCallback(
    () =>
      fetchStudentLearning(studentId).then(
        (data) => ({ status: 'ready', purchases: data.purchases || [], watching: data.watching || [], error: '' }),
        (error) => ({ status: 'error', purchases: [], watching: [], error: error.message })
      ),
    [studentId]
  );

  const load = useCallback(async () => setState(await read()), [read]);

  useEffect(() => {
    let live = true;
    read().then((next) => {
      if (live) setState(next);
    });
    fetchAdminCourses()
      .then((list) => {
        if (live) setCourses(list.filter((course) => course.status !== 'archived').sort((a, b) => a.name.localeCompare(b.name)));
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [read]);

  // Every course the student has now, then removed ones, then one unfinished payment per course they do not have
  const rows = useMemo(() => {
    const owned = new Set(state.purchases.filter((item) => item.status === 'paid').map((item) => item.courseId));
    const unfinished = new Set();
    return state.purchases.filter((item) => {
      if (item.status !== 'created') return true;
      if (owned.has(item.courseId) || unfinished.has(item.courseId)) return false;
      unfinished.add(item.courseId);
      return true;
    });
  }, [state.purchases]);

  const ownedIds = useMemo(
    () => new Set(state.purchases.filter((item) => item.status === 'paid').map((item) => item.courseId)),
    [state.purchases]
  );

  const giveCourse = async () => {
    if (!give.courseId) return;
    setBusy(true);
    setMessage(null);
    try {
      const data = await grantStudentCourse(studentId, give.courseId, give.note);
      setGive({ courseId: '', note: '' });
      setMessage({ tone: 'good', text: data.message });
      await load();
    } catch (error) {
      setMessage({ tone: 'bad', text: error.message });
    } finally {
      setBusy(false);
    }
  };

  const removeCourse = async (purchase) => {
    const ok = await confirm({
      title: `Remove ${purchase.courseName}?`,
      message:
        purchase.source === 'razorpay'
          ? 'Its lessons lock again for this student. Any refund is made in the Razorpay Dashboard; this does not refund the payment.'
          : 'Its lessons lock again for this student.',
      confirmLabel: 'Remove',
      tone: 'danger',
    });
    if (!ok) return;
    setBusy(true);
    setMessage(null);
    try {
      const data = await revokeStudentCourse(studentId, purchase.id);
      setMessage({ tone: 'good', text: data.message });
      await load();
    } catch (error) {
      setMessage({ tone: 'bad', text: error.message });
    } finally {
      setBusy(false);
    }
  };

  if (!studentId) return null;

  return (
    <div data-testid="student-learning" className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 space-y-5 text-xs">
      {state.status === 'loading' && <p className="text-slate-500 dark:text-slate-400">Loading courses and watching...</p>}

      {state.status === 'error' && (
        <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300">
          <span>{state.error}</span>
          <button type="button" onClick={load} className="inline-flex items-center gap-1 font-semibold cursor-pointer">
            <RefreshCw size={13} />
            <span>Try again</span>
          </button>
        </div>
      )}

      {state.status === 'ready' && (
        <>
          <section>
            <SectionTitle icon={BookOpen} title="Courses" detail={`${ownedIds.size} active`} />
            {rows.length === 0 ? (
              <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 text-slate-500 dark:text-slate-400">
                No courses yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {rows.map((purchase) => {
                  const status = statusOf(purchase);
                  return (
                    <li
                      key={purchase.id}
                      data-testid="student-course"
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 flex flex-wrap items-start justify-between gap-2"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-white">{purchase.courseName}</span>
                          <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${status.style}`}>{status.label}</span>
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 space-x-2">
                          <span>{purchase.source === 'admin' ? 'Free' : rupees(purchase.amount)}</span>
                          <span>· {when(purchase.status === 'revoked' ? purchase.revokedAt : purchase.paidAt || purchase.createdAt)}</span>
                        </div>
                        {(purchase.razorpayPaymentId || (purchase.status === 'created' && purchase.razorpayOrderId)) && (
                          <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400 break-all">
                            {purchase.razorpayPaymentId ? `Payment ${purchase.razorpayPaymentId}` : `Order ${purchase.razorpayOrderId}`}
                          </div>
                        )}
                        {purchase.note && <div className="text-slate-600 dark:text-slate-300">{purchase.note}</div>}
                      </div>
                      {purchase.status === 'paid' && (
                        <button
                          type="button"
                          onClick={() => removeCourse(purchase)}
                          disabled={busy}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold cursor-pointer disabled:opacity-50"
                        >
                          <Trash2 size={13} />
                          <span>Remove</span>
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="mt-3 p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 space-y-2">
              <p className="font-semibold text-slate-800 dark:text-slate-200">Give a course</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">For a student who paid another way, such as cash or UPI. Its lessons open at once.</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  aria-label="Course to give"
                  value={give.courseId}
                  onChange={(event) => setGive((current) => ({ ...current, courseId: event.target.value }))}
                  className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  <option value="">Choose a course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id} disabled={ownedIds.has(course._id)}>
                      {course.name}
                      {ownedIds.has(course._id) ? ' (has it)' : ''}
                    </option>
                  ))}
                </select>
                <input
                  aria-label="Note"
                  value={give.note}
                  maxLength={200}
                  onChange={(event) => setGive((current) => ({ ...current, note: event.target.value }))}
                  placeholder="Note, e.g. Paid by UPI on 6 Nov"
                  className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={giveCourse}
                  disabled={!give.courseId || busy}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold cursor-pointer"
                >
                  <Gift size={13} />
                  <span>Give Course</span>
                </button>
              </div>
              {message && (
                <p className={message.tone === 'good' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>{message.text}</p>
              )}
            </div>
          </section>

          <section>
            <SectionTitle icon={PlayCircle} title="Watching" detail="Where the student stopped in each lesson" />
            {state.watching.length === 0 ? (
              <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 text-slate-500 dark:text-slate-400">
                Has not watched any lesson yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {state.watching.map((group) => {
                  const isOpen = openCourse === group.courseId || state.watching.length === 1;
                  return (
                    <li key={group.courseId} data-testid="student-watching" className="rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80">
                      <button
                        type="button"
                        onClick={() => setOpenCourse(isOpen ? null : group.courseId)}
                        className="w-full p-3 flex flex-wrap items-center justify-between gap-2 text-left cursor-pointer"
                      >
                        <span className="font-semibold text-slate-900 dark:text-white">{group.courseName}</span>
                        <span className="text-slate-500 dark:text-slate-400">
                          {group.lessonsStarted} started · {group.lessonsCompleted} finished · last {when(group.lastWatchedAt)}
                        </span>
                      </button>
                      {isOpen && (
                        <ul className="px-3 pb-3 space-y-1.5">
                          {group.lessons.map((lesson) => (
                            <li key={lesson.lessonKey} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="text-slate-900 dark:text-white">
                                    {lesson.code ? `${lesson.code}: ` : ''}
                                    {lesson.title}
                                  </div>
                                  {lesson.chapterName && <div className="text-[11px] text-slate-500 dark:text-slate-400">{lesson.chapterName}</div>}
                                </div>
                                <div className="text-right shrink-0">
                                  {lesson.completed ? (
                                    <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                                      <CheckCircle2 size={13} />
                                      <span>Finished</span>
                                    </span>
                                  ) : (
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                                      Stopped at {formatClock(lesson.position)}
                                      {lesson.duration > 0 ? ` of ${formatClock(lesson.duration)}` : ''}
                                    </span>
                                  )}
                                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{when(lesson.updatedAt)}</div>
                                </div>
                              </div>
                              <div className="mt-2 h-1 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                <div className="h-full bg-blue-600" style={{ width: `${watchedPercent(lesson)}%` }} />
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
