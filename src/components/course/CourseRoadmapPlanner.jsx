import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import ExamPlannerModal from '../exam-planner/ExamPlannerModal';
import { readProgress, writeProgress } from '../exam-planner/plannerProgress';
import ReelWatch from '../highlights/ReelWatch';
import CourseLecturePlayer from './CourseLecturePlayer';
import { LessonPrompt } from './CourseCurriculum';
import { firstLessonIn, flattenChapters, withExtraLessons } from './curriculumTree';
import { isFinishedPart, partOf, planDays } from './roadmapPlan';
import { mediaOfVideo } from '../../utils/youtubeLink';
import { fetchRoadmapProgress, saveRoadmapProgress } from '../../services/learningApi';

const SAVE_DELAY_MS = 600;

const chapterLineOf = (topic) =>
  [topic?.chapterNumber !== undefined && topic?.chapterNumber !== '' ? `Ch ${topic.chapterNumber}` : '', topic?.chapterName]
    .filter(Boolean)
    .join(' · ');

/**
 * A roadmap's day-by-day plan over its course page. Video parts play in the YouTube-style player, only
 * their own stretch of the lesson; older lesson steps open in the course's player. Sign-in and buying
 * checks are the course page's own, and a signed-in student's progress is kept on their account.
 */
export default function CourseRoadmapPlanner({
  plan,
  course,
  curriculum,
  theme,
  isSignedIn,
  isStudent = false,
  currentUser = null,
  onClose,
  onEnroll,
  onOpenSignIn,
  access = {},
  onBuy,
  buying = false,
  tracking,
}) {
  const mustBuy = Boolean(access.forSale && !access.owned);
  const chapters = useMemo(() => withExtraLessons(curriculum), [curriculum]);
  const topics = useMemo(() => new Map(flattenChapters(chapters).map((topic) => [topic.nodeId, topic])), [chapters]);
  const [playingId, setPlayingId] = useState(null);
  const [watching, setWatching] = useState(null); // { title, clips, startAt, key }
  const [prompt, setPrompt] = useState(null); // 'sign-in' | 'sign-in-to-buy' | 'enroll' | 'buy'

  // ── Progress: this browser, and the student's account when signed in ──
  const planKey = plan.key || plan.title;
  const localKey = `${course.slug}:${planKey}`;
  const [progress, setProgress] = useState(() => readProgress(localKey));
  const pending = useRef(null);

  useEffect(() => {
    if (!isStudent || !course._id) return undefined;
    let live = true;
    fetchRoadmapProgress(course._id)
      .then((plans) => {
        if (!live) return;
        const saved = plans.find((item) => item.planKey === planKey);
        const local = readProgress(localKey);
        if (saved && (saved.done.length > 0 || local.done.length === 0)) {
          setProgress({ done: saved.done, day: saved.day });
          writeProgress(localKey, { done: saved.done, day: saved.day });
        } else if (local.done.length > 0) {
          // Ticks made in this browser before signing in go to the account
          saveRoadmapProgress(course._id, { planKey, ...local }).catch(() => {});
        }
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [isStudent, course._id, planKey, localKey]);

  const changeProgress = useCallback(
    (next) => {
      setProgress(next);
      writeProgress(localKey, next);
      if (!isStudent || !course._id) return;
      clearTimeout(pending.current);
      pending.current = setTimeout(() => {
        saveRoadmapProgress(course._id, { planKey, done: next.done, day: next.day }).catch(() => {});
      }, SAVE_DELAY_MS);
    },
    [isStudent, course._id, planKey, localKey]
  );
  useEffect(() => () => clearTimeout(pending.current), []);

  // A step can point at a topic with its own lesson, or at a topic with lessons inside it
  const lessonAt = useCallback(
    (nodeId) => {
      const topic = topics.get(nodeId);
      if (!topic) return null;
      return topic.lesson ? topic : firstLessonIn(topic);
    },
    [topics]
  );

  // What a part's card shows and does: play it, or ask to sign in or buy first
  const partInfo = useCallback(
    (part) => {
      const topic = lessonAt(part.nodeId);
      const media = topic ? mediaOfVideo(topic.lesson) : null;
      const thumbnail = media?.kind === 'youtube' ? `https://img.youtube.com/vi/${media.youtubeId}/mqdefault.jpg` : '';
      let state = 'play';
      if (!topic) state = 'missing';
      else if (!isSignedIn) state = 'sign-in';
      else if (topic.lesson.isLocked || !media) state = mustBuy ? 'buy' : 'enroll';
      return { topic, media, thumbnail, state, chapterLine: chapterLineOf(topic) };
    },
    [lessonAt, isSignedIn, mustBuy]
  );

  // The day's parts that can play, as one list for the player; each clip names its step
  const clipsOf = useCallback(
    (dayIndex) => {
      const day = planDays(plan)[dayIndex];
      return (day?.steps || [])
        .map((step, stepIndex) => {
          const part = partOf(step);
          if (!part || !isFinishedPart(part)) return null;
          const info = partInfo(part);
          if (info.state !== 'play') return null;
          return {
            _id: `${dayIndex}-${stepIndex}`,
            stepId: `${dayIndex}-${stepIndex}`,
            title: step.title || part.text,
            lessonTitle: info.topic.title,
            chapter: { number: info.topic.chapterNumber, name: info.topic.chapterName },
            start: Number(part.start),
            end: Number(part.end),
            summary: part.summary,
            points: part.points || [],
            media: info.media,
          };
        })
        .filter(Boolean);
    },
    [plan, partInfo]
  );

  const askFor = (state) => {
    if (state === 'sign-in') setPrompt(mustBuy ? 'sign-in-to-buy' : 'sign-in');
    else if (state === 'buy' || state === 'enroll') setPrompt(state);
  };

  const dayTitle = (dayIndex) => {
    const days = planDays(plan);
    const day = days[dayIndex];
    return [days.length > 1 ? `Day ${dayIndex + 1}` : '', day?.title].filter(Boolean).join(' · ') || plan.title;
  };

  const playPart = (dayIndex, stepIndex) => {
    const part = partOf(planDays(plan)[dayIndex]?.steps?.[stepIndex]);
    if (!part) return;
    const info = partInfo(part);
    if (info.state !== 'play') {
      askFor(info.state);
      return;
    }
    const clips = clipsOf(dayIndex);
    const startAt = Math.max(0, clips.findIndex((clip) => clip.stepId === `${dayIndex}-${stepIndex}`));
    setWatching({ title: dayTitle(dayIndex), clips, startAt, key: Date.now() });
  };

  const playDay = (dayIndex) => {
    const clips = clipsOf(dayIndex);
    if (clips.length === 0) {
      const first = (planDays(plan)[dayIndex]?.steps || []).map(partOf).find(Boolean);
      if (first) askFor(partInfo(first).state);
      return;
    }
    setWatching({ title: dayTitle(dayIndex), clips, startAt: 0, key: Date.now() });
  };

  // A part watched to its end ticks its step
  const progressRef = useRef(progress);
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);
  const partEnded = (index) => {
    const clip = watching?.clips[index];
    if (!clip) return;
    const current = progressRef.current;
    if (!current.done.includes(clip.stepId)) changeProgress({ ...current, done: [...current.done, clip.stepId] });
  };

  useEffect(() => {
    if (!watching) return undefined;
    const onKey = (event) => event.key === 'Escape' && setWatching(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [watching]);

  const openLesson = (nodeId) => {
    const start = lessonAt(nodeId);
    if (!start) return;
    if (!isSignedIn) setPrompt(mustBuy ? 'sign-in-to-buy' : 'sign-in');
    else if (start.lesson.isLocked) setPrompt(mustBuy ? 'buy' : 'enroll');
    else setPlayingId(start.nodeId);
  };

  const closePlayer = useCallback(() => setPlayingId(null), []);

  // Signing in and enrolling open over the page, so the plan closes first. Ticked steps are kept.
  const leaveFor = (action) => {
    setPrompt(null);
    setPlayingId(null);
    setWatching(null);
    onClose();
    action();
  };

  return (
    <>
      <ExamPlannerModal
        isOpen
        onClose={onClose}
        selectedRoadmap={{ ...plan, courseName: course.name }}
        onOpenLesson={openLesson}
        canOpenLesson={(nodeId) => Boolean(lessonAt(nodeId))}
        progressKey={localKey}
        progress={progress}
        onProgressChange={changeProgress}
        partInfo={partInfo}
        onPlayPart={playPart}
        onPlayDay={playDay}
      />

      {watching &&
        createPortal(
          <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-950/80 backdrop-blur-sm" data-testid="roadmap-player">
            <div className="min-h-full max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
              <div className="rounded-3xl bg-white dark:bg-[#0B0F19] p-4 sm:p-6 shadow-2xl">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">{plan.title}</p>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white truncate">{watching.title}</h2>
                  </div>
                  <button
                    type="button"
                    aria-label="Close the player"
                    onClick={() => setWatching(null)}
                    className="shrink-0 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>
                <ReelWatch
                  key={watching.key}
                  clips={watching.clips}
                  title={watching.title}
                  autoPlay
                  startAt={watching.startAt}
                  currentUser={currentUser}
                  onOpenSignIn={onOpenSignIn}
                  saveable={false}
                  onPartEnd={partEnded}
                />
              </div>
            </div>
          </div>,
          document.body
        )}

      {playingId && (
        <CourseLecturePlayer
          course={course}
          chapters={chapters}
          theme={theme}
          startId={playingId}
          onClose={closePlayer}
          onLocked={() => setPrompt(mustBuy ? 'buy' : 'enroll')}
          tracking={tracking}
          onAsk={(topic) => leaveFor(() => onEnroll(`${course.name} help: ${topic.title}`))}
        />
      )}

      {prompt && (
        <LessonPrompt
          prompt={prompt}
          course={course}
          onClose={() => setPrompt(null)}
          onSignIn={() => leaveFor(onOpenSignIn)}
          onEnroll={() => leaveFor(() => onEnroll(course.name))}
          onBuy={() => leaveFor(onBuy)}
          buying={buying}
        />
      )}
    </>
  );
}
