// Shared helpers for a course's chapter, topic and subtopic tree

export const isVideoLesson = (lesson) =>
  Boolean(lesson?.youtubeId) ||
  /\.(mp4|webm|mov|ogv?|m4v)(\?|$)/i.test(lesson?.url || '') ||
  /\/video\/upload\//.test(lesson?.url || '');

// Every topic at every depth, in reading order, with the topics above it
export const flattenChapters = (chapters) => {
  const list = [];

  const visit = (node, chapter, trail) => {
    list.push({ ...node, chapterId: chapter.chapterId, chapterName: chapter.name, chapterNumber: chapter.number, trail });
    (node.children || []).forEach((child) =>
      visit(child, chapter, [...trail, { nodeId: node.nodeId, code: node.code, title: node.title }])
    );
  };

  chapters.forEach((chapter) => (chapter.topics || []).forEach((node) => visit(node, chapter, [])));
  return list;
};

// The first lesson inside a topic, preferring one that is not locked
export const firstLessonIn = (node) => {
  const found = [];
  const visit = (item) => {
    if (item.lesson) found.push(item);
    (item.children || []).forEach(visit);
  };
  visit(node);
  return found.find((item) => !item.lesson.isLocked) || found[0] || null;
};
