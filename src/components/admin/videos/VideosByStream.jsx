import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BookOpen, ChevronRight, Eye, FolderOpen, Layers, Pencil, Play, Plus, Search, Tag, Upload, Video, X } from 'lucide-react';
import { fetchAdminCourseLessonCounts, fetchAdminCoursePage, fetchAdminStreams } from '../../../services/courseApi';
import {
  LEVELS,
  LEVEL_LABEL,
  buildLessons,
  buildSyllabus,
  flattenLessons,
  lessonKey,
  lessonMatches,
  lessonVideoCount,
  nextChapterNumber,
  nextChildCode,
  pathStep,
  shownVideoIds,
  studioPreset,
  videoId,
  videosForCourse,
} from './videoGroups';

const OTHER = 'other-subjects';
const UNLINKED = 'not-linked';

const CARD =
  'text-left p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer';
const ICON_BUTTON =
  'w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 transition-colors cursor-pointer';
const TREE_BUTTON =
  'px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-white dark:border-slate-700/60 text-[11px] font-bold transition-all cursor-pointer border';

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;

const statusStyle = (status) =>
  status === 'draft'
    ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300'
    : status === 'archived'
      ? 'bg-slate-200 text-slate-700 dark:bg-slate-700/60 dark:text-slate-300'
      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300';

// The lecture player's topic hierarchy, in the admin's light or dark theme
const rowStyle = (depth) =>
  depth === 0
    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 shadow-sm dark:bg-slate-800/90 dark:hover:bg-slate-800 dark:border-slate-600/60'
    : depth === 1
      ? 'bg-white hover:bg-slate-50 border-slate-200 dark:bg-slate-800/70 dark:hover:bg-slate-800 dark:border-slate-700/70'
      : 'bg-white hover:bg-slate-50 border-slate-200/80 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 dark:border-slate-700/50';

// A small picture of the video; click it to watch
function Thumbnail({ video, context, dim = false }) {
  const thumb = context.thumbnailFor(video);
  return (
    <button
      type="button"
      onClick={() => context.onPreview(video)}
      aria-label={`Watch ${video.title}`}
      title="Watch"
      className="group/thumb relative w-16 aspect-video shrink-0 rounded-md overflow-hidden bg-slate-200 dark:bg-slate-950 cursor-pointer ring-1 ring-slate-200 dark:ring-slate-700"
    >
      {thumb ? (
        <img src={thumb} alt="" className={`w-full h-full object-cover ${dim ? 'opacity-70' : ''}`} loading="lazy" />
      ) : (
        <Video size={14} className="absolute inset-0 m-auto text-slate-400 dark:text-slate-500" />
      )}
      <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/thumb:bg-black/40 transition-colors">
        <Play size={12} className="text-white fill-white opacity-0 group-hover/thumb:opacity-100" />
      </span>
    </button>
  );
}

const titleOf = (node) => node.name || `Untitled ${LEVEL_LABEL[node.level].toLowerCase()}`;

function AddButton({ context, path, parent, level }) {
  const code = parent ? nextChildCode(parent) : String(nextChapterNumber(context.chapters));
  const preset = studioPreset({ subject: context.subject, year: context.year, path: [...path, { level, code, name: '' }], level });
  return (
    <button
      type="button"
      aria-label={`Add ${LEVEL_LABEL[level]}`}
      title={`Add a ${LEVEL_LABEL[level].toLowerCase()} ${code} here`}
      onClick={() => context.onAdd('upload', preset)}
      className="h-7 px-2 rounded-lg flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 dark:text-blue-300 dark:bg-blue-600/20 dark:hover:bg-blue-600/40 dark:border-blue-500/30 transition-colors cursor-pointer whitespace-nowrap"
    >
      <Plus size={12} />
      <span className="hidden md:inline">{LEVEL_LABEL[level]}</span>
    </button>
  );
}

const CHIP = 'hidden sm:inline px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wide';

