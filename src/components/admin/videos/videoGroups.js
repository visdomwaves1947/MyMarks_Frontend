// Groups the admin's videos by stream, subject, year and lesson, the way the Lesson Studio saves them

export const LEVELS = ['chapter', 'topic', 'subTopic', 'subSubTopic'];

export const LEVEL_LABEL = {
  chapter: 'Chapter',
  topic: 'Topic',
  subTopic: 'Subtopic',
  subSubTopic: 'Sub-subtopic',
};

const YEAR_ORDER = ['1st Year', '2nd Year'];

const sameText = (a, b) => (a || '').trim().toLowerCase() === (b || '').trim().toLowerCase();

const idOf = (value) => String(value?._id || value?.id || value || '');

export const videoId = (video) => idOf(video);

/**
 * The videos a course page shows: linked to the course, or saved with its subject
 */
export const videosForCourse = (videos, course) =>
  videos.filter((video) => (video.course && idOf(video.course) === idOf(course)) || sameText(video.subject, course.subject));

// Lesson Studio videos say their level; older ones are worked out from the names filled in
export const levelOf = (video) => {
  if (LEVELS.includes(video.uploadLevel)) return video.uploadLevel;
  if (video.subSubTopicName) return 'subSubTopic';
  if (video.subTopicName || video.lessonName) return 'subTopic';
  if (video.topicName || video.topic) return 'topic';
  return 'chapter';
};

// "2.10" sorts after "2.9"
export const compareCodes = (a, b) => {
  const left = String(a).split('.').map(Number);
  const right = String(b).split('.').map(Number);
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    const difference = (left[index] || 0) - (right[index] || 0);
    if (difference) return difference;
  }
  return 0;
};

const stepOf = (video, level) => {
  if (level === 'chapter') {
    const number = Number(video.chapterNumber) || Number(String(video.chapter || '').match(/\d+/)?.[0]) || 1;
    return { code: String(number), name: video.chapterName || '' };
  }
  if (level === 'topic') return { code: video.topicNumber || '', name: video.topicName || video.topic || '' };
  if (level === 'subTopic') return { code: video.subTopicNumber || '', name: video.subTopicName || video.lessonName || '' };
  return { code: video.subSubTopicNumber || '', name: video.subSubTopicName || '' };
};

const newNode = (level, code) => ({ level, code, name: '', videos: [], children: new Map() });

const finish = (node) => ({
  ...node,
  children: [...node.children.values()].sort((a, b) => compareCodes(a.code, b.code)).map(finish),
});

const countVideos = (node) => node.videos.length + node.children.reduce((sum, child) => sum + countVideos(child), 0);

/**
 * Years, each with its chapters, topics and subtopics. Newest names win.
 */
export const buildLessons = (videos) => {
  const newestFirst = [...videos].sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
  const years = new Map();

  newestFirst.forEach((video) => {
    const year = video.year || 'Both Years';
    if (!years.has(year)) years.set(year, newNode('year', year));
    let node = years.get(year);

    const level = levelOf(video);
    LEVELS.slice(0, LEVELS.indexOf(level) + 1).forEach((step) => {
      const { code, name } = stepOf(video, step);
      const key = code || 'none';
      if (!node.children.has(key)) node.children.set(key, newNode(step, code));
      node = node.children.get(key);
      if (!node.name && name) node.name = name;
    });
    node.videos.push(video);
  });

  return [...years.values()]
    .map((year) => {
      const done = finish(year);
      return { year: done.code, chapters: done.children, count: countVideos(done) };
    })
    .sort((a, b) => {
      const left = YEAR_ORDER.indexOf(a.year);
      const right = YEAR_ORDER.indexOf(b.year);
      return (left < 0 ? 99 : left) - (right < 0 ? 99 : right) || a.year.localeCompare(b.year);
    });
};

export const lessonVideoCount = countVideos;

// A lesson's place in the tree: its group, then the lessons from its chapter down.
// Syllabus topics can share a code by mistake, so their own id is used when they have one.
export const lessonKey = (group, path) => [group, ...path.map((step) => step.key || 'none')].join('/');

export const pathStep = (node) => ({ level: node.level, code: node.code, name: node.name, key: node.nodeId || node.code });

/**
 * Every lesson with the lessons above it, for search and for opening or closing them all
 */
export const flattenLessons = (groups) => {
  const entries = [];
  const walk = (node, group, path) => {
    const here = [...path, pathStep(node)];
    entries.push({ node, group, path, key: lessonKey(group.key, here) });
    node.children.forEach((child) => walk(child, group, here));
  };
  groups.forEach((group) => group.chapters.forEach((chapter) => walk(chapter, group, [])));
  return entries;
};

