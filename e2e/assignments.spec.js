import { test, expect } from '@playwright/test';
import { API_URL, closeVisitorPages, getAdminToken, newVisitorPage, openAsAdmin, openAsStudent, signInStudent } from './helpers';

// Chapter assignments: the admin sets multiple-choice questions for a chapter, and students take them

const headersFor = async (request) => ({ Authorization: `Bearer ${await getAdminToken(request)}` });

const QUESTIONS = [
  { text: 'What is sin 90°?', options: ['0', '1', '1/2', 'Not defined'], answer: 1, explanation: 'On the unit circle the height at 90° is 1.' },
  { text: 'tan θ equals', options: ['sin θ / cos θ', 'cos θ / sin θ'], answer: 0, explanation: 'Opposite over adjacent.' },
  { text: 'cos 0° is', options: ['0', '1', '-1'], answer: 1, explanation: '' },
];

// A course sold online, with chapters 1 and 2
const addCourse = async (request, testInfo, label) => {
  const headers = await headersFor(request);
  const name = `${label} ${testInfo.project.name} ${Date.now()}`;
  const created = await request.post(`${API_URL}/api/admin/courses`, {
    headers,
    data: { name, subject: name, shortDescription: 'Sold online.', thumbnail: 'https://images.example.com/assignments.jpg', price: 299, oldPrice: 999, sellOnline: true },
  });
  expect(created.ok(), await created.text()).toBeTruthy();
  const course = (await created.json()).course;
  const syllabus = await request.put(`${API_URL}/api/admin/courses/${course._id}/curriculum`, {
    headers,
    data: {
      chapters: [
        { number: '1', name: 'Trigonometry', topics: [{ code: '1.1', title: 'Ratios', youtubeUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ' }] },
        { number: '2', name: 'Matrices', topics: [{ code: '2.1', title: 'Adding matrices', youtubeUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4' }] },
      ],
    },
  });
  expect(syllabus.ok(), await syllabus.text()).toBeTruthy();
  const published = await request.patch(`${API_URL}/api/admin/courses/${course._id}/status`, { headers, data: { status: 'published' } });
  expect(published.ok(), await published.text()).toBeTruthy();
  const cleanUp = () => request.patch(`${API_URL}/api/admin/courses/${course._id}/status`, { headers, data: { status: 'archived' } });
  return { course, cleanUp };
};

// Chapter 1's published assignment, with three questions and a pass mark of 60%
const addAssignment = async (request, course) => {
  const made = await request.post(`${API_URL}/api/admin/assignments`, {
    headers: await headersFor(request),
    data: {
      courseId: course._id,
      chapterKey: '1',
      chapterName: 'Chapter 1: Trigonometry',
      title: 'Trigonometry test',
      instructions: 'Choose the best answer.',
      passPercent: 60,
      questions: QUESTIONS,
      status: 'published',
    },
  });
  expect(made.ok(), await made.text()).toBeTruthy();
  return (await made.json()).assignment;
};

const giveCourse = async (request, course) => {
  const student = await signInStudent(request);
  const given = await request.post(`${API_URL}/api/admin/users/${(student.user || student)._id}/purchases`, {
    headers: await headersFor(request),
    data: { courseId: course._id, note: 'Assignments test' },
  });
  expect(given.ok(), await given.text()).toBeTruthy();
  return student;
};

test('the admin types the questions of a chapter, marks the right answers and publishes the assignment', async ({ page, request }, testInfo) => {
  test.skip(testInfo.project.name === 'phone', 'The admin panel is used on a laptop');
  const { course, cleanUp } = await addCourse(request, testInfo, 'Assignment Admin');
  try {
    await openAsAdmin(page, request);
    await page.goto('/admin/assignments');
    const panel = page.getByTestId('assignments-panel');
    await panel.getByTestId('assignment-course-select').selectOption({ label: course.name });
    const rows = panel.getByTestId('assignment-chapter');
    await expect(rows).toHaveText([/Chapter 1: Trigonometry[\s\S]*No assignment yet/, /Chapter 2: Matrices[\s\S]*No assignment yet/]);

    await rows.first().getByTestId('assignment-add').click();
    const editor = page.getByTestId('assignment-editor');
    await expect(editor.getByTestId('assignment-title')).toHaveValue('Chapter 1: Trigonometry test');
    await expect(editor.getByTestId('assignment-editor-status')).toHaveText('Not saved yet');
    await editor.getByTestId('assignment-title').fill('Trigonometry test');
    await editor.getByTestId('assignment-pass').fill('50');

    // Question 1: four answers, B is right
    const first = editor.getByTestId('question-card').first();
    await first.getByTestId('question-text').fill('What is sin 90°?');
    const answers = ['0', '1', '1/2', 'Not defined'];
    for (let index = 0; index < answers.length; index += 1) await first.getByTestId('option-input').nth(index).fill(answers[index]);
    await first.getByTestId('question-explanation').fill('On the unit circle the height at 90° is 1.');

    // Without a right answer marked it is not saved, and the editor says which question
    await editor.getByTestId('assignment-publish').click();
    await expect(editor.getByTestId('assignment-problem')).toHaveText('Question 1: mark which answer is the right one.');
    await first.getByTestId('option-correct').nth(1).click();
    await expect(first.getByTestId('option-correct').nth(1)).toHaveAttribute('aria-checked', 'true');
    await expect(editor.getByTestId('assignment-problem')).toHaveCount(0);

    // Question 2: two answers (the other two removed), A is right
    await editor.getByTestId('add-question').click();
    await expect(editor.getByTestId('question-count')).toHaveText('(2)');
    const second = editor.getByTestId('question-card').nth(1);
    await second.getByTestId('question-text').fill('tan θ equals');
    await second.getByRole('button', { name: 'Remove answer D of question 2' }).click();
    await second.getByRole('button', { name: 'Remove answer C of question 2' }).click();
    await expect(second.getByTestId('option-input')).toHaveCount(2);
    await second.getByTestId('option-input').nth(0).fill('sin θ / cos θ');
    await second.getByTestId('option-input').nth(1).fill('cos θ / sin θ');
    await second.getByTestId('option-correct').nth(0).click();

    await editor.getByTestId('assignment-publish').click();
    await expect(editor.getByTestId('assignment-editor-status')).toHaveText('Published');
    await editor.getByRole('button', { name: 'Close', exact: true }).click();
    await expect(editor).toHaveCount(0);

    // The chapter's row now shows it; what was saved has the right answers
    await expect(rows.first().getByTestId('assignment-status')).toHaveText('Published');
    await expect(rows.first().getByTestId('assignment-summary')).toHaveText('Trigonometry test · 2 questions · pass 50%');
    const saved = await (await request.get(`${API_URL}/api/admin/assignments?courseId=${course._id}`, { headers: await headersFor(request) })).json();
    expect(saved.assignments).toHaveLength(1);
    expect(saved.assignments[0].chapterKey).toBe('1');
    expect(saved.assignments[0].questions.map((question) => [question.text, question.options.length, question.answer])).toEqual([
      ['What is sin 90°?', 4, 1],
      ['tan θ equals', 2, 0],
    ]);

    // Unpublishing hides it from students; the questions open again for editing
    await rows.first().getByTestId('assignment-toggle').click();
    await expect(rows.first().getByTestId('assignment-status')).toHaveText('Draft');
    const hidden = await (await request.get(`${API_URL}/api/assignments/course/${course._id}`)).json();
    expect(hidden.assignments).toHaveLength(0);
    await rows.first().getByTestId('assignment-edit').click();
    await expect(page.getByTestId('assignment-editor').getByTestId('question-text').first()).toHaveValue('What is sin 90°?');
    await expect(page.getByTestId('assignment-editor').getByTestId('option-correct').nth(1)).toHaveAttribute('aria-checked', 'true');
  } finally {
    await cleanUp();
  }
});

test('a right answer celebrates, a wrong one shows the right answer and why, and the best result is kept', async ({ page, request }, testInfo) => {
  const { course, cleanUp } = await addCourse(request, testInfo, 'Assignment Take');
  try {
    const assignment = await addAssignment(request, course);
    await giveCourse(request, course);
    await openAsStudent(page, request);

    // The course page shows the chapter's assignment
    await page.goto(`/courses/${course.slug}`);
    const card = page.getByTestId('course-assignment');
    await expect(card).toHaveCount(1);
    await expect(card).toContainText('Chapter 1: Trigonometry');
    await expect(card).toContainText('Trigonometry test');
    await expect(card).toContainText('3 questions · pass 60%');
    await expect(card.getByTestId('course-assignment-best')).toHaveText('Not taken yet');
    await card.click();
    await expect(page).toHaveURL(new RegExp(`/assignments/${assignment._id}$`));

    const intro = page.getByTestId('assignment-intro');
    await expect(intro.getByTestId('assignment-title')).toHaveText('Trigonometry test');
    await expect(intro).toContainText('Choose the best answer.');
    await intro.getByTestId('assignment-start').click();

    const quiz = page.getByTestId('quiz');
    const options = quiz.getByTestId('quiz-option');
    const feedback = quiz.getByTestId('quiz-feedback');
    const steps = quiz.getByTestId('quiz-step');

    // Question 1, answered right: green, a bounce, confetti, and the score goes up
    await expect(quiz.getByTestId('quiz-position')).toHaveText('Question 1 of 3');
    await expect(quiz.getByTestId('quiz-question-text')).toHaveText('What is sin 90°?');
    await expect(options).toHaveText([/A\s*0/, /B\s*1/, /C\s*1\/2/, /D\s*Not defined/]);
    await expect(feedback).toHaveCount(0);
    await options.nth(1).click();
    await expect(options.nth(1)).toHaveAttribute('data-state', 'correct');
    await expect(options.nth(1)).toHaveClass(/quiz-pop/);
    await expect(page.locator('body > canvas')).toHaveCount(1);
    await expect(feedback).toHaveAttribute('data-result', 'correct');
    await expect(feedback.getByTestId('quiz-feedback-title')).toHaveText(/Correct!|Well done!|Spot on!|Brilliant!|That is right!/);
    await expect(feedback.getByTestId('quiz-explanation')).toHaveText('On the unit circle the height at 90° is 1.');
    await expect(quiz.getByTestId('quiz-score')).toHaveText('Score 1/3');
    await expect(steps.nth(0)).toHaveAttribute('data-state', 'correct');
    // The other answers can no longer be chosen
    await expect(options.nth(0)).toBeDisabled();

    // Question 2, answered wrong: red and a shake, the right answer lit up, and why
    await quiz.getByTestId('quiz-next').click();
    await expect(quiz.getByTestId('quiz-position')).toHaveText('Question 2 of 3');
    await options.nth(1).click();
    await expect(options.nth(1)).toHaveAttribute('data-state', 'wrong');
    await expect(options.nth(1)).toHaveClass(/quiz-shake/);
    await expect(options.nth(0)).toHaveAttribute('data-state', 'right');
    await expect(feedback).toHaveAttribute('data-result', 'wrong');
    await expect(feedback.getByTestId('quiz-right-answer')).toHaveText('The right answer is A. sin θ / cos θ');
    await expect(feedback.getByTestId('quiz-explanation')).toHaveText('Opposite over adjacent.');
    await expect(quiz.getByTestId('quiz-score')).toHaveText('Score 1/3');
    await expect(steps.nth(1)).toHaveAttribute('data-state', 'wrong');

    // Question 3, answered with the keyboard: B
    await quiz.getByTestId('quiz-next').click();
    await expect(quiz.getByTestId('quiz-position')).toHaveText('Question 3 of 3');
    await page.keyboard.press('b');
    await expect(options.nth(1)).toHaveAttribute('data-state', 'correct');
    await expect(quiz.getByTestId('quiz-score')).toHaveText('Score 2/3');
    await expect(quiz.getByTestId('quiz-next')).toHaveText('See my result');
    await quiz.getByTestId('quiz-next').click();

    // The result: 2 of 3 is 67%, over the pass mark of 60%
    const result = page.getByTestId('quiz-result');
    await expect(result).toHaveAttribute('data-passed', 'true');
    await expect(result.getByTestId('quiz-result-title')).toHaveText('You passed!');
    await expect(result.getByTestId('quiz-result-percent')).toHaveAttribute('data-percent', '67');
    await expect(result.getByTestId('quiz-result-percent')).toHaveText('67%');
    await expect(result.getByTestId('quiz-result-score')).toHaveText('2 of 3 right');
    const review = result.getByTestId('quiz-review-item');
    await expect(review).toHaveCount(3);
    await expect(review.nth(1)).toHaveAttribute('data-correct', 'false');
    await expect(review.nth(1)).toContainText('Your answer: B. cos θ / sin θ');
    await expect(review.nth(1)).toContainText('Right answer: A. sin θ / cos θ');

    // Back on the course page the best result shows
    await page.goto(`/courses/${course.slug}`);
    await expect(card.getByTestId('course-assignment-best')).toHaveText('Best 2/3 · 67%');
    await expect(card).toContainText('Try again');

    // A second go left in the middle carries on from where it stopped
    await card.click();
    await expect(page.getByTestId('assignment-best')).toHaveText('Your best: 2/3 · 67% · passed');
    await page.getByTestId('assignment-start').click();
    await options.nth(0).click();
    await expect(options.nth(0)).toHaveAttribute('data-state', 'wrong');
    await page.goto(`/courses/${course.slug}`);
    await expect(card).toContainText('Continue');
    await card.click();
    await expect(page.getByTestId('assignment-continue')).toHaveText('Continue (1 of 3 answered)');
    await page.getByTestId('assignment-continue').click();
    await expect(quiz.getByTestId('quiz-position')).toHaveText('Question 2 of 3');
    await expect(steps.nth(0)).toHaveAttribute('data-state', 'wrong');
    await expect(steps.nth(1)).toHaveAttribute('data-state', 'current');

    // The admin's results list has the student's best
    const results = await (await request.get(`${API_URL}/api/admin/assignments/${assignment._id}/results`, { headers: await headersFor(request) })).json();
    expect(results.students.map((student) => [student.attempts, student.best.percent, student.best.passed])).toEqual([[1, 67, true]]);
  } finally {
    await cleanUp();
  }
});

test('a visitor is asked to sign in for an assignment, and a student without the course to buy it', async ({ page, request }, testInfo) => {
  const { course, cleanUp } = await addCourse(request, testInfo, 'Assignment Lock');
  try {
    const assignment = await addAssignment(request, course);

    // A visitor sees the assignment on the course page, and is asked to sign in
    const visitor = await newVisitorPage(page);
    await visitor.goto(`/courses/${course.slug}`);
    const visitorCard = visitor.getByTestId('course-assignment');
    await expect(visitorCard).toContainText('Sign in to take it');
    await visitorCard.click();
    await expect(visitor.getByRole('dialog', { name: 'Sign in required' })).toContainText('Sign In to Take It');
    await visitor.goto(`/assignments/${assignment._id}`);
    await expect(visitor.getByTestId('assignment-locked')).toContainText('Sign in to take this assignment.');
    await expect(visitor.getByTestId('quiz-option')).toHaveCount(0);
    await closeVisitorPages();

    // A student who has not bought the course is asked to buy it
    await openAsStudent(page, request);
    await page.goto(`/courses/${course.slug}`);
    const card = page.getByTestId('course-assignment');
    await expect(card).toContainText('Buy to take it');
    await card.click();
    await expect(page.getByRole('dialog', { name: 'Buy this course' })).toContainText('Buy to Take It');
    await page.goto(`/assignments/${assignment._id}`);
    const locked = page.getByTestId('assignment-locked');
    await expect(locked).toContainText(`This assignment is part of the ${course.name} course.`);
    await expect(locked.getByRole('button', { name: `Buy ${course.name}` })).toBeVisible();
    await expect(page.getByTestId('assignment-start')).toHaveCount(0);
  } finally {
    await cleanUp();
  }
});
