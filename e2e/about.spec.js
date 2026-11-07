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

// Sections and their cards start closed, and open when clicked
const openSection = async (editor, testId, title) => {
  const section = editor.getByTestId(testId);
  const header = section.getByRole('button', { name: new RegExp(`^${title}`) });
  await header.click();
  return { section, header };
};
const openItem = (section, number, name) =>
  section.getByRole('button', { name: new RegExp(`^${number}\\. ${name}`) }).click();

const restoreBuiltIn = async (page) => {
  await page.getByRole('button', { name: 'Use Built-in Page' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Use Built-in Page' }).click();
  await expect(page.getByText('The built-in About Us page is back on the website.')).toBeVisible();
};

test('an admin changes the About Us cards in Website Pages, and visitors see them', async ({ page, request }) => {
  const editor = await openAboutEditor(page, request);
  await expect(editor.getByText('Showing the built-in page until you save.')).toBeVisible();
  // Every section starts closed
  await expect(editor.getByRole('textbox')).toHaveCount(0);

  const hero = await openSection(editor, 'about-hero', 'Top of the page');
  await hero.section.getByRole('textbox', { name: 'Heading', exact: true }).fill('Meet Our Team');

  // Hide the last leader, and add a new one with no photo and no link
  const leaders = await openSection(editor, 'about-leaders', 'Leader cards');
  await expect(leaders.header).toContainText('5 leaders, 5 shown');
  await openItem(leaders.section, 5, 'Mr\\. Gedela');
  await leaders.section.getByRole('checkbox', { name: 'Show on the About Us page' }).last().uncheck();
  await leaders.section.getByRole('button', { name: 'Add Leader' }).click();
  const save = editor.getByRole('button', { name: 'Save About Us' }).first();
  await expect(editor.getByTestId('about-problems')).toContainText('Leader 6 needs a name.');
  await expect(leaders.header).toContainText('2 problems');
  await expect(save).toBeDisabled();

  await leaders.section.getByRole('textbox', { name: 'Name *', exact: true }).last().fill('Anita Rao');
  await leaders.section.getByRole('textbox', { name: 'Role *', exact: true }).last().fill('Head of Student Success');
  await leaders.section.getByRole('textbox', { name: 'Tagline', exact: true }).last().fill('Every student gets a plan.');
  await leaders.section.getByRole('textbox', { name: 'Strategic impact points', exact: true }).last().fill('Guided 500 students');
  await leaders.section.getByRole('textbox', { name: 'Tags', exact: true }).last().fill('Mentor\n\nCareer Guide');

  const link = leaders.section.getByRole('textbox', { name: 'Read more link', exact: true }).last();
  await link.fill('ftp://files.example.com');
  await expect(editor.getByTestId('about-problems')).toContainText('The Read more link of Anita Rao must start with https://');
  await link.fill('');
  await expect(editor.getByTestId('about-problems')).toHaveCount(0);

  await editor.getByText('Preview this card').last().click();
  const preview = editor.getByTestId('leader-card').last();
  await expect(preview).toContainText('Anita Rao');
  await expect(preview).toContainText('AR');

  // Hide one card of the slider
  const slider = await openSection(editor, 'about-inspirations', 'Pioneering Minds slider');
  await openItem(slider.section, 7, 'Srinivasa Ramanujan');
  await slider.section.getByRole('checkbox', { name: 'Show in the slider' }).uncheck();
  await expect(slider.header).toContainText('7 cards, 6 shown');

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
  const hero = await openSection(editor, 'about-hero', 'Top of the page');
  await hero.section.getByRole('textbox', { name: 'Heading', exact: true }).fill('Draft heading');

  await page.getByRole('tab', { name: 'Home Page' }).click();
  await expect(page.getByRole('tabpanel', { name: 'Home Page' }).getByRole('heading', { name: 'Home Page' })).toBeVisible();
  await page.getByRole('tab', { name: 'About Us' }).click();

  await expect(hero.section.getByRole('textbox', { name: 'Heading', exact: true })).toHaveValue('Draft heading');
  await expect(editor.getByText('You have unsaved changes.')).toBeVisible();
});