// A YouTube link typed into the course syllabus is changed in the course editor, not the Lesson Studio
function VideoActions({ video, context }) {
  const inSyllabus = video.source === 'syllabus';
  return (
    <>
      {inSyllabus ? (
        <span className={`${CHIP} bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300`} title="A YouTube link typed into the course syllabus">
          In syllabus
        </span>
      ) : (
        <span className={`${CHIP} ${statusStyle(video.status)}`}>{video.status || 'published'}</span>
      )}
      <button type="button" onClick={() => context.onPreview(video)} aria-label={`Preview ${video.title}`} title="Preview" className={ICON_BUTTON}>
        <Eye size={14} />
      </button>
      {inSyllabus ? (
        <button
          type="button"
          onClick={() => context.onEditSyllabus(video.nodeId)}
          aria-label={`Edit ${video.title} in the course syllabus`}
          title="Edit in Courses & Streams"
          className={ICON_BUTTON}
        >
          <Pencil size={13} />
        </button>
      ) : video.source !== 'unknown' ? (
        <button type="button" onClick={() => context.onEdit(video)} aria-label={`Edit ${video.title}`} title="Edit" className={ICON_BUTTON}>
          <Pencil size={13} />
        </button>
      ) : null}
    </>
  );
}

// A video outside the tree: an older upload at the same number, or one the page lists under More Lessons
function VideoLine({ video, context, note, dim = false }) {
  return (
    <div
      data-testid="video-line"
      className="flex items-center gap-2.5 py-1.5 px-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-700/70 dark:bg-slate-900/60"
    >
      <Thumbnail video={video} context={context} dim={dim} />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">{video.title}</p>
        {note && <p className="text-[10px] text-slate-500">{note}</p>}
      </div>
      <VideoActions video={video} context={context} />
    </div>
  );
}

/**
 * One row of the lesson tree, with the lessons below it, like the lecture player's topic hierarchy
 */
