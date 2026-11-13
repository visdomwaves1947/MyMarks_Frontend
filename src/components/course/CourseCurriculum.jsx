import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Layers,
  ListTree,
  Lock,
  LogIn,
  Play,
  RotateCcw,
  Search,
  ShoppingCart,
  Sparkles,
  Tag,
  Tv,
  X,
} from 'lucide-react';
import { courseImage, formatPrice, showDefaultImage } from '../../utils/courseImage';
import { formatClock, lessonKeysOf, savedFor, watchedPercent } from '../../utils/watchTime';
import CourseLecturePlayer from './CourseLecturePlayer';
import CourseAssignments from './CourseAssignments';
import { firstLessonIn, flattenChapters, isVideoLesson, withExtraLessons } from './curriculumTree';

const normalize = (value) =>
  (value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const matchesSearch = (topic, query) => {
  const raw = query.toLowerCase();
  const normalized = normalize(query);
  const tokens = normalized.split(' ').filter(Boolean);
  const fields = [topic.title, topic.code, topic.chapterName, ...(topic.keywords || [])].map(normalize);

  return (
    (topic.title || '').toLowerCase().includes(raw) ||
    fields.some((field) => field.includes(normalized)) ||
    (tokens.length > 0 && tokens.every((token) => fields.some((field) => field.includes(token))))
  );
};

// Every subtopic below a topic, for the card's syllabus preview
const subtopicsOf = (topic) => flattenChapters([{ chapterId: '', name: '', topics: topic.children || [] }]);

const PROMPTS = {
  'sign-in': {
    label: 'Sign in required',
    title: 'Sign In to Watch',
    text: (course) => `Please sign in to watch the ${course.name} lessons.`,
    button: () => 'Sign In',
    Icon: LogIn,
  },
  'sign-in-to-buy': {
    label: 'Sign in required',
    title: 'Sign In to Buy',
    text: (course) => `Sign in first, then buy ${course.name} to watch every lesson.`,
    button: () => 'Sign In',
    Icon: LogIn,
  },
  enroll: {
    label: 'Enrollment required',
    title: 'Enroll to Watch',
    text: (course) => `This lesson is part of the full ${course.name} course.`,
    button: (course) => `Enroll in ${course.name}`,
    Icon: LogIn,
  },
  buy: {
    label: 'Buy this course',
    title: 'Buy to Watch',
    text: (course) => `This lesson opens once you buy ${course.name}. The free lessons are open to watch now.`,
    button: (course) => `Buy for ${formatPrice(course.price)}`,
    Icon: ShoppingCart,
  },
  // A chapter assignment pressed by a visitor, or by a student without the course
  'sign-in-assignment': {
    label: 'Sign in required',
    title: 'Sign In to Take It',
    text: (course) => `Please sign in to take the ${course.name} chapter assignments.`,
    button: () => 'Sign In',
    Icon: LogIn,
  },
  'buy-assignment': {
    label: 'Buy this course',
    title: 'Buy to Take It',
    text: (course) => `The chapter assignments open once you buy ${course.name}.`,
    button: (course) => `Buy for ${formatPrice(course.price)}`,
    Icon: ShoppingCart,
  },
};

export function LessonPrompt({ prompt, course, onClose, onSignIn, onEnroll, onBuy, buying = false }) {
  const shown = PROMPTS[prompt] || PROMPTS.enroll;
  const isSignIn = prompt === 'sign-in' || prompt === 'sign-in-to-buy' || prompt === 'sign-in-assignment';
  const act = isSignIn ? onSignIn : prompt === 'buy' || prompt === 'buy-assignment' ? onBuy : onEnroll;
  const { Icon } = shown;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-label={shown.label}
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-center"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center">
          <Lock size={24} />
        </div>

        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{shown.title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">{shown.text(course)}</p>

        <button
          onClick={act}
          disabled={buying}
          className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <Icon size={16} />
          <span>{buying ? 'Opening payment...' : shown.button(course)}</span>
        </button>
      </div>
    </div>
  );
}

// The lessons of a topic: its own and every one under it, in page order
const lessonsUnder = (topic) => {
  const found = [];
  const visit = (node) => {
    if (node.lesson) found.push(node);
    (node.children || []).forEach(visit);
  };
  visit(topic);
  return found;
};

/**
 * How far the student got in a topic with subtopics: lessons finished out of all of them, whether they
 * are part way, and the lesson to carry on with (the one they stopped in last, or the next unfinished).
 * Null for a topic without subtopics, whose card shows its own lesson.
 */
const topicProgressOf = (topic, lessons) => {
  if (!(topic.children?.length > 0)) return null;
  const all = lessonsUnder(topic).map((node) => ({ node, saved: savedFor(lessons, node) }));
  if (all.length === 0) return null;
  const finished = all.filter((item) => item.saved?.completed).length;
  const started = all
    .filter((item) => item.saved && !item.saved.completed && item.saved.position > 0)
    .sort((a, b) => new Date(b.saved.updatedAt || 0) - new Date(a.saved.updatedAt || 0));
  const watching = finished < all.length && (finished > 0 || started.length > 0);
  const nextUnfinished = all.find((item) => !item.saved?.completed && !item.node.lesson.isLocked);
  return {
    total: all.length,
    finished,
    watching,
    target: watching ? started[0]?.node || nextUnfinished?.node || null : null,
  };
};

// Lesson card for the curriculum grid, with a preview of its subtopics
function TopicCard({
  topic,
  theme,
  isSearching,
  onOpen,
  fallbackImage = '',
  lockedLabel = 'Locked',
  saved,
  progress = null,
  showFree = false,
}) {
  const { lesson } = topic;
  const subtopics = useMemo(() => subtopicsOf(topic), [topic]);
  const hasChildren = subtopics.length > 0;
  const startsLesson = lesson || firstLessonIn(topic);
  const isLocked = Boolean(lesson?.isLocked);
  const thumbnail =
    lesson?.thumbnailUrl ||
    (lesson?.youtubeId ? `https://img.youtube.com/vi/${lesson.youtubeId}/hqdefault.jpg` : '') ||
    (isLocked ? fallbackImage : '');
  // A topic with subtopics counts all its lessons; a single lesson counts itself
  const watched = progress ? Math.round((progress.finished / progress.total) * 100) : watchedPercent(saved);
  const allWatched = progress ? progress.finished === progress.total : Boolean(saved?.completed);
  const watching = progress ? progress.watching : watched > 0 && watched < 100;

  const open = () => {
    if (startsLesson) onOpen(progress?.target || topic);
  };

  return (
    <div
      data-testid="course-topic"
      className={`group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border ${
        hasChildren ? theme.edge : 'border-slate-200/80 dark:border-slate-800'
      } hover:-translate-y-1`}
    >
      <div onClick={open} className={`relative aspect-video w-full overflow-hidden bg-slate-900 ${startsLesson ? 'cursor-pointer' : ''}`}>
        {thumbnail ? (
          <img
            src={courseImage(thumbnail, 480)}
            alt={topic.title}
            loading="lazy"
            onError={showDefaultImage}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex items-center justify-center">
            <BookOpen size={34} className="text-slate-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-85 group-hover:opacity-65 transition-opacity" />

        {topic.code && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg backdrop-blur-md bg-black/65 text-white font-mono text-xs font-bold border border-white/15 flex items-center gap-1.5 shadow-sm">
            <Layers size={12} className="text-white/80" />
            <span>Lesson {topic.code}</span>
          </div>
        )}

        {startsLesson && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`w-12 h-12 rounded-full text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ring-4 ring-white/30 ${
                isLocked ? 'bg-slate-700' : 'bg-red-600 shadow-red-600/40'
              }`}
            >
              {isLocked ? <Lock size={20} /> : <Play size={20} className="ml-0.5 fill-white" />}
            </div>
          </div>
        )}

        {lesson && (
          <div className="absolute bottom-2.5 right-3 text-[11px] font-bold text-white/90 drop-shadow flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse"></span>
            <span>
              {isLocked ? 'Locked Lesson' : lesson.youtubeId ? 'YouTube Lecture' : isVideoLesson(lesson) ? 'Video Lecture' : 'Lesson Link'}
            </span>
          </div>
        )}

        {(allWatched || watching || (showFree && lesson?.isFreePreview && !isLocked)) && (
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
            {allWatched && (
              <span
                data-testid="lesson-completed"
                className="px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-[11px] font-semibold flex items-center gap-1 shadow-sm"
              >
                <CheckCircle2 size={12} />
                <span>Watched</span>
              </span>
            )}
            {!allWatched && watching && (
              <span
                data-testid="lesson-watching"
                className="px-2 py-0.5 rounded-lg bg-blue-600 text-white text-[11px] font-semibold flex items-center gap-1 shadow-sm"
              >
                <Play size={10} className="fill-white" />
                <span>Watching{progress ? ` · ${progress.finished}/${progress.total}` : ''}</span>
              </span>
            )}
            {showFree && lesson?.isFreePreview && !isLocked && (
              <span data-testid="lesson-free" className="px-2 py-0.5 rounded-lg bg-white/95 text-emerald-700 text-[11px] font-semibold shadow-sm">
                Free
              </span>
            )}
          </div>
        )}

        {watched > 0 && (
          <div
            data-testid="lesson-watched"
            className="absolute bottom-0 inset-x-0 h-1 bg-white/25"
            title={
              progress
                ? `${progress.finished} of ${progress.total} lessons finished`
                : saved?.completed
                  ? 'Watched'
                  : `Stopped at ${formatClock(saved.position)}`
            }
          >
            <div className="h-full bg-red-500" style={{ width: `${watched}%` }} />
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className={`text-[11px] font-extrabold tracking-wider uppercase ${theme.accent} mb-2 truncate`}>
            {topic.chapterName}
          </div>

          <h3
            onClick={open}
            title={topic.title}
            className={`text-base font-bold text-slate-900 dark:text-white line-clamp-2 transition-colors leading-snug mb-2 ${
              startsLesson ? 'cursor-pointer hover:opacity-80' : ''
            }`}
          >
            {topic.code && <span className={`${theme.accent} font-extrabold mr-1.5`}>{topic.code}:</span>}
            {topic.title}
          </h3>

          {topic.description && (
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">{topic.description}</p>
          )}

          {hasChildren && (
            <div className={`mb-3 p-2.5 rounded-xl ${theme.soft}`}>
              <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <ListTree size={12} />
                  <span>Interactive Syllabus</span>
                </span>
                <span className="text-[10px] font-mono font-bold">{subtopics.length} Subtopics</span>
              </div>
              {progress && (progress.finished > 0 || progress.watching) && (
                <div data-testid="topic-progress" className="mb-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={11} className="text-emerald-600 dark:text-emerald-400" />
                      <span>
                        {progress.finished} of {progress.total} finished
                      </span>
                    </span>
                    <span className="font-mono">{watched}%</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-white/70 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500 transition-[width] duration-500" style={{ width: `${watched}%` }} />
                  </div>
                </div>
              )}
              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                Includes {subtopics.slice(0, 3).map((item) => `${item.code ? `${item.code} ` : ''}${item.title}`).join(' • ')}
                {subtopics.length > 3 ? ' with complete collapsible navigation inside the lecture.' : '.'}
              </p>
            </div>
          )}

          {isSearching && topic.trail?.length > 0 && (
            <div className="mb-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold max-w-full truncate">
              <Tag size={10} className="shrink-0" />
              <span className="truncate">{topic.trail.map((step) => step.title).join(' / ')}</span>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
          {startsLesson ? (
            <button
              onClick={open}
              className={`flex-1 py-2.5 px-3 rounded-xl ${theme.solid} text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm`}
            >
              {isLocked ? <Lock size={14} /> : <Play size={14} className="fill-white" />}
              <span>
                {isLocked ? lockedLabel : `${watching ? 'Continue' : 'Watch Lecture'}${topic.code ? ` (${topic.code})` : ''}`}
              </span>
            </button>
          ) : (
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Lesson coming soon</span>
          )}

          {lesson?.url && !isLocked && (
            <a
              href={lesson.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title={`Open ${topic.title}`}
              aria-label={`Open ${topic.title} in a new tab`}
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

const NO_TRACKING = { progress: { lessons: {}, last: null }, update: undefined, enabled: false, ready: true };

export default function CourseCurriculum({
  course,
  curriculum,
  theme,
  isSignedIn,
  onEnroll,
  onOpenSignIn,
  access = {},
  onBuy,
  buying = false,
  cart = null,
  tracking = NO_TRACKING,
  currentUser = null,
}) {
  const intro = course.page?.curriculumIntro || {};
  const modules = course.page?.modules || [];

  // Some subjects have syllabus modules but no lessons yet
  const [view, setView] = useState(
    curriculum.chapters.length === 0 && modules.length > 0 ? 'modules' : 'lectures'
  );
  const [selectedChapter, setSelectedChapter] = useState('all');
  const [search, setSearch] = useState('');
  const [playingId, setPlayingId] = useState(null);
  const [prompt, setPrompt] = useState(null); // a key of PROMPTS, such as 'sign-in' or 'buy'
  // Sold online and not bought yet: every lesson is locked, and Buy replaces Enroll
  const mustBuy = Boolean(access.forSale && !access.owned);

  const chapters = useMemo(() => withExtraLessons(curriculum), [curriculum]);
  const allTopics = useMemo(() => flattenChapters(chapters), [chapters]);
  const topLevelCount = useMemo(() => chapters.reduce((sum, chapter) => sum + chapter.topics.length, 0), [chapters]);
  const lessonCount = useMemo(() => allTopics.filter((topic) => topic.lesson).length, [allTopics]);

  const query = search.trim();
  const isSearching = query.length > 0;

  const visibleTopics = useMemo(() => {
    if (isSearching) {
      const matches = allTopics.filter((topic) => matchesSearch(topic, query));
      return selectedChapter === 'all' ? matches : matches.filter((topic) => topic.chapterId === selectedChapter);
    }
    return allTopics.filter(
      (topic) => topic.trail.length === 0 && (selectedChapter === 'all' || topic.chapterId === selectedChapter)
    );
  }, [allTopics, isSearching, query, selectedChapter]);

  // Opens the full-page player at this topic, or at the first lesson inside it
  const openLecture = (topic) => {
    const start = topic.lesson ? topic : firstLessonIn(topic);
    if (!start) return;
    if (!isSignedIn) {
      setPrompt(mustBuy && start.lesson.isLocked ? 'sign-in-to-buy' : 'sign-in');
    } else if (start.lesson.isLocked) {
      setPrompt(mustBuy ? 'buy' : 'enroll');
    } else {
      setPlayingId(start.nodeId);
    }
  };

  const closePlayer = useCallback(() => setPlayingId(null), []);
  const [searchParams, setSearchParams] = useSearchParams();
  const wantsContinue = searchParams.has('continue');
  // A lesson to open at a set time, from a time tapped in a note: ?lesson=<video or topic>&t=<seconds>
  const wantedLesson = searchParams.get('lesson');
  const [startOverride, setStartOverride] = useState(null);

  // The lesson the student watched last, to carry on from it
  const lastWatched = useMemo(() => {
    const key = tracking.progress.last;
    if (!key) return null;
    // The saved key may be the lesson's video or its topic
    const entry = allTopics.find((topic) => topic.lesson && !topic.lesson.isLocked && lessonKeysOf(topic).includes(key));
    return entry ? { entry, saved: savedFor(tracking.progress.lessons, entry) } : null;
  }, [allTopics, tracking.progress]);

  // Arriving from My Notes: open that lesson at the time tapped
  useEffect(() => {
    if (!wantedLesson) return;
    const target = allTopics.find((topic) => topic.lesson && (topic.nodeId === wantedLesson || lessonKeysOf(topic).includes(wantedLesson)));
    if (target) {
      const at = Math.max(0, Number(searchParams.get('t')) || 0);
      setStartOverride({ nodeId: target.nodeId, at });
      openLecture(target);
    }
    setSearchParams(
      (params) => {
        params.delete('lesson');
        params.delete('t');
        return params;
      },
      { replace: true }
    );
    // openLecture is a plain function of this render; the effect runs once per link
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wantedLesson, allTopics, setSearchParams]);

  // Arriving from a Continue button: open the lesson the student was watching, or the first one
  useEffect(() => {
    if (!wantsContinue || tracking.ready === false) return;
    const first = allTopics.find((topic) => topic.lesson && !topic.lesson.isLocked);
    const target = lastWatched?.entry || first;
    if (target) openLecture(target);
    setSearchParams(
      (params) => {
        params.delete('continue');
        return params;
      },
      { replace: true }
    );
    // openLecture is a plain function of this render; the effect runs once per Continue click
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wantsContinue, tracking.ready, lastWatched, allTopics, setSearchParams]);

  return (
    <section id="course-curriculum" className="py-16 sm:py-24 bg-[#EBF0F7] dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          {intro.badge && (
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ${theme.soft} text-xs sm:text-sm font-bold mb-4 shadow-xs`}>
              <BookOpen size={15} />
              <span>{intro.badge}</span>
            </div>
          )}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            {intro.heading || `${course.name} Lessons`}
          </h2>
          {intro.subheading && <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-medium">{intro.subheading}</p>}

          {/* The "sample demo videos" notice is for students without the course; once bought, every lesson is open */}
          {intro.noticeTitle && !(access.forSale && access.owned) && !access.adminView && (
            <div
              data-testid="course-sample-notice"
              className="mt-6 p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-600/70 shadow-md text-amber-950 dark:text-amber-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
            >
              <div className="flex items-center sm:items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0 shadow-sm">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-extrabold text-amber-900 dark:text-amber-200">{intro.noticeTitle}</h4>
                  <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300/90 mt-0.5 leading-relaxed">{intro.noticeText}</p>
                </div>
              </div>
              <button
                onClick={() => (mustBuy ? onBuy() : onEnroll(course.name))}
                disabled={buying}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-xs sm:text-sm font-extrabold shadow-md transition-all cursor-pointer shrink-0 inline-flex items-center gap-1.5"
              >
                <span>{mustBuy ? 'Buy Now' : 'Enroll Now'}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          )}

          {modules.length > 0 && (
            <div className="mt-6 inline-flex p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              {[
                ['lectures', Tv, `Video Lectures (${topLevelCount})`],
                ['modules', BookOpen, `Syllabus Modules (${modules.length})`],
              ].map(([id, Icon, label]) => (
                <button
                  key={id}
                  onClick={() => setView(id)}
                  className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    view === id ? `${theme.solid} shadow-sm` : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Icon size={15} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {view === 'modules' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {modules.map((module) => (
              <div
                key={module.key || module.name}
                className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 group hover:-translate-y-1"
              >
                {module.image && (
                  <div className="h-40 w-full overflow-hidden relative shrink-0">
                    <img
                      src={courseImage(module.image, 480)}
                      alt={module.name}
                      loading="lazy"
                      onError={showDefaultImage}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">{module.category}</div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{module.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">{module.desc}</p>
                    {module.topics?.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {module.topics.map((topic) => (
                          <li key={topic} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                            <Tag size={11} className={`mt-0.5 shrink-0 ${theme.accent}`} />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button
                    onClick={() => onEnroll(module.name)}
                    className={`mt-4 w-full py-2.5 rounded-xl ${theme.solid} text-sm font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer`}
                  >
                    <span>Enroll in Module</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : chapters.length === 0 ? (
          <p className="text-center py-14 text-sm text-slate-500 dark:text-slate-400">
            Lessons for this course are being added. Please check back soon.
          </p>
        ) : (
          <>
            {mustBuy && (
              <div
                data-testid="course-buy-strip"
                className="mb-6 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                    <Lock size={18} />
                  </span>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {access.freeLessons > 0 ? (
                      <>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          The first {access.freeLessons === 1 ? 'lesson is' : `${access.freeLessons} lessons are`} free.
                        </span>{' '}
                        Buy {course.name} to open all {lessonCount} lessons for {formatPrice(course.price)}
                        {access.paymentMethod === 'demo' ? ' (demo payment, no real money).' : ', paid securely with Razorpay.'}
                      </>
                    ) : (
                      <>
                        <span className="font-semibold text-slate-900 dark:text-white">Every lesson opens once you buy {course.name}.</span>{' '}
                        {formatPrice(course.price)}
                        {access.paymentMethod === 'demo' ? ' (demo payment, no real money).' : ', paid securely with Razorpay.'}
                      </>
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
                  {cart && (
                    <button
                      type="button"
                      onClick={cart.inCart ? cart.onOpen : cart.onAdd}
                      disabled={!cart.inCart && cart.isFull}
                      className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-60 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
                    >
                      {cart.inCart ? <CheckCircle2 size={15} className="text-emerald-600" /> : <ShoppingCart size={15} />}
                      <span>{cart.inCart ? 'Go to Cart' : 'Add to Cart'}</span>
                    </button>
                  )}
                  <button
                    onClick={onBuy}
                    disabled={buying}
                    className={`px-5 py-2.5 rounded-xl ${theme.solid} disabled:opacity-60 text-sm font-semibold inline-flex items-center gap-2 cursor-pointer`}
                  >
                    <ShoppingCart size={15} />
                    <span>{buying ? 'Opening payment...' : 'Buy Now'}</span>
                  </button>
                </div>
              </div>
            )}
            {lastWatched && (
                <div
                  data-testid="course-continue"
                  className="mb-6 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-10 h-10 rounded-xl ${theme.soft} flex items-center justify-center shrink-0`}>
                      <RotateCcw size={18} />
                    </span>
                    <p className="text-sm text-slate-700 dark:text-slate-300 min-w-0">
                      <span className="block text-xs text-slate-500 dark:text-slate-400">Continue where you stopped</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {lastWatched.entry.code ? `${lastWatched.entry.code}: ` : ''}
                        {lastWatched.entry.title}
                      </span>
                      {lastWatched.saved?.position > 0 && !lastWatched.saved?.completed && (
                        <span className="text-slate-500 dark:text-slate-400"> · at {formatClock(lastWatched.saved.position)}</span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => setPlayingId(lastWatched.entry.nodeId)}
                    className={`px-5 py-2.5 rounded-xl ${theme.solid} text-sm font-semibold inline-flex items-center gap-2 cursor-pointer shrink-0`}
                  >
                    <Play size={14} className="fill-current" />
                    <span>Continue</span>
                  </button>
                </div>
            )}

            <div className="mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none min-w-0">
                {[{ chapterId: 'all', label: `All Topics (${topLevelCount})` }, ...chapters.map((chapter) => ({
                  chapterId: chapter.chapterId,
                  label: `${chapter.number ? `${chapter.number}. ` : ''}${chapter.name} (${chapter.topics.length})`,
                }))].map((item) => (
                  <button
                    key={item.chapterId}
                    onClick={() => setSelectedChapter(item.chapterId)}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      selectedChapter === item.chapterId
                        ? `${theme.solid} shadow-md`
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full lg:w-96 shrink-0">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  aria-label="Search topics"
                  placeholder={intro.searchHint || 'Search topic or code'}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400 shadow-xs"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer p-0.5"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* Each chapter's assignment, with the student's best result */}
            {!isSearching && (
              <CourseAssignments
                course={course}
                chapters={chapters}
                selectedChapter={selectedChapter}
                currentUser={currentUser}
                onLocked={(reason) => setPrompt(reason === 'buy' ? 'buy-assignment' : 'sign-in-assignment')}
              />
            )}

            {visibleTopics.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <BookOpen className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No matching topics found</h3>
                <button
                  onClick={() => {
                    setSearch('');
                    setSelectedChapter('all');
                  }}
                  className={`mt-3 px-4 py-2 rounded-xl ${theme.solid} text-xs font-bold transition-colors cursor-pointer`}
                >
                  View All Topics
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {visibleTopics.map((topic) => (
                  <TopicCard
                    key={topic.nodeId}
                    topic={topic}
                    theme={theme}
                    isSearching={isSearching}
                    onOpen={openLecture}
                    fallbackImage={course.thumbnail}
                    lockedLabel={mustBuy ? 'Buy to Watch' : 'Locked'}
                    showFree={mustBuy}
                    saved={savedFor(tracking.progress.lessons, topic.lesson ? topic : firstLessonIn(topic))}
                    progress={topicProgressOf(topic, tracking.progress.lessons)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        <div className="mt-16 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 border border-blue-700/30 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <h3 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">Need Help with {course.name}?</h3>
            <p className="text-blue-200/80 text-sm sm:text-base max-w-2xl">
              Get 1-on-1 doubt clarification and step-by-step guidance from our faculty.
            </p>
          </div>
          <button
            onClick={() => onEnroll(`${course.name} 1-on-1 Doubt Session`)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg cursor-pointer shrink-0"
          >
            <span>Book 1-on-1 Doubt Session</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {playingId && (
        <CourseLecturePlayer
          key={playingId}
          course={course}
          chapters={chapters}
          theme={theme}
          startId={playingId}
          startOverride={startOverride}
          onJump={(nodeId, at) => {
            setStartOverride(at === undefined ? null : { nodeId, at });
            setPlayingId(nodeId);
          }}
          onClose={closePlayer}
          onLocked={() => setPrompt(mustBuy ? 'buy' : 'enroll')}
          tracking={tracking}
          currentUser={currentUser}
          onOpenSignIn={onOpenSignIn}
          onAsk={(topic) => {
            setPlayingId(null);
            onEnroll(`${course.name} help: ${topic.title}`);
          }}
        />
      )}

      {prompt && (
        <LessonPrompt
          prompt={prompt}
          course={course}
          onClose={() => setPrompt(null)}
          onSignIn={() => {
            setPrompt(null);
            onOpenSignIn();
          }}
          onEnroll={() => {
            setPrompt(null);
            setPlayingId(null);
            onEnroll(course.name);
          }}
          onBuy={() => {
            setPrompt(null);
            setPlayingId(null);
            onBuy();
          }}
          buying={buying}
        />
      )}
    </section>
  );
}
