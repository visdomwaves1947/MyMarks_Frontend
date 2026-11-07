import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, GraduationCap, PlayCircle } from 'lucide-react';
import useMyCourses, { byLastActivity, continueLink } from '../../hooks/useMyCourses';
import { courseImage, showDefaultImage } from '../../utils/courseImage';
import { formatClock } from '../../utils/watchTime';

const day = (value) => (value ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '');

/**
 * The courses a student bought (or was given), how many lessons they finished, and where they
 * stopped, with a button straight back into the last lesson. Used on the profile and on My Courses.
 */
export default function MyCourses({ currentUser }) {
  const { status, courses: unsorted } = useMyCourses(currentUser);
  const courses = [...unsorted].sort(byLastActivity);

  return (
    <div
      data-testid="my-courses"
      className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-7"
    >
      <div className="flex items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <GraduationCap size={18} />
          </div>
          <span>My Courses</span>
        </h2>
        {courses.length > 0 && (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {courses.length} {courses.length === 1 ? 'course' : 'courses'}
          </span>
        )}
      </div>

      {status === 'loading' && <p className="text-sm text-slate-500 dark:text-slate-400">Loading your courses...</p>}
      {status === 'error' && <p className="text-sm text-slate-500 dark:text-slate-400">Your courses could not be loaded. Please refresh the page.</p>}

      {status === 'ready' && courses.length === 0 && (
        <div className="text-sm text-slate-600 dark:text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span>You have not bought a course yet. The first lessons of every course are free to watch.</span>
          <Link to="/demo#courses" className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-cyan-400 hover:underline shrink-0">
            <span>Explore courses</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => {
            const percent = course.totalLessons > 0 ? Math.round((course.lessonsCompleted / course.totalLessons) * 100) : 0;
            const last = course.lastLesson;
            return (
              <div
                key={course.courseId}
                data-testid="my-course"
                className="flex gap-4 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60"
              >
                <img
                  src={courseImage(course.thumbnail, 240)}
                  alt=""
                  onError={showDefaultImage}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white truncate">{course.name}</h3>
                    {percent === 100 && <CheckCircle2 size={17} className="text-emerald-600 dark:text-emerald-400 shrink-0" aria-label="Every lesson finished" />}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {{ admin: 'Given by MyMarks', demo: 'Bought with a demo payment' }[course.source] || 'Bought'} on {day(course.boughtAt)}
                  </p>

                  <div className="mt-2">
                    <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${percent}%` }} />
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                      {course.lessonsCompleted} of {course.totalLessons} lessons finished
                      {course.lessonsStarted > course.lessonsCompleted ? `, ${course.lessonsStarted - course.lessonsCompleted} started` : ''}
                    </p>
                  </div>

                  {last && (
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      Last: {last.code ? `${last.code}: ` : ''}
                      {last.title}
                      {last.completed ? ' (finished)' : last.position > 0 ? ` at ${formatClock(last.position)}` : ''}
                    </p>
                  )}

                  {/* A soft button: a light border on hover, no underline */}
                  <div className="mt-auto pt-2">
                    <Link
                      to={continueLink(course)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-transparent bg-blue-50 dark:bg-cyan-950/30 text-xs sm:text-sm font-semibold text-blue-600 dark:text-cyan-400 hover:border-blue-300 dark:hover:border-cyan-700 hover:bg-blue-100/70 dark:hover:bg-cyan-950/50 transition-colors duration-200"
                    >
                      <PlayCircle size={15} />
                      <span>{course.lessonsStarted > 0 ? 'Continue' : 'Start learning'}</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
