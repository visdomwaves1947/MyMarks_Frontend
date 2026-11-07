import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  ExternalLink,
  Link2,
  ListTree,
  Lock,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';
import { flattenChapters, isVideoLesson } from './curriculumTree';
import { VideoLesson, YouTubeLesson } from './LessonMedia';
import useLessonTracker from '../../hooks/useLessonTracker';
import { formatClock, lessonKeyOf, resumePoint, savedFor } from '../../utils/watchTime';

const NO_TRACKING = { progress: { lessons: {} }, update: undefined, enabled: false };

// Revisit for a finished lesson, or where the student stopped
function WatchMark({ saved }) {
  if (!saved) return null;
  if (saved.completed) {
    return (
      <span
        data-testid="lesson-revisit"
        title="Finished. Click to watch it again"
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-600/70 dark:bg-emerald-950/40 dark:text-emerald-300 text-[10px] font-bold"
      >
        <RotateCcw size={10} />
        <span>Revisit</span>
      </span>
    );
  }
  if (!(saved.position > 0)) return null;
  return (
    <span className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400" title="Where you stopped">
      {formatClock(saved.position)}
    </span>
  );
}

const matches = (entry, query) => {
  const q = query.toLowerCase();
  return [entry.title, entry.code, entry.description, ...(entry.keywords || [])]
    .some((field) => (field || '').toLowerCase().includes(q));
};

// On large screens the hierarchy scrolls by itself: keep the playing lesson in view there.
// Returns false on phones, where the list is part of the page.
const revealPlaying = (list) => {
  const row = list?.querySelector('[data-playing="true"]');
  if (!row || getComputedStyle(list).overflowY !== 'auto') return false;
  const box = list.getBoundingClientRect();
  const rect = row.getBoundingClientRect();
  if (rect.top < box.top) list.scrollTop += rect.top - box.top - 8;
  else if (rect.bottom > box.bottom) list.scrollTop += rect.bottom - box.bottom + 8;
  return true;
};

// A lesson is finished once it was watched to the end. A topic with no video of its own is finished
// once every lesson under it is.
const isFinished = (node, savedOf) => {
  if (!savedOf) return false;
  if (node.lesson) return !node.lesson.isLocked && Boolean(savedOf(node)?.completed);
  const parts = (node.children || []).filter((child) => child.lesson || child.children?.length > 0);
  return parts.length > 0 && parts.every((child) => isFinished(child, savedOf));
};

const AUTO_NEXT_SECONDS = 10;

/**
 * Shown on the video when a lesson ends: the next lesson starts by itself after 10 seconds, or at once
 * with Play now; Watch again starts this one over, and the cross stops it. A locked next lesson offers
 * to unlock instead, and the last lesson of the course only offers to watch again.
 */
