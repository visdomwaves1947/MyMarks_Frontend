import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, X } from 'lucide-react';
import useMyCourses, { byLastActivity, continueLink } from '../../hooks/useMyCourses';
import { courseImage, showDefaultImage } from '../../utils/courseImage';
import { formatClock } from '../../utils/watchTime';

const SHOWN = 3;
const SLIDE_MS = 500;
const STEP_MS = 90;
const AWAY_AT = 240; // scrolled this far down, the cards step aside so they cover nothing
const AUTO_CLOSE_S = 10; // left alone this long, they step aside too

// On the right under the fixed site header, or above the back-to-top button on a phone
const PLACE = 'fixed z-40 inset-x-3 bottom-14 sm:inset-x-auto sm:bottom-auto sm:right-0 sm:top-[132px] lg:top-[136px]';

/**
 * Keeps something on the page while it slides out, and lets it paint once off to the side before it
 * slides in, so the move is seen both ways. Returns { mounted, entered }.
 */
const useSlide = (show, outMs) => {
  const [mounted, setMounted] = useState(show);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (show) {
      setMounted(true);
      let second = 0;
      const first = requestAnimationFrame(() => {
        second = requestAnimationFrame(() => setEntered(true));
      });
      return () => {
        cancelAnimationFrame(first);
        cancelAnimationFrame(second);
      };
    }
    setEntered(false);
    const timer = setTimeout(() => setMounted(false), outMs);
    return () => clearTimeout(timer);
  }, [show, outMs]);

  return { mounted: mounted || show, entered: show && entered };
};

