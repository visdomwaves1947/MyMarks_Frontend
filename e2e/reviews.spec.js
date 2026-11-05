import { test, expect } from '@playwright/test';
import { closeVisitorPages, newVisitorPage, openAsAdmin } from './helpers';

const homeReviews = async (page) => {
  await page.goto('/demo');
  const section = page.locator('#student-reviews');
  await section.scrollIntoViewIfNeeded();
  return section;
};

test.afterEach(closeVisitorPages);

test('an admin edits the home page reviews, visitors see them, and the built-in ones can come back', async ({ page, request }) => {
  await openAsAdmin(page, request);
  await page.goto('/admin/pages');
  await expect(page.getByRole('heading', { name: 'Website Pages' })).toBeVisible();
  // The Home Page tab opens first
  await expect(page.getByRole('tab', { name: 'Home Page' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('heading', { name: 'What Our Students Say' })).toBeVisible();
  await expect(page.getByText('Showing the built-in reviews until you save.')).toBeVisible();
  await expect(page.getByTestId('reviews-preview')).toContainText('K. Sai Varun');

  await page.getByRole('textbox', { name: 'Heading', exact: true }).fill('Hear From Our Toppers');
  await expect(page.getByTestId('reviews-preview')).toContainText('Hear From Our Toppers');

  // A new review must have a name and what was said before it can be saved
  await page.getByRole('button', { name: 'Add Review' }).click();
  const save = page.getByRole('button', { name: 'Save Reviews' }).first();
  await expect(page.getByTestId('review-problems')).toContainText("Review 11 needs the student's name.");
  await expect(save).toBeDisabled();
  await page.getByRole('textbox', { name: 'Student name *', exact: true }).last().fill('R. Test Student');
  await page.getByRole('textbox', { name: 'Year and result', exact: true }).last().fill('2nd Year (99/100)');
  await page.getByRole('textbox', { name: 'What they said *', exact: true }).last().fill('The roadmap kept me on track every day.');
  await expect(page.getByTestId('review-problems')).toHaveCount(0);

  // Hidden reviews stay saved but leave the home page
  await page.getByRole('checkbox', { name: 'Show on the home page' }).first().uncheck();
  await expect(page.getByText('Reviews (11, 10 shown)')).toBeVisible();
  await save.click();
  await expect(page.getByText('Reviews saved.')).toBeVisible();

  const visitor = await newVisitorPage(page);
  let section = await homeReviews(visitor);
  await expect(section.getByRole('heading', { name: 'Hear From Our Toppers' })).toBeVisible();
  await expect(section.getByTestId('student-review')).toHaveCount(10);
  await expect(section.getByTestId('student-review').filter({ hasText: 'R. Test Student' })).toContainText('2nd Year (99/100)');
  await expect(section.getByTestId('student-review').filter({ hasText: 'K. Sai Varun' })).toHaveCount(0);

  await page.getByRole('button', { name: 'Use Built-in Reviews' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Use Built-in Reviews' }).click();
  await expect(page.getByText('The built-in reviews are back on the home page.')).toBeVisible();

  section = await homeReviews(visitor);
  await expect(section.getByRole('heading', { name: 'What Our Students Say' })).toBeVisible();
  await expect(section.getByTestId('student-review').filter({ hasText: 'K. Sai Varun' })).toHaveCount(1);
  await expect(section.getByTestId('student-review').filter({ hasText: 'R. Test Student' })).toHaveCount(0);
});

test('with every review hidden, the home page leaves the section out', async ({ page, request }) => {
  await openAsAdmin(page, request);
  await page.goto('/admin/pages');
  const toggles = page.getByRole('checkbox', { name: 'Show on the home page' });
  await expect(toggles).toHaveCount(10);
  for (let index = 0; index < 10; index += 1) await toggles.nth(index).uncheck();
  await expect(page.getByText('No review is shown, so the home page hides this section.')).toBeVisible();
  await page.getByRole('button', { name: 'Save Reviews' }).first().click();
  await expect(page.getByText('Reviews saved.')).toBeVisible();

  const visitor = await newVisitorPage(page);
  await visitor.goto('/demo');
  await expect(visitor.getByTestId('course-card').first()).toBeVisible();
  // The built-in reviews show first, and the section leaves once the saved, empty list arrives
  await expect(visitor.locator('#student-reviews')).toHaveCount(0);

  // Leave the built-in reviews for the other test files
  await page.getByRole('button', { name: 'Use Built-in Reviews' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Use Built-in Reviews' }).click();
  await expect(page.getByText('The built-in reviews are back on the home page.')).toBeVisible();
});
