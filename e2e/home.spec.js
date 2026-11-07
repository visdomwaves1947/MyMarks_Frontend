import { test, expect } from '@playwright/test';
import { closeVisitorPages, newVisitorPage, openAsAdmin } from './helpers';

test.afterEach(closeVisitorPages);

const openHomeEditor = async (page, request) => {
  await openAsAdmin(page, request);
  await page.goto('/admin/pages');
  await expect(page.getByRole('heading', { name: 'Website Pages' })).toBeVisible();
  // The Home Page tab opens first
  await expect(page.getByRole('tab', { name: 'Home Page' })).toHaveAttribute('aria-selected', 'true');
  const editor = page.getByRole('tabpanel', { name: 'Home Page' });
  await expect(editor.getByRole('heading', { name: 'Home Page' })).toBeVisible();
  return editor;
};

// Sections and their items start closed, and open when clicked
const openSection = async (section, title) => {
  const header = section.getByRole('button', { name: new RegExp(`^${title}`) });
  await header.click();
  return header;
};
const openItem = (section, number, name) =>
  section.getByRole('button', { name: new RegExp(`^${number}\\. ${name}`) }).click();

const restoreBuiltIn = async (page) => {
  await page.getByRole('button', { name: 'Use Built-in Page' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Use Built-in Page' }).click();
  await expect(page.getByText('The built-in home page is back on the website.')).toBeVisible();
};

const visitHome = async (visitor) => {
  await visitor.goto('/demo');
  await expect(visitor.getByTestId('course-card').first()).toBeVisible();
};

test('an admin edits the three home page sections in one place, and visitors see them', async ({ page, request }) => {
  const editor = await openHomeEditor(page, request);
  await expect(editor.getByText('Showing the built-in page until you save.')).toBeVisible();
  const save = editor.getByRole('button', { name: 'Save Home Page' }).first();

  // Every section starts closed
  await expect(editor.getByRole('textbox')).toHaveCount(0);

  // How to Use: a new heading and button, a renamed step and a hidden one
  const steps = editor.getByTestId('home-how-to-use');
  const stepsHeader = await openSection(steps, 'How to Use MyMarks');
  await steps.getByRole('textbox', { name: 'Heading', exact: true }).fill('Start in Three Steps');
  await steps.getByRole('textbox', { name: 'Button', exact: true }).fill('Join MyMarks');
  await expect(steps.getByRole('textbox', { name: 'Step title *', exact: true })).toHaveCount(0);
  await openItem(steps, 2, 'Choose Your Subjects');
  await steps.getByRole('textbox', { name: 'Step title *', exact: true }).fill('Pick Your Subjects');
  await openItem(steps, 4, 'Test & Improve');
  await steps.getByRole('checkbox', { name: 'Show on the home page' }).last().uncheck();
  await expect(stepsHeader).toContainText('4 steps, 3 shown');

  // Why Choose: a new card opens by itself and must have a title, and the first card is hidden
  const cards = editor.getByTestId('home-why-choose');
  const cardsHeader = await openSection(cards, 'Why Thousands Choose MyMarks');
  await cards.getByRole('button', { name: 'Add Card' }).click();
  await expect(editor.getByTestId('home-problems')).toContainText('Card 13 of "Why Choose" needs a title.');
  await expect(cardsHeader).toContainText('1 problem');
  await expect(cards.getByRole('button', { name: /^13\. New card/ })).toContainText('Needs a title');
  await expect(save).toBeDisabled();
  await cards.getByRole('textbox', { name: 'Card title *', exact: true }).last().fill('Live Doubt Classes');
  await cards.getByRole('textbox', { name: 'Card text', exact: true }).last().fill('Ask a teacher every evening.');
  await openItem(cards, 1, 'Official AP');
  await cards.getByRole('checkbox', { name: 'Show on the home page' }).first().uncheck();
  await expect(editor.getByTestId('home-problems')).toHaveCount(0);

  // What Our Students Say: a new heading, a new review and a hidden one
  const reviews = editor.getByTestId('home-reviews');
  const reviewsHeader = await openSection(reviews, 'What Our Students Say');
  await reviews.getByRole('textbox', { name: 'Heading', exact: true }).fill('Hear From Our Toppers');
  await expect(reviews.getByTestId('reviews-preview')).toContainText('Hear From Our Toppers');
  await reviews.getByRole('button', { name: 'Add Review' }).click();
  await expect(editor.getByTestId('home-problems')).toContainText("Review 11 needs the student's name.");
  await reviews.getByRole('textbox', { name: 'Student name *', exact: true }).last().fill('R. Test Student');
  await reviews.getByRole('textbox', { name: 'Year and result', exact: true }).last().fill('2nd Year (99/100)');
  await reviews.getByRole('textbox', { name: 'What they said *', exact: true }).last().fill('The roadmap kept me on track every day.');
  await openItem(reviews, 1, 'K\\. Sai Varun');
  await reviews.getByRole('checkbox', { name: 'Show on the home page' }).first().uncheck();
  await expect(reviewsHeader).toContainText('11 reviews, 10 shown');

  await save.click();
  await expect(page.getByText('Home page saved.')).toBeVisible();

  const visitor = await newVisitorPage(page);
  await visitHome(visitor);

  const howToUse = visitor.getByTestId('how-to-use');
  await expect(howToUse.getByRole('heading', { name: 'Start in Three Steps' })).toBeVisible();
  await expect(howToUse.getByTestId('how-to-use-step')).toHaveCount(3);
  await expect(howToUse.getByTestId('how-to-use-step').nth(1)).toContainText('2. Pick Your Subjects');
  await expect(howToUse.getByRole('button', { name: 'Join MyMarks' })).toBeVisible();

  const whyChoose = visitor.getByTestId('why-choose');
  await expect(whyChoose.getByTestId('why-choose-card')).toHaveCount(12);
  await expect(whyChoose.getByTestId('why-choose-card').last()).toContainText('Live Doubt Classes');
  await expect(whyChoose.getByTestId('why-choose-card').filter({ hasText: 'Official AP & Telangana Syllabus' })).toHaveCount(0);

  const studentReviews = visitor.locator('#student-reviews');
  await studentReviews.scrollIntoViewIfNeeded();
  await expect(studentReviews.getByRole('heading', { name: 'Hear From Our Toppers' })).toBeVisible();
  await expect(studentReviews.getByTestId('student-review')).toHaveCount(10);
  await expect(studentReviews.getByTestId('student-review').filter({ hasText: 'R. Test Student' })).toContainText('2nd Year (99/100)');
  await expect(studentReviews.getByTestId('student-review').filter({ hasText: 'K. Sai Varun' })).toHaveCount(0);

  // Back to the page as it was built, for the other test files
  await restoreBuiltIn(page);
  await visitHome(visitor);
  await expect(visitor.getByTestId('how-to-use').getByRole('heading', { name: 'How to Use MyMarks' })).toBeVisible();
  await expect(visitor.getByTestId('how-to-use-step')).toHaveCount(4);
  await expect(visitor.getByTestId('why-choose-card').filter({ hasText: 'Official AP & Telangana Syllabus' })).toHaveCount(1);
  await expect(visitor.locator('#student-reviews').getByRole('heading', { name: 'What Our Students Say' })).toBeVisible();
});

test('a section with every card hidden leaves the home page, and the others stay', async ({ page, request }) => {
  const editor = await openHomeEditor(page, request);
  const reviews = editor.getByTestId('home-reviews');
  await openSection(reviews, 'What Our Students Say');
  for (let number = 1; number <= 10; number += 1) await openItem(reviews, number, '');
  const toggles = reviews.getByRole('checkbox', { name: 'Show on the home page' });
  await expect(toggles).toHaveCount(10);
  for (let index = 0; index < 10; index += 1) await toggles.nth(index).uncheck();
  await expect(reviews.getByText('No review is shown, so the home page hides this section.')).toBeVisible();
  await editor.getByRole('button', { name: 'Save Home Page' }).first().click();
  await expect(page.getByText('Home page saved.')).toBeVisible();

  const visitor = await newVisitorPage(page);
  await visitHome(visitor);
  // The built-in reviews show first, and the section leaves once the saved, empty list arrives
  await expect(visitor.locator('#student-reviews')).toHaveCount(0);
  await expect(visitor.getByTestId('how-to-use-step')).toHaveCount(4);
  await expect(visitor.getByTestId('why-choose-card')).toHaveCount(12);

  await restoreBuiltIn(page);
});
