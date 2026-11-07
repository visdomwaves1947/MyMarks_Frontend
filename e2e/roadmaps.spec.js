import { test, expect } from '@playwright/test';
import { API_URL, closeVisitorPages, newVisitorPage, openAsAdmin, openAsStudent } from './helpers';

// Zoology and Telugu are used only here, so the other files keep their roadmaps as loaded

// The page opens with no subject chosen, and the subject list has a search box
const openRoadmapsFor = async (page, request, name) => {
  await openAsAdmin(page, request);
  await page.goto('/admin/roadmaps');
  await expect(page.getByRole('heading', { name: 'Study Roadmaps' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Subject Choose a subject' })).toBeVisible();
  await expect(page.getByTestId('admin-roadmap')).toHaveCount(0);

  await page.getByRole('button', { name: /^Subject/ }).click();
  await page.getByLabel('Search subjects').fill(name.slice(0, 4));
  await expect(page.getByRole('listbox', { name: 'Subjects' }).getByRole('option')).toHaveCount(1);
  await page.getByRole('option', { name: new RegExp(`^${name}`) }).click();
  await expect(page.getByRole('button', { name: new RegExp(`^Subject ${name}`) })).toBeVisible();
  await expect(page.getByTestId('admin-roadmap').first()).toBeVisible();
};

const addRoadmap = async (page, days) => {
  const rows = page.getByTestId('admin-roadmap');
  const count = await rows.count();
  await page.getByRole('group', { name: 'Add a roadmap' }).getByRole('button', { name: days, exact: true }).click();
  await expect(rows).toHaveCount(count + 1);
  return rows.last();
};

const saveRoadmaps = async (page) => {
  await page.getByRole('button', { name: 'Save Roadmaps' }).first().click();
  await expect(page.getByText('Roadmaps saved.')).toBeVisible();
};

test.afterEach(closeVisitorPages);

test('an admin builds a 10 day roadmap, and a visitor follows it day by day', async ({ page, request }) => {
  await openRoadmapsFor(page, request, 'Zoology');
  await expect(page.getByTestId('admin-roadmap')).toHaveCount(6);

  // Zoology already has 1, 3, 5, 7, 15 and 30 day roadmaps, and a second one of the same length is refused
  const adding = page.getByRole('group', { name: 'Add a roadmap' });
  await expect(adding.getByRole('button', { name: '5 Days', exact: true })).toBeDisabled();
  await page.getByLabel('Days for a new roadmap').fill('7');
  await adding.getByRole('button', { name: 'Add', exact: true }).click();
  await expect(page.getByText('Zoology already has a roadmap of 7 days. Each roadmap needs its own number of days.')).toBeVisible();
  await expect(page.getByTestId('admin-roadmap')).toHaveCount(6);

  const editor = await addRoadmap(page, '10 Days');
  await expect(editor.getByLabel('Title *', { exact: true })).toHaveValue('10 Days Zoology Plan');
  await expect(adding.getByRole('button', { name: '10 Days', exact: true })).toBeDisabled();

  // A missing title is shown and blocks saving until it is fixed
  await editor.getByLabel('Title *', { exact: true }).fill('');
  await expect(page.getByTestId('roadmap-problems')).toContainText('Add a title.');
  await expect(page.getByRole('button', { name: 'Save Roadmaps' }).first()).toBeDisabled();
  await editor.getByLabel('Title *', { exact: true }).fill('10 Days Zoology Plan');
  await expect(page.getByTestId('roadmap-problems')).toHaveCount(0);

  // The number of days cannot change to one another roadmap has
  await editor.getByLabel('Number of days').fill('15');
  await editor.getByRole('button', { name: 'Set Days' }).click();
  await expect(editor.getByText('Zoology already has a roadmap of 15 days.')).toBeVisible();
  await editor.getByLabel('Number of days').fill('10');
  await editor.getByLabel('Level').fill('HARD');
  await editor.getByLabel('Expected score').fill('55-60 / 60');
  await expect(editor.getByRole('group', { name: 'Choose a day' }).getByRole('button')).toHaveCount(10);

  // Day 1: a lesson and a notes link
  await editor.getByLabel('Day title').fill('Cell structure');
  await editor.getByRole('button', { name: 'Add Step' }).click();
  await expect(page.getByTestId('roadmap-problems')).toContainText('Day 1, step 1 needs a title.');
  await editor.getByLabel('Time').fill('2 hours');
  await editor.getByLabel('Title', { exact: true }).fill('Parts of a cell');
  await editor.getByRole('button', { name: 'Add Resource' }).click();
  await editor.getByRole('combobox', { name: 'Lesson', exact: true }).selectOption({ index: 1 });
  await expect(editor.getByRole('textbox', { name: 'Label', exact: true }).first()).not.toHaveValue('');
  await editor.getByRole('button', { name: 'Add Resource' }).click();
  await editor.getByRole('combobox', { name: 'Kind', exact: true }).nth(1).selectOption('notes');
  await editor.getByRole('textbox', { name: 'Label', exact: true }).nth(1).fill('Cell diagram sheet');
  await editor.getByRole('textbox', { name: 'Link', exact: true }).fill('javascript:alert(1)');
  await expect(editor.getByText('The link must start with https:// or be a page on this site')).toBeVisible();
  await editor.getByRole('textbox', { name: 'Link', exact: true }).fill('https://notes.example.com/cell.pdf');
  await expect(page.getByTestId('roadmap-problems')).toHaveCount(0);

  // Day 2: one plain step
  await editor.getByRole('button', { name: 'Day 2', exact: true }).click();
  await expect(editor.getByText('Day 2 of 10')).toBeVisible();
  await editor.getByLabel('Day title').fill('Genetics');
  await editor.getByRole('button', { name: 'Add Step' }).click();
  await editor.getByLabel('Title', { exact: true }).fill("Mendel's laws");

  await editor.getByRole('button', { name: 'Count from Plan' }).click();
  await expect(editor.getByLabel('Modules')).toHaveValue('2');
  await expect(editor.getByLabel('Videos')).toHaveValue('1');
  await expect(editor.getByLabel('Notes')).toHaveValue('1');
  await saveRoadmaps(page);
  await expect(page.getByText('You have unsaved changes')).toHaveCount(0);

  const visitor = await newVisitorPage(page);
  await visitor.goto('/courses/zoology');
  const card = visitor.getByTestId('course-roadmap').filter({ hasText: '10 Days Zoology Plan' });
  await expect(card).toContainText('HARD');
  await expect(card).toContainText('55-60 / 60');
  await card.getByRole('button', { name: 'Select Roadmap' }).click();

  await expect(visitor.getByText('10 DAYS PLAN • HARD')).toBeVisible();
  await expect(visitor.getByRole('tablist', { name: 'Days' }).getByRole('tab')).toHaveCount(10);
  await expect(visitor.getByRole('heading', { name: 'Cell structure' })).toBeVisible();
  const step = visitor.getByTestId('plan-step').first();
  await expect(step.getByRole('button', { name: 'Cell diagram sheet' })).toBeVisible();

  await step.getByRole('button', { name: 'Mark step 01 done', exact: true }).click();
  await expect(visitor.getByTestId('plan-progress')).toContainText('1 of 2 steps done');

  // A visitor is asked to sign in before a lesson plays
  await step.getByRole('button', { name: 'Start Step 01' }).click();
  const signIn = visitor.getByRole('dialog', { name: 'Sign in required' });
  await expect(signIn).toBeVisible();
  await signIn.getByRole('button', { name: 'Close' }).click();

  await visitor.getByRole('tab', { name: /^Day 2\b/ }).click();
  await expect(visitor.getByRole('heading', { name: "Mendel's laws" })).toBeVisible();
  await expect(visitor.getByRole('button', { name: 'Mark Step 01 Done', exact: true })).toBeVisible();

  // The ticks and the open day are kept when the plan opens again
  await visitor.getByRole('button', { name: 'Close plan' }).click();
  await card.getByRole('button', { name: 'Select Roadmap' }).click();
  await expect(visitor.getByRole('heading', { name: "Mendel's laws" })).toBeVisible();
  await expect(visitor.getByTestId('plan-progress')).toContainText('1 of 2 steps done');
  await visitor.getByRole('tab', { name: /^Day 1\b/ }).click();
  await expect(visitor.getByRole('button', { name: 'Step 01 done', exact: true })).toBeVisible();
});

test('a signed-in student opens the lesson of a step in the course player', async ({ page, request }) => {
  await openAsStudent(page, request);
  await page.goto('/courses/zoology');
  await page
    .getByTestId('course-roadmap')
    .filter({ hasText: '10 Days Zoology Plan' })
    .getByRole('button', { name: 'Select Roadmap' })
    .click();

  await page.getByTestId('plan-step').first().getByRole('button', { name: 'Start Step 01' }).click();
  await expect(page.getByTestId('lesson-player')).toBeVisible();
  await expect(page.getByText('Topic Hierarchy')).toBeVisible();
});

test('filling the days from the lessons spreads the syllabus over a new 10 day roadmap', async ({ page, request }) => {
  await openRoadmapsFor(page, request, 'Telugu');
  const editor = await addRoadmap(page, '10 Days');

  await editor.getByRole('button', { name: 'Fill Days from Lessons' }).click();
  const days = editor.getByRole('group', { name: 'Choose a day' }).getByRole('button');
  await expect(days).toHaveCount(10);
  for (let index = 0; index < 10; index += 1) {
    await expect(days.nth(index)).toHaveText(new RegExp(`^Day ${index + 1} · \\d+$`));
  }

  // Telugu has a 3 day roadmap already, and taking planned days away asks first
  await editor.getByLabel('Number of days').fill('3');
  await editor.getByRole('button', { name: 'Set Days' }).click();
  await expect(editor.getByText('Telugu already has a roadmap of 3 days.')).toBeVisible();
  await expect(days).toHaveCount(10);
  await editor.getByLabel('Number of days').fill('2');
  await editor.getByRole('button', { name: 'Set Days' }).click();
  await expect(page.getByRole('alertdialog')).toContainText('Remove the last 8 days?');
  await page.getByRole('button', { name: 'Remove Days' }).click();
  await expect(days).toHaveCount(2);

  await editor.getByRole('button', { name: 'Count from Plan' }).click();
  await saveRoadmaps(page);

  const res = await request.get(`${API_URL}/api/courses/telugu`);
  const plan = (await res.json()).course.page.roadmaps.items.find((item) => item.title === '10 Days Telugu Plan');
  expect(plan.duration).toBe(2);
  expect(plan.stats.videos).toBeGreaterThan(0);
  for (const day of plan.days) {
    expect(day.title).not.toBe('');
    expect(day.steps.length).toBeGreaterThan(0);
    expect(day.steps[0].resources[0]).toMatchObject({ kind: 'video' });
    expect(day.steps[0].resources[0].nodeId).not.toBe('');
  }
});
