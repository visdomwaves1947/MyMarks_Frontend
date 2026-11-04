import { test, expect } from '@playwright/test';
import { API_URL, closeVisitorPages, getAdminToken, goToHome, newVisitorPage, openAsAdmin } from './helpers';

test.describe.configure({ mode: 'serial' });

// Later test files expect the built-in menu
test.afterAll(async ({ request }) => {
  const token = await getAdminToken(request);
  await request.delete(`${API_URL}/api/admin/navigation`, { headers: { Authorization: `Bearer ${token}` } });
  await closeVisitorPages();
});

test('the admin edits the top menu and visitors see it', async ({ page, request }) => {
  await openAsAdmin(page, request);
  await page.goto('/admin/navigation');
  await expect(page.getByRole('heading', { name: 'Website Menu' })).toBeVisible();

  const topLinks = page.getByRole('region', { name: 'Top links' });
  await topLinks.getByLabel('Show on the website').nth(1).uncheck();
  await topLinks.getByRole('button', { name: 'Add Link' }).click();
  await topLinks.getByLabel(/^Name/).last().fill('Results');
  await topLinks.getByLabel(/^Address/).last().fill('/demo#results');

  const dropdown = page.getByRole('region', { name: 'Dropdowns' });
  await dropdown.getByLabel(/^Column title/).nth(2).fill('Labs');
  await dropdown.getByRole('button', { name: 'Add Link to Column' }).click();
  await dropdown.getByLabel(/^Link name/).last().fill('Robotics Lab');
  await dropdown.getByLabel(/^Link address/).last().fill('/practicals?subject=robo');

  const preview = page.getByRole('region', { name: 'Menu preview' });
  await expect(preview).toContainText('Robotics Lab');
  await expect(preview).toContainText('Results');

  await page.getByRole('button', { name: 'Save Menu' }).click();
  await expect(page.getByText('Menu saved')).toBeVisible();

  const visitor = await newVisitorPage(page);
  await goToHome(visitor);
  const menu = visitor.locator('header nav');
  await expect(menu.getByRole('link', { name: 'Results' })).toBeVisible();
  await expect(menu.getByRole('link', { name: 'About Us' })).toHaveCount(0);

  await menu.getByRole('button', { name: 'Intermediate' }).hover();
  await expect(menu.getByText('Labs', { exact: true })).toBeVisible();
  await expect(menu.getByRole('link', { name: 'Robotics Lab' })).toBeVisible();
  // Automatic columns still come from the streams
  await expect(menu.getByText('Maths, Physics, Chem')).toBeVisible();
});

test('an unsafe link address is refused', async ({ page, request }) => {
  await openAsAdmin(page, request);
  await page.goto('/admin/navigation');

  const topLinks = page.getByRole('region', { name: 'Top links' });
  await topLinks.getByLabel(/^Address/).first().fill('javascript:alert(1)');
  await page.getByRole('button', { name: 'Save Menu' }).click();
  await expect(page.getByText(/needs an address starting with/)).toBeVisible();
});

test('a fourth column shows in the preview, and on the website once it has a link', async ({ page, request }) => {
  await openAsAdmin(page, request);
  await page.goto('/admin/navigation');

  const dropdown = page.getByRole('region', { name: 'Dropdowns' });
  const preview = page.getByRole('region', { name: 'Menu preview' });
  await dropdown.getByRole('button', { name: 'Add Column' }).click();
  await dropdown.getByLabel(/^Column title/).last().fill('Menu Bars');

  // Empty: shown in the preview with a note, and the editor says what to do
  await expect(preview).toContainText('Menu Bars');
  await expect(preview).toContainText('No links yet');
  await expect(dropdown.getByText('Add at least one link to show this column on the website.')).toBeVisible();

  await dropdown.getByRole('button', { name: 'Add Link to Column' }).last().click();
  await dropdown.getByLabel(/^Link name/).last().fill('Bar One');
  await dropdown.getByLabel(/^Link address/).last().fill('/demo#courses');
  await expect(preview).not.toContainText('No links yet');
  await page.getByRole('button', { name: 'Save Menu' }).click();
  await expect(page.getByText('Menu saved')).toBeVisible();

  const visitor = await newVisitorPage(page);
  await goToHome(visitor);
  const menu = visitor.locator('header nav');
  await menu.getByRole('button', { name: 'Intermediate' }).hover();
  await expect(menu.getByText('Menu Bars', { exact: true })).toBeVisible();
  await expect(menu.getByRole('link', { name: 'Bar One' })).toBeVisible();

  // Four columns still fit on the screen
  const box = await menu.getByText('Menu Bars', { exact: true }).boundingBox();
  const width = visitor.viewportSize().width;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(width);
});

