// A signed-in student sees the subjects and labs of the board they chose at sign-up.
// A course's boards are the ones ticked on it in the admin Courses page.

// The boards a student can choose, and the other ways a board's name is written
const KNOWN_BOARDS = [
  { key: 'andhra pradesh', names: ['andhra pradesh', 'andhra', 'bieap', 'ap'] },
  { key: 'telangana', names: ['telangana', 'tsbie', 'ts', 'tg'] },
];

const tidy = (value) =>
  ` ${String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\b(intermediate|board|boards|state)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()} `;

/**
 * One name for a board however it was written: "Andhra Pradesh Intermediate", "Andhra Pradesh"
 * and "AP" are all the same board.
 */
export const boardKey = (value) => {
  const text = tidy(value);
  if (!text.trim()) return '';
  const known = KNOWN_BOARDS.find((board) => board.names.some((name) => text.includes(` ${name} `)));
  return known ? known.key : text.trim();
};

// The board a list is narrowed to: none for a visitor or an administrator
const boardOfViewer = (user) => (user && user.role !== 'admin' ? boardKey(user.board) : '');

const isForBoard = (course, key) => (course.boards || []).some((board) => boardKey(board) === key);

/**
 * The courses for the signed-in student's board. A course with no board ticked is for every board.
 * Everyone sees every course when there is no student board, or when the student's board is
 * neither AP, Telangana nor a board ticked on any course (an older account, say).
 */
export const coursesForBoard = (courses, user) => {
  const key = boardOfViewer(user);
  if (!key) return courses;
  const known = KNOWN_BOARDS.some((board) => board.key === key) || courses.some((course) => isForBoard(course, key));
  if (!known) return courses;
  return courses.filter((course) => !(course.boards || []).length || isForBoard(course, key));
};

const sameSubject = (a, b) => String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();

/**
 * The labs that go with the courses shown: a lab stays when a course of its subject is shown,
 * or when there is no course of its subject at all.
 */
export const labsForBoard = (labs, allCourses, shownCourses) => {
  if (shownCourses === allCourses) return labs;
  return labs.filter(
    (lab) =>
      shownCourses.some((course) => sameSubject(course.subject, lab.shortName)) ||
      !allCourses.some((course) => sameSubject(course.subject, lab.shortName))
  );
};
