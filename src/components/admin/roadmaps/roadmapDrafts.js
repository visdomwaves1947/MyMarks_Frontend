// Helpers for editing roadmaps on the admin Roadmaps page. The server checks the same limits.
import { firstLessonIn, flattenChapters } from '../../course/curriculumTree';
import { daysLabel } from '../../course/roadmapPlan';
import { linkProblem } from '../../../utils/links';

export const MAX_DAYS = 120;
const MAX_STEPS = 30;
const MAX_RESOURCES = 12;

export { linkProblem };

// Why a number of days cannot be used for a new or changed roadmap, or '' when it can
export const dayCountProblem = (count, takenCounts, subject) => {
  if (!Number.isInteger(count) || count < 1 || count > MAX_DAYS) return `Enter a number of days from 1 to ${MAX_DAYS}.`;
  if (takenCounts.has(count)) {
    return `${subject} already has a roadmap of ${daysLabel(count).toLowerCase()}. Each roadmap needs its own number of days.`;
  }
  return '';
};

/**
 * What stops each roadmap from saving, as a list of messages per roadmap.
 * The server checks the title, the days and the links the same way.
 */
export const roadmapProblems = (items) => {
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
      if (steps.length > MAX_STEPS) problems.push(`Day ${dayIndex + 1} has more than ${MAX_STEPS} steps.`);
      steps.forEach((step, stepIndex) => {
        const where = `Day ${dayIndex + 1}, step ${stepIndex + 1}`;
        const resources = step.resources || [];
        if (!step.title?.trim()) problems.push(`${where} needs a title.`);
        if (resources.length > MAX_RESOURCES) problems.push(`${where} has more than ${MAX_RESOURCES} resources.`);
        if (resources.some((resource) => (resource.kind === 'notes' || resource.kind === 'quiz') && linkProblem(resource.url))) {
          problems.push(`${where} has a link that does not start with https:// or a page on this site.`);
        }
      });
    });
    return problems;
  });
};

export const blankDay = () => ({ title: '', desc: '', steps: [] });

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

// Every topic a student can open: one with its own lesson, or one with a lesson inside it
export const lessonOptions = (chapters) =>
  flattenChapters(chapters)
    .filter((topic) => topic.lesson || firstLessonIn(topic))
    .map((topic) => ({
      nodeId: topic.nodeId,
      label: `${topic.code ? `${topic.code} ` : ''}${topic.title}`.trim(),
      chapterName: [topic.chapterNumber, topic.chapterName].filter(Boolean).join('. '),
      depth: topic.trail.length,
      hasOwnLesson: Boolean(topic.lesson),
    }));

// The main topics, or every lesson when there are fewer main topics than days
const studyUnits = (options, dayCount) => {
  const mainTopics = options.filter((option) => option.depth === 0);
  return mainTopics.length >= dayCount ? mainTopics : options.filter((option) => option.hasOwnLesson);
};

/**
 * Spreads the course's lessons over the days in syllabus order, one step per
 * chapter in each day. Days with no lessons left keep what they had.
 */
export const spreadLessons = (options, days) => {
  const units = studyUnits(options, days.length);

  return days.map((day, index) => {
    const group = units.slice(
      Math.floor((index * units.length) / days.length),
      Math.floor(((index + 1) * units.length) / days.length)
    );
    if (group.length === 0) return day;

    const perStep = Math.min(MAX_RESOURCES, Math.max(4, Math.ceil(group.length / MAX_STEPS)));
    const chunks = [];
    group.forEach((unit) => {
      const last = chunks[chunks.length - 1];
      if (last && last.chapter === unit.chapterName && last.units.length < perStep) last.units.push(unit);
      else chunks.push({ chapter: unit.chapterName, units: [unit] });
    });

    const chapters = [...new Set(group.map((unit) => unit.chapterName))];
    return {
      ...day,
      title: day.title || chapters.join(' & ').slice(0, 120),
      steps: chunks.slice(0, MAX_STEPS).map((chunk) => ({
        time: '',
        title: chunk.chapter,
        desc:
          chunk.units.length === 1
            ? 'Watch this lesson, then write down the key points in your own words.'
            : `Watch these ${chunk.units.length} lessons in order, then write down the key points in your own words.`,
        resources: chunk.units.map((unit) => ({ kind: 'video', text: unit.label, nodeId: unit.nodeId, url: '' })),
      })),
    };
  });
};