test('a second dropdown gets its own columns', async ({ page, request }) => {
  await openAsAdmin(page, request);
  await page.goto('/admin/navigation');

  const topLinks = page.getByRole('region', { name: 'Top links' });
  await topLinks.getByRole('button', { name: 'Add Link' }).click();
  await topLinks.getByLabel(/^Name/).last().fill('Degree');
  await topLinks.getByLabel(/^Address/).last().fill('/demo#degree');
  await topLinks.getByLabel('Opens a dropdown').last().check();

  // The new dropdown is picked for editing, and starts empty
  const dropdowns = page.getByRole('region', { name: 'Dropdowns' });
  await expect(dropdowns.getByRole('button', { name: 'Degree', pressed: true })).toBeVisible();
  await expect(dropdowns.getByLabel(/^Column title/)).toHaveCount(0);

  await dropdowns.getByLabel(/^Footer text/).fill('Degree Courses');
  await dropdowns.getByRole('button', { name: 'Add Column' }).click();
  await dropdowns.getByLabel(/^Column title/).fill('B.Sc Groups');
  await dropdowns.getByRole('button', { name: 'Add Link to Column' }).click();
  await dropdowns.getByLabel(/^Link name/).fill('B.Sc MPCs');
  await dropdowns.getByLabel(/^Link address/).fill('/demo#courses');

  const preview = page.getByRole('region', { name: 'Menu preview' });
  await expect(preview).toContainText('B.Sc MPCs');
  await expect(preview).not.toContainText('Robotics Lab');

  // Switching back shows the Intermediate columns, untouched
  await dropdowns.getByRole('button', { name: 'Intermediate' }).click();
  await expect(dropdowns.getByLabel(/^Column title/).nth(2)).toHaveValue('Labs');
  await expect(preview).toContainText('Robotics Lab');

  await page.getByRole('button', { name: 'Save Menu' }).click();
  await expect(page.getByText('Menu saved')).toBeVisible();

  const visitor = await newVisitorPage(page);
  await goToHome(visitor);
  const menu = visitor.locator('header nav');
  await menu.getByRole('button', { name: 'Degree' }).hover();
  await expect(menu.getByRole('link', { name: 'B.Sc MPCs' })).toBeVisible();
  await expect(menu.getByText('Degree Courses')).toBeVisible();
  await expect(menu.getByRole('link', { name: 'Robotics Lab' })).toHaveCount(0);

  await menu.getByRole('button', { name: 'Intermediate' }).hover();
  await expect(menu.getByRole('link', { name: 'Robotics Lab' })).toBeVisible();
  await expect(menu.getByRole('link', { name: 'B.Sc MPCs' })).toHaveCount(0);
});

test('reset brings back the built-in menu', async ({ page, request }) => {
  await openAsAdmin(page, request);
  await page.goto('/admin/navigation');
  await page.getByRole('button', { name: 'Reset to Built-in' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Reset Menu' }).click();
  await expect(page.getByText('The built-in menu is back')).toBeVisible();

  const visitor = await newVisitorPage(page);
  await goToHome(visitor);
  const menu = visitor.locator('header nav');
  await expect(menu.getByRole('link', { name: 'About Us' })).toBeVisible();
  await expect(menu.getByRole('link', { name: 'Results' })).toHaveCount(0);
});