const useScrolledAway = () => {
  const [away, setAway] = useState(() => typeof window !== 'undefined' && window.scrollY > AWAY_AT);
  useEffect(() => {
    const onScroll = () => setAway(window.scrollY > AWAY_AT);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return away;
};

const detailOf = (course) => {
  const last = course.lastLesson;
  if (last && !last.completed) {
    return `${last.code ? `${last.code}: ` : ''}${last.title}${last.position > 0 ? ` at ${formatClock(last.position)}` : ''}`;
  }
  return `${course.lessonsCompleted} of ${course.totalLessons} lessons finished`;
};

/**
 * For a signed-in student with courses: their latest courses as cards that slide in from the right side
 * of the home page, each opening the course at the lesson they were watching. The cross slides them
 * away to a small Continue tab at the edge, which brings them back; so does the next page load. They
 * also step aside by themselves after 10 seconds (not while the pointer is on them) and while the page
 * is scrolled down, coming back when it is scrolled to the top again.
 */
export default function ContinueLearning({ currentUser }) {
  const { status, courses } = useMyCourses(currentUser);
  const [closed, setClosed] = useState(false);
  const [pinned, setPinned] = useState(false); // opened from the tab while scrolled down
  const away = useScrolledAway();

  const ready = status === 'ready' && courses.length > 0;
  const showCards = ready && !closed && (!away || pinned);
  const cards = useSlide(showCards, SLIDE_MS + STEP_MS * (SHOWN + 1));
  const tab = useSlide(ready && !showCards, 300);

  // 10 seconds each time they come in, paused while the pointer or focus is on them. The pause is read
  // at each tick, so it counts from the moment the pointer arrives.
  const [left, setLeft] = useState(AUTO_CLOSE_S);
  const [held, setHeld] = useState(false);
  const heldRef = useRef(false);
  const hold = (value) => {
    heldRef.current = value;
    setHeld(value);
  };
  useEffect(() => {
    if (showCards) setLeft(AUTO_CLOSE_S);
  }, [showCards]);
  useEffect(() => {
    if (!cards.entered) return undefined;
    const timer = setInterval(() => {
      if (!heldRef.current) setLeft((seconds) => seconds - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cards.entered]);
  useEffect(() => {
    if (left > 0) return;
    setClosed(true);
    setPinned(false);
  }, [left]);

  if (!ready) return null;

  const latest = [...courses].sort(byLastActivity).slice(0, SHOWN);
  const firstName = String(currentUser.fullName || currentUser.name || '').trim().split(/\s+/)[0];
  const count = latest.length + 2; // the welcome card, the courses and the link
  // In from the right one after another, and out again in the other order
  const slide = (index) => ({
    className: `transition-[transform,opacity] ease-out motion-reduce:transition-none ${
      cards.entered ? 'pointer-events-auto translate-x-0 opacity-100' : 'translate-x-[115%] opacity-0'
    }`,
    style: {
      transitionDuration: `${SLIDE_MS}ms`,
      transitionDelay: `${(cards.entered ? index : count - 1 - index) * STEP_MS}ms`,
    },
  });
  const welcome = slide(0);
  const more = slide(latest.length + 1);

  return (
    <>
      {cards.mounted && (
        <section
          data-testid="continue-learning"
          aria-label="Continue learning"
          data-closes-in={left}
          data-held={held ? 'true' : undefined}
          onMouseEnter={() => hold(true)}
          onMouseLeave={() => hold(false)}
          onFocus={() => hold(true)}
          onBlur={() => hold(false)}
          className={`${PLACE} sm:w-[350px] sm:pl-6 sm:pr-4 pb-2 overflow-hidden pointer-events-none`}
        >
          <div className="flex flex-col gap-2 sm:gap-2.5">
            <div
              style={welcome.style}
              className={`${welcome.className} relative overflow-hidden flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-lg`}
            >
              {/* The time left before the cards step aside */}
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-0.5 bg-blue-500/80 transition-[width] duration-1000 ease-linear"
                style={{ width: `${(Math.max(left, 0) / AUTO_CLOSE_S) * 100}%` }}
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {firstName ? `Welcome back, ${firstName}` : 'Welcome back'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Continue where you stopped</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setClosed(true);
                  setPinned(false);
                }}
                aria-label="Close continue learning"
                title="Close"
                className="group w-8 h-8 shrink-0 inline-flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors duration-200 cursor-pointer"
              >
                <X size={16} className="transition-transform duration-300 group-hover:rotate-90 motion-reduce:transition-none" />
              </button>
            </div>

            {latest.map((course, index) => {
              const percent = course.totalLessons > 0 ? Math.round((course.lessonsCompleted / course.totalLessons) * 100) : 0;
              const motion = slide(index + 1);
              return (
                <Link
                  key={course.courseId}
                  to={continueLink(course)}
                  data-testid="continue-course"
                  style={motion.style}
                  className={`${motion.className} ${index > 0 ? 'hidden sm:flex' : 'flex'} group items-center gap-3 p-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-lg hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl`}
                >
                  <img
                    src={courseImage(course.thumbnail, 120)}
                    alt=""
                    onError={showDefaultImage}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-900 dark:text-white truncate">{course.name}</span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 truncate">{detailOf(course)}</span>
                    <span className="mt-1 block h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <span className="block h-full bg-emerald-500 transition-[width] duration-500" style={{ width: `${percent}%` }} />
                    </span>
                  </span>
                  <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-600 group-hover:bg-blue-500 text-white text-xs font-semibold transition-colors">
                    <Play size={12} className="fill-white" />
                    <span>{course.lessonsStarted > 0 ? 'Continue' : 'Start'}</span>
                  </span>
                </Link>
              );
            })}

            <div style={more.style} className={`${more.className} hidden sm:flex justify-end`}>
              <Link
                to="/my-courses"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 shadow-md text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:border-blue-300 dark:hover:border-cyan-700 transition-colors duration-200"
              >
                <span>All my courses</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {tab.mounted && (
        <button
          type="button"
          onClick={() => {
            setClosed(false);
            setPinned(away);
          }}
          data-testid="continue-reopen"
          aria-label="Open continue learning"
          title="Continue where you stopped"
          tabIndex={tab.entered ? 0 : -1}
          className={`fixed z-40 right-0 bottom-14 sm:bottom-auto sm:top-[132px] lg:top-[136px] inline-flex items-center gap-1.5 pl-3 pr-3.5 py-2 rounded-l-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg cursor-pointer transition-transform duration-300 ease-out motion-reduce:transition-none ${
            tab.entered ? 'translate-x-0' : 'translate-x-full pointer-events-none'
          }`}
        >
          <Play size={12} className="fill-white" />
          <span>Continue</span>
        </button>
      )}
    </>
  );
}
