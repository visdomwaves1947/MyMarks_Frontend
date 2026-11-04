import { test, expect } from '@playwright/test';
import { goToCoursesTab, openAsAdmin } from './helpers';

test.describe.configure({ mode: 'serial' });

const openView = async (page, name) => {
  await goToCoursesTab(page);
  await page.getByRole('button', { name, exact: true }).click();
};

const chip = (page, group, name) =>
  page.getByText(group, { exact: true }).locator('..').getByRole('button', { name, exact: true });

test('an admin adds a board and a new course offers it', async ({ page, request }) => {
  await openAsAdmin(page, request);
  await openView(page, 'Boards');

  const list = page.getByRole('region', { name: 'Boards list' });
  await expect(list.getByTestId('course-option').filter({ hasText: 'Andhra Pradesh' })).toBeVisible();
  await list.getByLabel('New board name').fill('CBSE');
  await list.getByRole('button', { name: 'Add Board' }).click();
  await expect(list.getByTestId('course-option').filter({ hasText: 'CBSE' })).toContainText('0 courses');

  await page.getByRole('button', { name: 'Courses', exact: true }).click();
  await page.getByRole('button', { name: 'Add Course' }).click();
  await expect(chip(page, 'Boards', 'CBSE')).toHaveAttribute('aria-pressed', 'true');
  await expect(chip(page, 'Boards', 'Telangana')).toHaveAttribute('aria-pressed', 'true');
});

test('renaming a year renames it on the courses, and a hidden board is not offered', async ({ page, request }) => {
  await openAsAdmin(page, request);
  await openView(page, 'Years');

  const years = page.getByRole('region', { name: 'Years list' });
  await years.getByRole('button', { name: 'Rename 2nd Year' }).click();
  await years.getByLabel('New name for 2nd Year').fill('Second Year');
  await years.getByRole('button', { name: 'Save name' }).click();
  await expect(page.getByText(/Year renamed on \d+ courses/)).toBeVisible();

  await page.getByRole('button', { name: 'Boards', exact: true }).click();
  const boards = page.getByRole('region', { name: 'Boards list' });
  await boards.getByRole('button', { name: 'Hide CBSE' }).click();
  await expect(boards.getByTestId('course-option').filter({ hasText: 'CBSE' })).toContainText('Hidden');

  await page.getByRole('button', { name: 'Courses', exact: true }).click();
  await page.getByRole('button', { name: 'Edit Mathematics' }).click();
  await expect(chip(page, 'Years', 'Second Year')).toHaveAttribute('aria-pressed', 'true');
  await expect(chip(page, 'Years', '2nd Year')).toHaveCount(0);
  await expect(chip(page, 'Boards', 'CBSE')).toHaveCount(0);
});

test('an admin deletes a board, and a stream in use is refused', async ({ page, request }) => {
  await openAsAdmin(page, request);
  await openView(page, 'Boards');

  const boards = page.getByRole('region', { name: 'Boards list' });
  const dialog = page.getByRole('alertdialog');

  // Cancel and Escape both keep it
  await boards.getByRole('button', { name: 'Delete CBSE' }).click();
  await expect(dialog).toHaveAccessibleName('Delete "CBSE"?');
  await dialog.getByRole('button', { name: 'Cancel' }).click();
  await boards.getByRole('button', { name: 'Delete CBSE' }).click();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(boards.getByTestId('course-option').filter({ hasText: 'CBSE' })).toHaveCount(1);

  await boards.getByRole('button', { name: 'Delete CBSE' }).click();
  await dialog.getByRole('button', { name: 'Delete Board' }).click();
  await expect(page.getByText('Board deleted')).toBeVisible();
  await expect(boards.getByTestId('course-option').filter({ hasText: 'CBSE' })).toHaveCount(0);

  // A stream in use explains why it stays
  await page.getByRole('button', { name: 'Streams', exact: true }).click();
  await page.getByRole('button', { name: 'Delete MPC' }).click();
  await expect(dialog).toHaveAccessibleName('MPC is in use');
  await expect(dialog).toContainText(/on \d+ courses/);
  await dialog.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByRole('button', { name: 'Delete MPC' })).toBeVisible();
});
