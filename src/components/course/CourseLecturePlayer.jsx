import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Compass,
  ExternalLink,
  Link2,
  ListTree,
  Lock,
  Play,
  Search,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';
import { flattenChapters, isVideoLesson } from './curriculumTree';

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

// The topics above an entry, and the entry itself, opened in the tree
const openPath = (entry) =>
  entry ? Object.fromEntries([...entry.trail.map((step) => step.nodeId), entry.nodeId].map((id) => [id, true])) : {};

// One row of the topic hierarchy (the collapse method), with its subtopics underneath
function TopicNode({ node, depth, currentId, expanded, onToggle, onSelect, player }) {
  const hasChildren = node.children?.length > 0;
  const isExpanded = Boolean(expanded[node.nodeId]);
  const isSelected = currentId === node.nodeId;
  const lesson = node.lesson;

  let rowStyle =
    'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-600 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 dark:border-slate-700/50 dark:text-slate-300';
  if (isSelected) {
    rowStyle = `bg-gradient-to-r ${player.active} text-white font-bold shadow-lg ring-1 ring-white/30 border-transparent`;
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
          ) : null}
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
export default function CourseLecturePlayer({ course, chapters, theme, startId, onClose, onLocked, onAsk }) {
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
              <iframe
                key={current.nodeId}
                src={`https://www.youtube-nocookie.com/embed/${lesson.youtubeId}?autoplay=1&rel=0`}
                title={current.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            ) : isVideoLesson(lesson) ? (
              <video key={current.nodeId} src={lesson.url} controls autoPlay className="absolute inset-0 w-full h-full object-contain bg-black" />
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
                <span className={`px-2.5 py-0.5 rounded-full ${player.soft} font-mono text-xs font-bold border shrink-0`}>
                  {playable.length} {playable.length === 1 ? 'Lesson' : 'Lessons'}
                </span>
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