// ── The course page as students see it ──────────────────────────────

const levelAt = (depth) => LEVELS[Math.min(depth, LEVELS.length - 1)];

/**
 * The video behind a lesson. A Lesson Studio video comes back whole, so it can be edited there.
 * A YouTube link typed into the course syllabus is edited in the course instead.
 */
const lessonVideo = (node, lesson, videosById) => {
  if (!lesson) return null;
  const shown = {
    title: lesson.title,
    url: lesson.url,
    youtubeId: lesson.youtubeId,
    thumbnailUrl: lesson.thumbnailUrl,
    type: 'youtube',
    status: 'published',
  };
  if (lesson.videoId) return videosById.get(lesson.videoId) || { ...shown, _id: lesson.videoId, source: 'unknown' };
  return { ...shown, _id: `syllabus-${node.nodeId}`, source: 'syllabus', nodeId: node.nodeId };
};

const syllabusNode = (node, depth, videosById) => {
  const video = lessonVideo(node, node.lesson, videosById);
  return {
    level: levelAt(depth),
    code: node.code || '',
    name: node.title || '',
    nodeId: node.nodeId,
    videos: video ? [video] : [],
    children: (node.children || []).map((child) => syllabusNode(child, depth + 1, videosById)),
  };
};

/**
 * The chapters and lessons a course page shows, plus the videos it lists under More Lessons
 */
export const buildSyllabus = (curriculum, videosById) => ({
  chapters: (curriculum?.chapters || []).map((chapter) => ({
    level: 'chapter',
    code: String(chapter.number ?? ''),
    name: chapter.name || chapter.title || '',
    nodeId: chapter.chapterId,
    videos: [],
    children: (chapter.topics || []).map((node) => syllabusNode(node, 1, videosById)),
  })),
  moreLessons: (curriculum?.extraLessons || []).map((lesson) => lessonVideo({}, lesson, videosById)),
});

// Ids of the Lesson Studio videos a course page already shows
export const shownVideoIds = (syllabus) => {
  const ids = new Set(syllabus.moreLessons.map(videoId));
  const walk = (node) => {
    node.videos.forEach((video) => ids.add(videoId(video)));
    node.children.forEach(walk);
  };
  syllabus.chapters.forEach(walk);
  return ids;
};

export const lessonMatches = (node, query) => {
  const q = query.trim().toLowerCase();
  return [node.name, node.code, ...node.videos.map((video) => video.title)].some((field) =>
    (field || '').toLowerCase().includes(q)
  );
};

/**
 * The next free code below a lesson: after 3.2 comes 3.3, and the first topic of chapter 3 is 3.1
 */
export const nextChildCode = (node) => {
  const used = node.children.map((child) => Number(String(child.code).split('.').pop())).filter(Number.isFinite);
  return `${node.code}.${used.length ? Math.max(...used) + 1 : 1}`;
};

export const nextChapterNumber = (chapters) =>
  chapters.reduce((highest, chapter) => Math.max(highest, Number(chapter.code) || 0), 0) + 1;

/**
 * What the Lesson Studio starts with when adding a video under a lesson.
 * The path is the lessons from the chapter down to the one clicked.
 */
export const studioPreset = ({ subject, year, path = [], level }) => {
  const form = { subject };
  if (year && year !== 'Both Years') form.year = year;
  const fields = {
    chapter: (step) => ({
      chapterNumber: Number(step.code) || 1,
      chapterName: step.name,
      chapter: step.name ? `Chapter ${step.code}: ${step.name}` : `Chapter ${step.code}`,
      chapterKeyword: step.name,
    }),
    topic: (step) => ({ topicNumber: step.code, topicName: step.name, topicKeyword: step.name }),
    subTopic: (step) => ({
      subTopicNumber: step.code,
      subTopicName: step.name,
      subTopicKeyword: step.name,
      lesson: step.name || 'Lesson 1',
      lessonName: step.name || 'Lesson 1',
    }),
    subSubTopic: (step) => ({ subSubTopicNumber: step.code, subSubTopicName: step.name, subSubTopicKeyword: step.name }),
  };
  path.forEach((step) => Object.assign(form, fields[step.level](step)));
  form.uploadLevel = level;
  form.code = path.length ? path[path.length - 1].code : form.chapterNumber ? String(form.chapterNumber) : '1.0';
  return { form, level };
};
