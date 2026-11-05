import { test, expect } from '@playwright/test';
import { closeVisitorPages, newVisitorPage, openAsAdmin } from './helpers';

test.afterEach(closeVisitorPages);

const openAboutEditor = async (page, request) => {
  await openAsAdmin(page, request);
  await page.goto('/admin/pages');
  await page.getByRole('tab', { name: 'About Us' }).click();
  const editor = page.getByRole('tabpanel', { name: 'About Us' });
  await expect(editor.getByRole('heading', { name: 'About Us Page' })).toBeVisible();
  return editor;
};

const restoreBuiltIn = async (page) => {
  await page.getByRole('button', { name: 'Use Built-in Page' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Use Built-in Page' }).click();
  await expect(page.getByText('The built-in About Us page is back on the website.')).toBeVisible();
};

test('an admin changes the About Us cards in Website Pages, and visitors see them', async ({ page, request }) => {
  const editor = await openAboutEditor(page, request);
  await expect(editor.getByText('Showing the built-in page until you save.')).toBeVisible();
  await expect(editor.getByText('Leader cards (5, 5 shown)')).toBeVisible();

  await editor.getByRole('textbox', { name: 'Heading', exact: true }).first().fill('Meet Our Team');

  // Hide the last leader, and add a new one with no photo and no link
  await editor.getByRole('checkbox', { name: 'Show on the About Us page' }).nth(4).uncheck();
  await editor.getByRole('button', { name: 'Add Leader' }).click();
  const save = editor.getByRole('button', { name: 'Save About Us' }).first();
  await expect(editor.getByTestId('about-problems')).toContainText('Leader 6 needs a name.');
  await expect(save).toBeDisabled();

  await editor.getByRole('textbox', { name: 'Name *', exact: true }).nth(5).fill('Anita Rao');
  await editor.getByRole('textbox', { name: 'Role *', exact: true }).last().fill('Head of Student Success');
  await editor.getByRole('textbox', { name: 'Tagline', exact: true }).last().fill('Every student gets a plan.');
  await editor.getByRole('textbox', { name: 'Strategic impact points', exact: true }).last().fill('Guided 500 students');
  await editor.getByRole('textbox', { name: 'Tags', exact: true }).last().fill('Mentor\n\nCareer Guide');

  const link = editor.getByRole('textbox', { name: 'Read more link', exact: true }).last();
  await link.fill('ftp://files.example.com');
  await expect(editor.getByTestId('about-problems')).toContainText('The Read more link of Anita Rao must start with https://');
  await link.fill('');
  await expect(editor.getByTestId('about-problems')).toHaveCount(0);

  await editor.getByText('Preview this card').last().click();
  const preview = editor.getByTestId('leader-card').last();
  await expect(preview).toContainText('Anita Rao');
  await expect(preview).toContainText('AR');

  // Hide one card of the slider
  await editor.getByRole('checkbox', { name: 'Show in the slider' }).nth(6).uncheck();
  await expect(editor.getByText('Pioneering Minds slider (7, 6 shown)')).toBeVisible();

  await save.click();
  await expect(page.getByText('About Us page saved.')).toBeVisible();

  const visitor = await newVisitorPage(page);
  await visitor.goto('/aboutus');
  await expect(visitor.getByRole('heading', { name: 'Meet Our Team', level: 1 })).toBeVisible();
  const cards = visitor.getByTestId('leader-card');
  await expect(cards).toHaveCount(5);
  const anita = cards.filter({ hasText: 'Anita Rao' });
  await expect(anita).toContainText('Head of Student Success');
  await expect(anita).toContainText('Career Guide');
  await expect(anita.getByRole('link')).toHaveCount(0);
  await expect(cards.filter({ hasText: 'Mr. Gedela Srinivasa Rao' })).toHaveCount(0);

  await expect(visitor.getByTestId('inspiration-card')).toHaveCount(6);
  await expect(visitor.getByTestId('inspiration-card').filter({ hasText: 'Srinivasa Ramanujan' })).toHaveCount(0);

  await visitor.getByRole('button', { name: 'One-by-One' }).click();
  await expect(visitor.getByText('Person 1 of 5')).toBeVisible();

  // Back to the page as it was built, for the other test files
  await restoreBuiltIn(page);
  await visitor.reload();
  await expect(visitor.getByRole('heading', { name: 'Guided by Visionaries, Educators & Industry Leaders' })).toBeVisible();
  await expect(visitor.getByTestId('leader-card')).toHaveCount(5);
  await expect(visitor.getByTestId('leader-card').filter({ hasText: 'Mr. Gedela Srinivasa Rao' })).toHaveCount(1);
  await expect(visitor.getByTestId('inspiration-card')).toHaveCount(7);
});

test('switching between the Home Page and About Us tabs keeps unsaved changes', async ({ page, request }) => {
  const editor = await openAboutEditor(page, request);
  await editor.getByRole('textbox', { name: 'Heading', exact: true }).first().fill('Draft heading');

  await page.getByRole('tab', { name: 'Home Page' }).click();
  await expect(page.getByRole('heading', { name: 'What Our Students Say' })).toBeVisible();
  await page.getByRole('tab', { name: 'About Us' }).click();

  await expect(editor.getByRole('textbox', { name: 'Heading', exact: true }).first()).toHaveValue('Draft heading');
  await expect(editor.getByText('You have unsaved changes.')).toBeVisible();
});
