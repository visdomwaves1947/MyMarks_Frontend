// Helpers for building roadmaps on the admin Roadmaps page. A roadmap is days of video parts: each
// part is a stretch of a lesson from the syllabus (never the whole video) with its summary.
// The server checks the same limits.
import { flattenChapters, isVideoLesson } from '../../course/curriculumTree';
import { PART_MAX_SECONDS, countPlan, daysLabel, isFinishedPart, isPart, partOf } from '../../course/roadmapPlan';
import { mediaOfVideo } from '../../../utils/youtubeLink';
import { formatClock } from '../../../utils/watchTime';

export const MAX_DAYS = 120;
export const MAX_PARTS = 30;
const MAX_POINTS = 8;

// Ready-made lengths on the Add a roadmap row; any other number is typed in
export const QUICK_DAYS = [1, 2, 10, 30, 60];

// Why a number of days cannot be used for a new or changed roadmap, or '' when it can
export const dayCountProblem = (count, takenCounts, subject) => {
  if (!Number.isInteger(count) || count < 1 || count > MAX_DAYS) return `Enter a number of days from 1 to ${MAX_DAYS}.`;
  if (takenCounts.has(count)) {
    return `${subject} already has a roadmap of ${daysLabel(count).toLowerCase()}. Each roadmap needs its own number of days.`;
  }
  return '';
};

const hasTime = (value) => value !== null && value !== undefined && value !== '' && Number.isFinite(Number(value));

/**
 * What is wrong with a part's times, or '' when they are fine or not set yet.
 * [duration] is the whole video's length when known: a part may not be the whole video.
 */
export const partTimeProblem = (start, end, duration = 0) => {
  if (!hasTime(start) && !hasTime(end)) return '';
  if (!hasTime(start) || !hasTime(end)) return 'Set both the start and the end.';
  const from = Number(start);
  const to = Number(end);
  if (from < 0 || to < 0) return 'Times cannot be below 0:00.';
  if (to <= from) return `The end (${formatClock(to)}) must come after the start (${formatClock(from)}).`;
  if (to - from > PART_MAX_SECONDS) return `A part is at most ${PART_MAX_SECONDS / 60} minutes. Choose a shorter stretch.`;
  if (duration > 0 && to > duration + 1) return `The video is only ${formatClock(duration)} long.`;
  if (duration > 0 && from <= 1 && to >= duration - 1) return 'This is the whole video. Roadmaps hold parts only: choose a shorter stretch.';
  return '';
};

/**
 * What stops each roadmap from saving, as a list of messages per roadmap. Parts that only lack their
 * times or summary do not stop it: they are saved as unfinished, and students do not see them yet.
 */
export const roadmapProblems = (items, lessons = null) => {
  const dayCounts = items.map((item) => item.days.length);

  return items.map((item) => {
    const problems = [];
    const count = item.days.length;
    if (!item.title?.trim()) problems.push('Add a title.');
    if (dayCounts.filter((other) => other === count).length > 1) {
      problems.push(`Another roadmap also has ${daysLabel(count).toLowerCase()}. Each roadmap needs its own number of days.`);
    }

    item.days.forEach((day, dayIndex) => {
      const steps = day.steps || [];
      if (steps.length > MAX_PARTS) problems.push(`Day ${dayIndex + 1} has more than ${MAX_PARTS} parts.`);
      steps.forEach((step, stepIndex) => {
        const part = partOf(step);
        const name = `Day ${dayIndex + 1}, "${step.title || part?.text || `part ${stepIndex + 1}`}"`;
        // Older steps (a whole lesson or a link) can stay until removed; new ones are parts only
        if (!part || (step.resources || []).some((resource) => !isPart(resource))) return;
        if (lessons && lessons.size > 0 && !lessons.has(part.nodeId)) problems.push(`${name}: its lesson is no longer in the course.`);
        const timeProblem = partTimeProblem(part.start, part.end);
        if (timeProblem) problems.push(`${name}: ${timeProblem}`);
        if ((part.points || []).filter((point) => String(point).trim()).length > MAX_POINTS) {
          problems.push(`${name} has more than ${MAX_POINTS} key points.`);
        }
      });
    });
    return problems;
  });
};

// Steps from before parts: a whole lesson or a link. They still show to students until removed.
export const olderSteps = (item) =>
  item.days.reduce((sum, day) => sum + (day.steps || []).filter((step) => !partOf(step) || (step.resources || []).some((resource) => !isPart(resource))).length, 0);

// Parts saved without their times or summary yet, which students do not see
export const unfinishedParts = (item) =>
  item.days.reduce((sum, day) => sum + (day.steps || []).filter((step) => partOf(step) && !isFinishedPart(partOf(step))).length, 0);

export const blankDay = () => ({ title: '', desc: '', steps: [] });

export const copyOfDay = (day) => JSON.parse(JSON.stringify(day));