function LessonRow({ node, path, depth, context, flat = false }) {
  const here = [...path, pathStep(node)];
  const key = lessonKey(context.group, here);
  const childLevel = LEVELS[LEVELS.indexOf(node.level) + 1];
  const [video, ...older] = node.videos;
  const canOpen = !flat && (node.children.length > 0 || older.length > 0);
  const isOpen = canOpen && !context.collapsed.has(key);
  const title = titleOf(node);

  return (
    <div className="flex flex-col">
      <div
        data-testid="lesson-node"
        className={`group flex items-center justify-between gap-2 py-2 px-3 rounded-xl border transition-colors ${rowStyle(depth)}`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {canOpen ? (
            <button
              type="button"
              onClick={() => context.toggle(key)}
              aria-label={isOpen ? `Collapse ${title}` : `Expand ${title}`}
              aria-expanded={isOpen}
              className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 bg-slate-200/70 text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:bg-slate-700/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 cursor-pointer"
            >
              <ChevronRight size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
            </button>
          ) : (
            <span className="w-6 h-6 flex items-center justify-center shrink-0 text-slate-400 dark:text-slate-500">
              {video ? <Play size={11} className="fill-current" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />}
            </span>
          )}

          <span className="font-mono text-xs px-2 py-0.5 rounded-md border shrink-0 tracking-tight font-bold bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800/60">
            {node.level === 'chapter' ? `Ch ${node.code}` : node.code || '?'}
          </span>

          {video && <Thumbnail video={video} context={context} />}

          <span
            className={`text-xs sm:text-[13px] leading-snug break-words ${
              depth === 0 ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-700 dark:text-slate-200 font-medium'
            }`}
          >
            {title}
          </span>
        </div>

        <div className="shrink-0 flex items-center gap-1">
          {node.children.length > 0 && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-300">
              {plural(node.children.length, 'part')}
            </span>
          )}
          {video ? (
            <VideoActions video={video} context={context} />
          ) : (
            <span className="px-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400" title="Videos are saved below this lesson, not on it">
              No video
            </span>
          )}
          {childLevel && !context.noAdd && <AddButton context={context} path={here} parent={node} level={childLevel} />}
        </div>
      </div>

      {isOpen && (
        <div className="relative ml-5 pl-4 border-l-2 border-blue-200 dark:border-blue-500/25 space-y-1.5 my-1.5">
          {older.map((item) => (
            <VideoLine
              key={videoId(item)}
              video={item}
              context={context}
              note="Older upload at this number. The website plays the newest."
              dim
            />
          ))}
          {node.children.map((child, index) => (
            <div
              key={`${child.nodeId || child.code}-${index}`}
              className="relative before:absolute before:-left-4 before:top-4 before:w-3.5 before:h-0.5 before:bg-blue-200 dark:before:bg-blue-500/25 before:rounded-full"
            >
              <LessonRow node={child} path={here} depth={depth + 1} context={context} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// The course page as students see it. Reloads when the admin's video list changes, so new uploads show.
function useCoursePage(slug, reloadWith) {
  const [state, setState] = useState({ slug: null, curriculum: null, error: '' });

  useEffect(() => {
    if (!slug) return undefined;
    let isCurrent = true;
    fetchAdminCoursePage(slug)
      .then((curriculum) => isCurrent && setState({ slug, curriculum, error: '' }))
      .catch((error) => isCurrent && setState({ slug, curriculum: null, error: error.message }));
    return () => {
      isCurrent = false;
    };
  }, [slug, reloadWith]);

  return state.slug === slug ? state : { slug, curriculum: null, error: '' };
}

const GROUP_HEADING = 'text-[11px] font-mono font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400';

function SubjectLessons({ course, videos, allVideos, actions }) {
  const page = useCoursePage(course.unlinked ? null : course.slug, allVideos);
  const videosById = useMemo(() => new Map(allVideos.map((video) => [videoId(video), video])), [allVideos]);
  const syllabus = useMemo(() => (page.curriculum ? buildSyllabus(page.curriculum, videosById) : null), [page.curriculum, videosById]);
  const isLoading = !course.unlinked && !page.curriculum && !page.error;

  // A course shows its page first; Lesson Studio videos the page leaves out (drafts, hidden) follow by year
  const groups = useMemo(() => {
    const byYear = (list, offPage) =>
      buildLessons(list).map(({ year, chapters, count }) => ({
        key: `${offPage ? 'off/' : ''}${year}`,
        title: offPage ? `Not on the course page · ${year}` : year,
        year,
        chapters,
        count,
        offPage,
      }));
    if (course.unlinked) return byYear(videos, false);
    if (!syllabus) return [];
    const shown = shownVideoIds(syllabus);
    return [
      { key: 'page', title: 'Course page', year: '', chapters: syllabus.chapters, isPage: true },
      ...byYear(videos.filter((video) => !shown.has(videoId(video))), true),
    ];
  }, [course.unlinked, videos, syllabus]);

  const entries = useMemo(() => flattenLessons(groups), [groups]);
  // Everything starts open, so the whole path of every lesson shows
  const [collapsed, setCollapsed] = useState(() => new Set());
  const [query, setQuery] = useState('');

  const toggle = (key) =>
    setCollapsed((previous) => {
      const next = new Set(previous);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  const collapseAll = () => setCollapsed(new Set(entries.map((entry) => entry.key)));
  const expandAll = () => setCollapsed(new Set());

  const moreLessons = syllabus?.moreLessons || [];
  const isEmpty = groups.every((group) => group.chapters.length === 0) && moreLessons.length === 0;
  const pageLessons = entries.filter((entry) => entry.group.isPage && entry.node.videos.length > 0).length + moreLessons.length;
  const lessonCount = course.unlinked ? entries.filter((entry) => entry.node.videos.length > 0).length : pageLessons;
  const found = query.trim() ? entries.filter((entry) => lessonMatches(entry.node, query)) : null;
  const subjectPreset = studioPreset({ subject: course.subject, path: [], level: 'chapter' });
  const editSyllabus = (nodeId) => actions.onEditSyllabus({ courseId: course.key, nodeId });

  const contextFor = (group) => ({
    ...actions,
    onEditSyllabus: editSyllabus,
    subject: course.subject,
    group: group.key,
    year: group.year,
    chapters: group.chapters,
    // Drafts are not on the page, so lessons are added from the page's own tree
    noAdd: group.offPage,
    collapsed,
    toggle,
  });

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">{course.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {course.unlinked
              ? `${plural(videos.length, 'video')} · no course page uses the subject "${course.subject}"`
              : `New videos are saved with the subject "${course.subject}" and placed by their chapter and topic numbers`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => actions.onAdd('upload', subjectPreset)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Upload size={14} />
            <span>Upload to {course.name}</span>
          </button>
          <button
            type="button"
            onClick={() => actions.onAdd('url', subjectPreset)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Video size={14} />
            <span>Add YouTube Video</span>
          </button>
        </div>
      </div>

      <section
        className="rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 overflow-hidden"
        aria-label="Topic hierarchy"
      >
        <div className="p-4 bg-slate-50 border-b border-slate-200 dark:bg-slate-900/95 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Topic Hierarchy
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800/60 font-mono text-xs font-bold">
              {plural(lessonCount, 'Lesson')}
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">{course.name}</h4>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={collapseAll} className={TREE_BUTTON}>
                − Collapse All
              </button>
              <button type="button" onClick={expandAll} className={TREE_BUTTON}>
                + Expand All
              </button>
            </div>
            <div className="relative flex-1 min-w-[160px] max-w-[260px]">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                aria-label="Search lessons"
                placeholder="Search subtopic..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-white text-slate-900 border-slate-200 placeholder:text-slate-400 dark:bg-slate-800/90 dark:text-white dark:border-slate-700/70 dark:placeholder:text-slate-500 text-xs border focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear lesson search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-3 space-y-5">
          {isLoading && <p className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">Loading the course page...</p>}
          {page.error && <p className="py-6 text-center text-xs text-rose-600 dark:text-rose-400">{page.error}</p>}

          {!isLoading && !page.error && isEmpty && (
            <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400 space-y-3">
              <p>No lessons for {course.name} yet. Upload a video, or type YouTube links into the course syllabus.</p>
              {!course.unlinked && (
                <button type="button" onClick={() => editSyllabus(null)} className={`${TREE_BUTTON} inline-flex items-center gap-1`}>
                  <Pencil size={12} />
                  <span>Edit Syllabus</span>
                </button>
              )}
            </div>
          )}

          {found &&
            (found.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-500">No lesson matches "{query}"</p>
            ) : (
              <div className="space-y-2">
                {found.map((entry) => (
                  <div key={entry.key}>
                    <LessonRow node={entry.node} path={entry.path} depth={0} context={contextFor(entry.group)} flat />
                    <div className="flex items-center gap-1 mt-1 ml-2 text-[10px] text-slate-500 truncate">
                      <Tag size={10} className="shrink-0" />
                      <span className="truncate">
                        {[entry.group.title, ...entry.path.map((step) => `${step.code} ${step.name}`.trim())].join(' / ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}

          {!found &&
            groups.map((group) => {
              if (group.isPage ? isEmpty : group.chapters.length === 0) return null;
              const context = contextFor(group);
              return (
                <div key={group.key} role="group" className="space-y-1.5" data-testid="lesson-group" aria-label={group.title}>
                  <div className="flex items-center justify-between gap-2 px-1 pb-1">
                    <span className={GROUP_HEADING}>
                      {group.title} · {group.isPage ? plural(pageLessons, 'lesson') : plural(group.count, 'video')}
                    </span>
                    {group.isPage ? (
                      <button
                        type="button"
                        onClick={() => editSyllabus(null)}
                        title="Add or change chapters and typed YouTube links in Courses & Streams"
                        className="h-7 px-2 rounded-lg flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 dark:text-blue-300 dark:bg-blue-600/20 dark:hover:bg-blue-600/40 dark:border-blue-500/30 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <Pencil size={11} />
                        <span>Edit Syllabus</span>
                      </button>
                    ) : (
                      !group.offPage && <AddButton context={context} path={[]} level="chapter" />
                    )}
                  </div>
                  {group.offPage && (
                    <p className="px-1 text-[10px] text-slate-500 dark:text-slate-400">
                      Drafts and hidden videos. Publish one and it takes its place on the course page.
                    </p>
                  )}
                  {group.chapters.map((chapter, index) => (
                    <div key={`${chapter.nodeId || chapter.code}-${index}`} data-testid="stream-chapter" data-videos={lessonVideoCount(chapter)}>
                      <LessonRow node={chapter} path={[]} depth={0} context={context} />
                    </div>
                  ))}
                  {group.isPage && moreLessons.length > 0 && (
                    <div className="pt-2 space-y-1.5" data-testid="more-lessons">
                      <span className={`block px-1 ${GROUP_HEADING}`}>More Lessons · {plural(moreLessons.length, 'video')}</span>
                      <p className="px-1 text-[10px] text-slate-500 dark:text-slate-400">
                        Listed after the chapters, because their chapter is not in the syllabus. Edit one to give it a chapter that is.
                      </p>
                      {moreLessons.map((video) => (
                        <VideoLine key={videoId(video)} video={video} context={context} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
}

/**
 * Videos in folders: streams, then their subjects, then each subject's chapters and lessons
 */
export default function VideosByStream({ videos, allVideos, courses, thumbnailFor, onPreview, onEdit, onAdd, onEditSyllabus }) {
  const [streams, setStreams] = useState([]);
  const [lessonCounts, setLessonCounts] = useState(null);
  const [streamKey, setStreamKey] = useState(null);
  const [subjectKey, setSubjectKey] = useState(null);

  useEffect(() => {
    fetchAdminStreams()
      .then((list) => setStreams(list.filter((stream) => stream.status !== 'hidden')))
      .catch(() => setStreams([]));
  }, []);

  // Counted again whenever the video list reloads, so a new upload shows in the numbers
  useEffect(() => {
    fetchAdminCourseLessonCounts()
      .then((counts) => setLessonCounts(new Map(counts.map((count) => [count.course, count]))))
      .catch(() => setLessonCounts(new Map()));
  }, [allVideos]);

  const subjects = useMemo(() => {
    const active = courses.filter((course) => course.status !== 'archived');
    const list = active.map((course) => ({
      key: String(course._id),
      slug: course.slug,
      name: course.name,
      subject: course.subject,
      status: course.status,
      streamSlugs: (course.streams || []).map((stream) => stream.slug),
      videos: videosForCourse(videos, course),
    }));

    // Videos whose subject has no course still need a home
    const known = new Set(list.flatMap((subject) => subject.videos.map(videoId)));
    const loose = new Map();
    videos
      .filter((video) => !known.has(videoId(video)))
      .forEach((video) => {
        const name = (video.subject || 'General').trim();
        const key = `subject:${name.toLowerCase()}`;
        if (!loose.has(key)) loose.set(key, { key, name, subject: name, streamSlugs: [], unlinked: true, videos: [] });
        loose.get(key).videos.push(video);
      });

    return [...list, ...loose.values()];
  }, [courses, videos]);

  // A course counts every lesson its page shows, typed syllabus links included
  const lessonsOf = useCallback(
    (subject) => (subject.unlinked ? subject.videos.length : lessonCounts?.get(subject.key)?.lessons),
    [lessonCounts]
  );

  const folders = useMemo(() => {
    const inStream = (slug) => subjects.filter((subject) => subject.streamSlugs.includes(slug));
    const list = streams.map((stream) => ({
      key: stream.slug,
      title: stream.code,
      subtitle: stream.shortName || stream.name,
      subjects: inStream(stream.slug),
    }));
    const other = subjects.filter((subject) => !subject.unlinked && subject.streamSlugs.length === 0);
    if (other.length) list.push({ key: OTHER, title: 'Other Subjects', subtitle: 'Courses not in a stream', subjects: other });
    const unlinked = subjects.filter((subject) => subject.unlinked);
    if (unlinked.length) list.push({ key: UNLINKED, title: 'Not in a Course', subtitle: 'Subjects with no course page', subjects: unlinked });
    return list.map((folder) => ({
      ...folder,
      lessonCount: folder.subjects.reduce((sum, subject) => sum + (lessonsOf(subject) ?? 0), 0),
    }));
  }, [streams, subjects, lessonsOf]);

  const folder = folders.find((item) => item.key === streamKey);
  const subject = folder?.subjects.find((item) => item.key === subjectKey);
  const actions = { thumbnailFor, onPreview, onEdit, onAdd, onEditSyllabus };
  const isCounting = !lessonCounts;

  const crumb = 'text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-bold';

  return (
    <section className="space-y-4" aria-label="Videos by stream">
      <nav aria-label="Video folders" className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
        <FolderOpen size={14} className="text-blue-600 dark:text-blue-400" />
        {folder ? (
          <button type="button" className={crumb} onClick={() => { setStreamKey(null); setSubjectKey(null); }}>
            All Streams
          </button>
        ) : (
          <span className="text-slate-900 dark:text-white font-bold">All Streams</span>
        )}
        {folder && <ChevronRight size={13} />}
        {folder &&
          (subject ? (
            <button type="button" className={crumb} onClick={() => setSubjectKey(null)}>
              {folder.title}
            </button>
          ) : (
            <span className="text-slate-900 dark:text-white font-bold">{folder.title}</span>
          ))}
        {subject && <ChevronRight size={13} />}
        {subject && <span className="text-slate-900 dark:text-white font-bold">{subject.name}</span>}
      </nav>

      {!folder && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {folders.map((item) => (
            <button key={item.key} type="button" className={CARD} onClick={() => setStreamKey(item.key)} data-testid="stream-folder">
              <span className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Layers size={20} />
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-black text-slate-900 dark:text-white">{item.title}</span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 truncate">{item.subtitle}</span>
                </span>
              </span>
              <span className="block mt-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
                {plural(item.subjects.length, 'subject')} · {isCounting ? 'counting lessons...' : plural(item.lessonCount, 'lesson')}
              </span>
            </button>
          ))}
        </div>
      )}

      {folder && !subject && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {folder.subjects.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400">No courses in {folder.title} yet. Add them in Courses &amp; Streams.</p>
          )}
          {folder.subjects.map((item) => {
            const count = lessonCounts?.get(item.key);
            const summary = item.unlinked
              ? plural(item.videos.length, 'video')
              : count
                ? `${plural(count.lessons, 'lesson')} · ${plural(count.chapters, 'chapter')}`
                : 'counting lessons...';
            return (
              <button key={item.key} type="button" className={CARD} onClick={() => setSubjectKey(item.key)} data-testid="stream-subject">
                <span className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <BookOpen size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-black text-slate-900 dark:text-white truncate">{item.name}</span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400" data-testid="subject-summary">
                      {summary}
                    </span>
                    {count?.syllabusLinks > 0 && (
                      <span className="block text-[10px] text-sky-700 dark:text-sky-300">
                        {plural(count.syllabusLinks, 'YouTube link')} typed in the syllabus
                      </span>
                    )}
                  </span>
                </span>
                {item.status === 'draft' && (
                  <span className="inline-block mt-2 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                    Course not published
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {subject && <SubjectLessons key={subject.key} course={subject} videos={subject.videos} allVideos={allVideos} actions={actions} />}
    </section>
  );
}
