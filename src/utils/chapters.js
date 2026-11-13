// A chapter's key: its number such as "1" (or its name when it has none). Chapter notes and
// chapter assignments are both stored under this key.
export const chapterKeyOf = (chapter) =>
  String(chapter?.number || chapter?.name || 'lessons')
    .trim()
    .toLowerCase()
    .slice(0, 80);

// "Chapter 1: Trigonometry"
export const chapterNameOf = (chapter) => (chapter?.number ? `Chapter ${chapter.number}: ${chapter.name}` : chapter?.name || 'More lessons');