export const newRoadmap = (dayCount, subject) => ({
  key: '',
  level: '',
  expectedScore: '',
  title: `${daysLabel(dayCount)} ${subject} Plan`,
  desc: '',
  duration: dayCount,
  stats: { modules: 0, tests: 0, notes: 0, videos: 0 },
  days: Array.from({ length: dayCount }, blankDay),
});

// The numbers on the roadmap card follow its plan
export const withStats = (item) => ({ ...item, stats: countPlan(item) });

// A roadmap with no plan yet still gets its days, so they are ready to fill in
export const editable = ({ isShown, roadmaps }) => ({
  isShown,
  heading: roadmaps.heading,
  subheading: roadmaps.subheading,
  items: roadmaps.items.map((item) => ({
    ...item,
    days: item.days.length > 0 ? item.days : Array.from({ length: Math.min(item.duration || 1, MAX_DAYS) }, blankDay),
  })),
});

/**
 * Every lesson video of the course by its syllabus node: what the picker lists and a part plays.
 * Only topics and subtopics with a video of their own can be a part.
 */
export const lessonIndex = (chapters) => {
  const index = new Map();
  flattenChapters(chapters).forEach((topic) => {
    if (!topic.lesson || !isVideoLesson(topic.lesson)) return;
    const media = mediaOfVideo(topic.lesson);
    if (!media) return;
    index.set(topic.nodeId, {
      nodeId: topic.nodeId,
      code: topic.code || '',
      title: topic.title,
      label: `${topic.code ? `${topic.code} ` : ''}${topic.title}`.trim(),
      chapterNumber: topic.chapterNumber ?? '',
      chapterName: topic.chapterName || '',
      trail: topic.trail || [],
      lesson: topic.lesson,
      media,
    });
  });
  return index;
};

// A new part for a picked lesson: its times and summary are filled in after
export const partStep = (lesson) => ({
  time: '',
  title: lesson.label,
  desc: '',
  resources: [{ kind: 'part', text: lesson.label, nodeId: lesson.nodeId, url: '', start: null, end: null, summary: '', points: [] }],
});

// Times to a tenth of a second, as the server keeps them
const tenths = (seconds) => Math.round(Number(seconds) * 10) / 10;

// Names one part of a lesson: its stretch, or the lesson alone while the part has no times yet
export const partKey = (nodeId, start = null, end = null) =>
  start === null || start === undefined || start === '' ? String(nodeId) : `${nodeId}@${tenths(start)}-${tenths(end)}`;

const addTo = (map, key, value) => key && map.set(key, [...(map.get(key) || []), value]);

const mediaKey = (media) => (media?.kind === 'youtube' ? `yt:${media.youtubeId}` : media?.url ? `url:${media.url}` : '');

// One video, whichever syllabus nodes use it
export const lessonVideoKey = (lesson) => mediaKey(lesson?.media);

/**
 * The summaries of each lesson video, by its syllabus node. A summary is a highlight: a short part of
 * the video already cut, with its summary and key points (made in Highlights). It becomes a ready part.
 * Several nodes can share one video (a chapter's one-shot video, say), so each summary is listed once:
 * under the node linked to its video record, else the node of the same title, else the first node in
 * the syllabus that plays that video.
 */
export const summariesByLesson = (clips = [], lessons = new Map()) => {
  const byRecord = new Map();
  const byMedia = new Map();
  lessons.forEach((lesson, nodeId) => {
    if (lesson.lesson?.videoId) addTo(byRecord, String(lesson.lesson.videoId), nodeId);
    addTo(byMedia, lessonVideoKey(lesson), nodeId);
  });
  const titleOf = (text) => String(text || '').trim().toLowerCase();

  const index = new Map();
  clips.forEach((clip) => {
    if (!(Number(clip.end) > Number(clip.start))) return;
    const candidates = byRecord.get(String(clip.videoId || '')) || byMedia.get(mediaKey(clip.media)) || [];
    if (candidates.length === 0) return;
    const nodeId = candidates.find((id) => clip.lessonTitle && titleOf(lessons.get(id)?.title) === titleOf(clip.lessonTitle)) || candidates[0];
    const list = index.get(nodeId) || [];
    const key = partKey(nodeId, clip.start, clip.end);
    if (!list.some((other) => partKey(nodeId, other.start, other.end) === key)) index.set(nodeId, [...list, clip]);
  });
  index.forEach((list, nodeId) => index.set(nodeId, [...list].sort((a, b) => a.start - b.start || a.end - b.end)));
  return index;
};

// A ready part from a summary: only its stretch of the video plays, with its summary and key points
export const summaryStep = (lesson, clip) => ({
  time: '',
  title: clip.title || lesson.label,
  desc: '',
  resources: [
    {
      kind: 'part',
      text: lesson.label,
      nodeId: lesson.nodeId,
      url: '',
      start: tenths(clip.start),
      end: tenths(clip.end),
      summary: String(clip.summary || '').trim(),
      points: (clip.points || []).map((point) => String(point).trim()).filter(Boolean).slice(0, MAX_POINTS),
    },
  ],
});