function UpNextCard({ next, onPlay, onReplay, onUnlock, onDismiss, player }) {
  const counting = Boolean(next && !next.lesson.isLocked);
  const [left, setLeft] = useState(AUTO_NEXT_SECONDS);
  const [shown, setShown] = useState(false);
  const playRef = useRef(onPlay);
  useEffect(() => {
    playRef.current = onPlay;
  });

  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!counting) return undefined;
    const timer = setInterval(() => setLeft((seconds) => seconds - 1), 1000);
    return () => clearInterval(timer);
  }, [counting]);

  useEffect(() => {
    if (counting && left <= 0) playRef.current();
  }, [counting, left]);

  const ring = 2 * Math.PI * 16;
  const title = next ? `${next.code ? `${next.code} ` : ''}${next.title}` : '';

  return (
    <div
      data-testid="up-next"
      data-state={shown ? 'shown' : 'entering'}
      role="status"
      aria-live="polite"
      className={`absolute bottom-3 right-3 z-20 w-[290px] max-w-[calc(100%-24px)] rounded-2xl bg-slate-900/95 text-white border border-white/15 shadow-2xl backdrop-blur p-3.5 transition-all duration-300 ease-out motion-reduce:transition-none ${
        shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      }`}
    >
      <div className="flex items-start gap-3">
        {counting ? (
          <span className="relative w-10 h-10 shrink-0" aria-hidden="true">
            <svg viewBox="0 0 40 40" className="w-10 h-10 -rotate-90">
              <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/15" />
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={ring}
                strokeDashoffset={ring * (1 - left / AUTO_NEXT_SECONDS)}
                className="text-emerald-400 transition-[stroke-dashoffset] duration-1000 ease-linear"
              />
            </svg>
            <span data-testid="up-next-seconds" className="absolute inset-0 flex items-center justify-center text-sm font-black">
              {Math.max(left, 0)}
            </span>
          </span>
        ) : (
          <span className="w-10 h-10 shrink-0 rounded-full bg-white/10 flex items-center justify-center" aria-hidden="true">
            {next ? <Lock size={16} className="text-amber-300" /> : <CheckCircle2 size={18} className="text-emerald-400" />}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-white/60">
            {!next ? 'Course finished' : counting ? `Up next in ${Math.max(left, 0)}s` : 'Next lesson is locked'}
          </div>
          <div className="text-sm font-bold leading-snug line-clamp-2">
            {next ? title : 'You have reached the last lesson of this course.'}
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Close up next"
          className="group -mr-1 -mt-1 w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X size={15} className="transition-transform duration-300 group-hover:rotate-90" />
        </button>
      </div>
      <div className="mt-3 flex items-center gap-2">
        {counting && (
          <button
            type="button"
            onClick={onPlay}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl ${player.solid} text-white text-xs font-bold cursor-pointer`}
          >
            <Play size={12} className="fill-white" />
            <span>Play now</span>
          </button>
        )}
        {next && !counting && (
          <button
            type="button"
            onClick={onUnlock}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer"
          >
            <Lock size={12} />
            <span>Unlock</span>
          </button>
        )}
        <button
          type="button"
          onClick={onReplay}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
        >
          <RotateCcw size={12} />
          <span>Watch again</span>
        </button>
      </div>
    </div>
  );
}

// The topics above an entry, and the entry itself, opened in the tree
const openPath = (entry) =>
  entry ? Object.fromEntries([...entry.trail.map((step) => step.nodeId), entry.nodeId].map((id) => [id, true])) : {};

// One row of the topic hierarchy (the collapse method), with its subtopics underneath
function TopicNode({ node, depth, currentId, expanded, onToggle, onSelect, player, savedOf }) {
  const hasChildren = node.children?.length > 0;
  const isExpanded = Boolean(expanded[node.nodeId]);
  const isSelected = currentId === node.nodeId;
  const lesson = node.lesson;
  const finished = isFinished(node, savedOf);

  let rowStyle =
    'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-600 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 dark:border-slate-700/50 dark:text-slate-300';
  if (isSelected) {
    rowStyle = `bg-gradient-to-r ${player.active} text-white font-bold shadow-lg border-transparent ${
      finished ? 'ring-2 ring-emerald-400' : 'ring-1 ring-white/30'
    }`;
  } else if (finished) {
    // Finished: a green border, so done lessons stand out from the ones still to watch
    rowStyle =
      'bg-emerald-50/70 hover:bg-emerald-50 border-emerald-400 text-slate-700 shadow-xs dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 dark:border-emerald-600/70 dark:text-slate-200';
  } else if (depth === 0) {
    rowStyle =
      'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-900 shadow-sm dark:bg-slate-800/90 dark:hover:bg-slate-800 dark:border-slate-600/60 dark:text-white';
  } else if (depth === 1) {
    rowStyle =
      'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs dark:bg-slate-800/70 dark:hover:bg-slate-800 dark:border-slate-700/70 dark:text-slate-200';
  }

  return (
    <div className="flex flex-col select-none">
      <div
        data-testid="syllabus-node"
        data-playing={isSelected ? 'true' : undefined}
        data-finished={finished ? 'true' : undefined}
        onClick={() => onSelect(node)}
        className={`group flex items-center justify-between gap-2.5 py-2 px-3 rounded-xl border transition-all duration-150 ${
          lesson || hasChildren ? 'cursor-pointer' : 'cursor-default opacity-60'
        } ${rowStyle}`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {hasChildren ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onToggle(node.nodeId);
              }}
              aria-label={isExpanded ? `Collapse ${node.title}` : `Expand ${node.title}`}
              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-white/20 text-white hover:bg-white/30'
                  : 'bg-slate-200/70 text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:bg-slate-700/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700'
              }`}
            >
              <ChevronRight size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
            </button>
          ) : (
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'text-white' : 'text-slate-500'}`}>
              {lesson?.isLocked ? (
                <Lock size={11} />
              ) : (
                <Play size={11} className={isSelected ? 'fill-white text-white' : 'fill-slate-500 text-slate-500'} />
              )}
            </div>
          )}

          {finished && (
            <span
              data-testid="lesson-finished"
              title="Finished"
              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
                isSelected ? 'bg-white text-emerald-600' : 'bg-emerald-500 text-white'
              }`}
            >
              <Check size={12} strokeWidth={3} aria-label="Finished" />
            </span>
          )}

          {node.code && (
            <span
              className={`font-mono text-xs px-2 py-0.5 rounded-md border shrink-0 tracking-tight ${
                isSelected ? 'bg-white/20 text-white border-white/30 font-black' : `${player.soft} font-bold`
              }`}
            >
              {node.code}
            </span>
          )}

          <span
            className={`text-xs sm:text-[13px] leading-snug break-words ${
              isSelected
                ? 'text-white font-black'
                : depth === 0
                  ? 'text-slate-900 dark:text-white font-bold'
                  : 'text-slate-700 dark:text-slate-200 font-medium group-hover:text-slate-900 dark:group-hover:text-white'
            }`}
          >
            {node.title}
          </span>
        </div>

        <div className="shrink-0 flex items-center gap-1.5 ml-2">
          {isSelected ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-extrabold text-white tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              PLAYING
            </span>
          ) : hasChildren ? (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-slate-100 text-slate-500 group-hover:text-slate-700 dark:bg-slate-700/40 dark:text-slate-400 dark:group-hover:text-slate-300">
              {node.children.length} {node.children.length === 1 ? 'part' : 'parts'}
            </span>
          ) : lesson?.isLocked ? (
            <Lock size={12} className="text-amber-600 dark:text-amber-400" />
          ) : !lesson ? (
            <span className="text-[10px] font-semibold text-slate-500">Soon</span>
          ) : (
            <WatchMark saved={savedOf?.(node)} />
          )}
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className={`relative ml-5 pl-4 border-l-2 ${player.line} space-y-1.5 my-1.5`}>
          {node.children.map((child) => (
            <div
              key={child.nodeId}
              className={`relative before:absolute before:-left-4 before:top-4 before:w-3.5 before:h-0.5 ${player.branch} before:rounded-full`}
            >
              <TopicNode
                node={child}
                depth={depth + 1}
                currentId={currentId}
                expanded={expanded}
                onToggle={onToggle}
                onSelect={onSelect}
                player={player}
                savedOf={savedOf}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Full-page lecture player: the lesson plays on the left, the topic hierarchy with its subtopics is on the right.
 * The hierarchy is the opened topic and its subtopics; a topic without subtopics shows the rest of its chapter.
 */
export default function CourseLecturePlayer({
  course,
  chapters,
  theme,
  startId,
  onClose,
  onLocked,
  onAsk,
  onJump,
  tracking = NO_TRACKING,
}) {
  const player = theme.player;

  const scope = useMemo(() => {
    const all = flattenChapters(chapters);
    const start = all.find((entry) => entry.nodeId === startId);
    if (!start) return null;

    const chapter = chapters.find((item) => item.chapterId === start.chapterId);
    const rootId = start.trail[0]?.nodeId || start.nodeId;
    const root = chapter.topics.find((topic) => topic.nodeId === rootId);
    const chapterLabel = `${chapter.number ? `${chapter.number}: ` : ''}${chapter.name}`;

    const nodes = root?.children?.length > 0 ? [root] : chapter.topics;
    return {
      chapterLabel,
      nodes,
      code: nodes.length === 1 ? root.code : chapter.number,
      title: nodes.length === 1 ? root.title : chapter.name,
      entries: flattenChapters([{ ...chapter, topics: nodes }]),
    };
  }, [chapters, startId]);

  const entries = useMemo(() => scope?.entries || [], [scope]);
  const playable = useMemo(() => entries.filter((entry) => entry.lesson && !entry.lesson.isLocked), [entries]);
  // Every lesson of the course in page order, for what comes after the last one shown here
  const courseOrder = useMemo(() => flattenChapters(chapters).filter((entry) => entry.lesson), [chapters]);
  const [endedId, setEndedId] = useState(null); // the lesson that just ended, while its Up next card shows
  const [replay, setReplay] = useState(0);
  const lessonCount = entries.filter((entry) => entry.lesson).length;

  const [currentId, setCurrentId] = useState(startId);
  const current = entries.find((entry) => entry.nodeId === currentId) || playable[0];
  const [expanded, setExpanded] = useState(() => {
    const opened = openPath(entries.find((entry) => entry.nodeId === startId));
    (scope?.nodes || []).forEach((node) => {
      if (scope.nodes.length === 1) {
        opened[node.nodeId] = true;
        (node.children || []).forEach((child) => {
          opened[child.nodeId] = true;
        });
      }
    });
    return opened;
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filter, setFilter] = useState('');

  const position = playable.findIndex((entry) => entry.nodeId === current?.nodeId);
  const filtered = filter.trim() ? entries.filter((entry) => matches(entry, filter.trim())) : [];

  // The page behind stays still, and Escape closes the player
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const workspaceRef = useRef(null);
  const listRef = useRef(null);

  // On phones the page is one column: bring the video back into view when a lesson is chosen
  useEffect(() => {
    if (!revealPlaying(listRef.current)) workspaceRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentId]);

  useEffect(() => {
    revealPlaying(listRef.current);
  }, [sidebarOpen]);

  const lessonKey = lessonKeyOf(current);
  const report = useLessonTracker({
    courseId: course._id,
    lessonKey,
    enabled: tracking.enabled && Boolean(current?.lesson) && !current?.lesson?.isLocked,
    onSaved: tracking.update,
  });
  const [resume, setResume] = useState({ id: null, at: 0 });
  if (current && resume.id !== current.nodeId) {
    setResume({ id: current.nodeId, at: tracking.enabled ? resumePoint(savedFor(tracking.progress.lessons, current)) : 0 });
  }
  const startAt = resume.id === current?.nodeId ? resume.at : 0;
  const savedOf = (node) => savedFor(tracking.progress.lessons, node);
  const finishedCount = playable.filter((entry) => savedOf(entry)?.completed).length;

  if (!current) return null;

  const toggle = (id) => setExpanded((previous) => ({ ...previous, [id]: !previous[id] }));

  const select = (node) => {
    if (!node) return;
    if (!node.lesson) {
      if (node.children?.length > 0) toggle(node.nodeId);
      return;
    }
    if (node.lesson.isLocked) {
      onLocked();
      return;
    }
    setCurrentId(node.nodeId);
    setExpanded((previous) => ({ ...previous, ...openPath(entries.find((entry) => entry.nodeId === node.nodeId)) }));
  };

  const expandAll = () => setExpanded(Object.fromEntries(entries.map((entry) => [entry.nodeId, true])));

  // After this lesson: the next one in the course, which may be locked, or none at the end
  const upNext = courseOrder[courseOrder.findIndex((entry) => entry.nodeId === current.nodeId) + 1] || null;
  const playNext = () => {
    setEndedId(null);
    if (!upNext || upNext.lesson.isLocked) return;
    if (entries.some((entry) => entry.nodeId === upNext.nodeId)) select(upNext);
    else onJump?.(upNext.nodeId);
  };
  const watchAgain = () => {
    setEndedId(null);
    setResume({ id: current.nodeId, at: 0 });
    setReplay((count) => count + 1);
  };

  const { lesson } = current;
  const crumbs = [...current.trail, { nodeId: current.nodeId, code: current.code, title: current.title }];

  return (
    <div
      role="dialog"
      aria-label={`${course.name} lecture player`}
      data-testid="lesson-player"
      className="fixed inset-0 z-[60] bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white flex flex-col overflow-hidden animate-fadeIn"
    >
      {/* Top classroom bar */}
      <div className="px-3 sm:px-6 py-3 bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition-colors cursor-pointer shrink-0"
            title="Return to syllabus"
          >
            <ChevronLeft size={16} />
            <span>Back<span className="hidden sm:inline"> to Syllabus</span></span>
          </button>

          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>

          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto scrollbar-none whitespace-nowrap min-w-0">
            <Compass size={13} className={`${player.text} shrink-0 mr-1`} />
            <span className="text-slate-500 dark:text-slate-400">{scope.chapterLabel}</span>
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1;
              return (
                <React.Fragment key={crumb.nodeId}>
                  <span className="text-slate-400 dark:text-slate-600">›</span>
                  <span
                    onClick={() => !isLast && select(entries.find((entry) => entry.nodeId === crumb.nodeId))}
                    className={
                      isLast
                        ? `font-black ${player.text}`
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer'
                    }
                  >
                    {crumb.code ? `${crumb.code}: ` : ''}
                    {crumb.title}
                  </span>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              sidebarOpen
                ? player.toggle
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200'
            }`}
            title={sidebarOpen ? 'Hide Syllabus Sidebar' : 'Show Syllabus Sidebar'}
          >
            <ListTree size={14} />
            <span className="hidden md:inline">{sidebarOpen ? 'Hide Syllabus' : 'Show Syllabus'}</span>
          </button>

          {lesson.url && (
            <a
              href={lesson.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">{lesson.youtubeId ? 'YouTube' : 'Open'}</span>
            </a>
          )}

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close lecture"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Workspace: one scrolling page on phones, side by side on large screens */}
      <div ref={workspaceRef} className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
        {/* Left side: video and lesson notes */}
        <div className="lg:flex-1 flex flex-col lg:overflow-y-auto bg-slate-50 dark:bg-black/40 shrink-0 lg:shrink">
          <div className="relative w-full aspect-video lg:max-h-[64vh] bg-black flex items-center justify-center shadow-2xl shrink-0">
            {lesson.youtubeId ? (
              <YouTubeLesson
                key={`${current.nodeId}:${replay}`}
                youtubeId={lesson.youtubeId}
                title={current.title}
                startAt={startAt}
                report={report}
                onEnded={() => setEndedId(current.nodeId)}
              />
            ) : isVideoLesson(lesson) ? (
              <VideoLesson
                key={`${current.nodeId}:${replay}`}
                url={lesson.url}
                startAt={startAt}
                report={report}
                onEnded={() => setEndedId(current.nodeId)}
              />
            ) : lesson.url ? (
              <div className="text-center px-6">
                <Link2 size={30} className={`mx-auto mb-3 ${player.text}`} />
                <p className="text-sm text-slate-300 mb-4">This lesson opens as a link.</p>
                <a
                  href={lesson.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl ${player.solid} text-white text-sm font-bold`}
                >
                  <ExternalLink size={15} />
                  <span>Open Lesson</span>
                </a>
              </div>
            ) : (
              <div className="text-slate-400 text-sm">Video media unavailable</div>
            )}
            {endedId === current.nodeId && (
              <UpNextCard
                key={endedId}
                next={upNext}
                player={player}
                onPlay={playNext}
                onReplay={watchAgain}
                onUnlock={() => {
                  setEndedId(null);
                  onLocked();
                }}
                onDismiss={() => setEndedId(null)}
              />
            )}
          </div>

          <div className="p-5 sm:p-8 space-y-5 max-w-5xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {current.code && (
                    <span className={`px-3 py-1 rounded-lg ${player.solid} text-white font-mono text-xs font-black shadow-sm`}>
                      Lesson {current.code}
                    </span>
                  )}
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{current.chapterName}</span>
                  {savedOf(current)?.completed && (
                    <span
                      data-testid="lesson-done"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60 text-[11px] font-semibold"
                    >
                      <CheckCircle2 size={11} />
                      <span>Finished</span>
                    </span>
                  )}
                  {startAt > 0 && (
                    <span
                      data-testid="lesson-resumed"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60 text-[11px] font-semibold"
                    >
                      <RotateCcw size={11} />
                      <span>Resumed at {formatClock(startAt)}</span>
                    </span>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">{current.title}</h1>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => select(playable[position - 1])}
                  disabled={position <= 0}
                  className="px-3.5 py-2 rounded-xl bg-slate-200/70 hover:bg-slate-300/70 disabled:opacity-30 disabled:hover:bg-slate-200/70 text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:disabled:hover:bg-slate-800 dark:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ChevronLeft size={16} /> Prev Lesson
                </button>
                <button
                  onClick={() => select(playable[position + 1])}
                  disabled={position < 0 || position >= playable.length - 1}
                  className="px-3.5 py-2 rounded-xl bg-slate-200/70 hover:bg-slate-300/70 disabled:opacity-30 disabled:hover:bg-slate-200/70 text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:disabled:hover:bg-slate-800 dark:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  Next Lesson <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {(current.description || current.keywords?.length > 0) && (
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900/90 dark:border-slate-800/80 shadow-md">
                <div className={`flex items-center gap-2 ${player.text} font-extrabold text-xs uppercase tracking-wider mb-2`}>
                  <Sparkles size={14} className="text-amber-500 dark:text-amber-400" />
                  <span>Lecture Notes & Key Concepts</span>
                </div>
                {current.description && (
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">{current.description}</p>
                )}
                {current.keywords?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2">
                    {current.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 dark:bg-slate-800/90 dark:border-slate-700 dark:text-slate-200 font-medium text-xs"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="p-5 rounded-2xl bg-gradient-to-r from-white via-white to-slate-100 border border-slate-200 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-0.5">
                  Have doubts in "{current.code ? `${current.code}: ` : ''}{current.title}"?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Connect with our {course.name} faculty for step-by-step clarification.</p>
              </div>
              <button
                onClick={() => onAsk(current)}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl ${player.solid} hover:brightness-110 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 shadow-lg`}
              >
                <span>Ask Doubt in this Topic</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Right side: topic hierarchy with collapsible subtopics */}
        {sidebarOpen && (
          <aside
            aria-label="Topic hierarchy"
            className="w-full lg:w-[420px] xl:w-[460px] bg-white dark:bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 flex flex-col shrink-0 lg:overflow-hidden shadow-2xl"
          >
            <div className="p-4 bg-white/95 border-b border-slate-200 dark:bg-slate-900/95 dark:border-slate-800 space-y-3 shrink-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${player.dot} animate-pulse`}></span>
                  <span className={`text-[11px] font-mono font-extrabold uppercase tracking-wider ${player.text}`}>
                    Topic Hierarchy
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {tracking.enabled && finishedCount > 0 && (
                    <span
                      data-testid="hierarchy-finished"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700/70 dark:bg-emerald-950/40 dark:text-emerald-300 font-mono text-xs font-bold"
                    >
                      <Check size={11} strokeWidth={3} />
                      {finishedCount} of {playable.length} finished
                    </span>
                  )}
                  <span className={`px-2.5 py-0.5 rounded-full ${player.soft} font-mono text-xs font-bold border shrink-0`}>
                    {lessonCount} {lessonCount === 1 ? 'Lesson' : 'Lessons'}
                    {lessonCount > playable.length ? ` · ${lessonCount - playable.length} locked` : ''}
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-start gap-2">
                  {scope.code && <span className={`${player.text} font-mono shrink-0`}>{scope.code}:</span>}
                  <span>{scope.title}</span>
                </h2>

                <div className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 dark:bg-slate-800/80 dark:border-slate-700/60 dark:text-slate-300">
                  <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-emerald-600 dark:text-emerald-400 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Playing:
                  </span>
                  {current.code && <span className={`font-mono font-bold ${player.text} shrink-0`}>{current.code}</span>}
                  <span className="truncate font-medium text-slate-900 dark:text-white">{current.title}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setExpanded({})}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-white text-[11px] font-bold transition-all cursor-pointer border border-slate-200 dark:border-slate-700/60"
                    title="Collapse all subtopics"
                  >
                    − Collapse All
                  </button>
                  <button
                    onClick={expandAll}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-white text-[11px] font-bold transition-all cursor-pointer border border-slate-200 dark:border-slate-700/60"
                    title="Expand all subtopics"
                  >
                    + Expand All
                  </button>
                </div>

                <div className="relative flex-1 max-w-[190px]">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
                  <input
                    type="text"
                    aria-label="Search subtopics"
                    placeholder="Search subtopic..."
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                    className={`w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-50 text-slate-900 border-slate-200 dark:bg-slate-800/90 dark:text-white dark:border-slate-700/70 text-xs border focus:outline-none focus:ring-1 ${player.ring} placeholder:text-slate-500`}
                  />
                  {filter && (
                    <button
                      onClick={() => setFilter('')}
                      aria-label="Clear subtopic search"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div ref={listRef} className="lg:flex-1 lg:overflow-y-auto p-3 space-y-1.5">
              {filter.trim() ? (
                filtered.length === 0 ? (
                  <p className="text-center text-xs text-slate-500 py-6">No subtopic matches "{filter}"</p>
                ) : (
                  filtered.map((entry) => (
                    <div key={entry.nodeId}>
                      <TopicNode
                        node={{ ...entry, children: [] }}
                        depth={0}
                        currentId={current.nodeId}
                        expanded={expanded}
                        onToggle={toggle}
                        onSelect={select}
                        player={player}
                        savedOf={savedOf}
                      />
                      {entry.trail.length > 0 && (
                        <div className="flex items-center gap-1 mt-1 ml-2 text-[10px] text-slate-500 truncate">
                          <Tag size={10} className="shrink-0" />
                          <span className="truncate">{entry.trail.map((step) => step.title).join(' / ')}</span>
                        </div>
                      )}
                    </div>
                  ))
                )
              ) : (
                scope.nodes.map((node) => (
                  <TopicNode
                    key={node.nodeId}
                    node={node}
                    depth={0}
                    currentId={current.nodeId}
                    expanded={expanded}
                    onToggle={toggle}
                    onSelect={select}
                    player={player}
                    savedOf={savedOf}
                  />
                ))
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
