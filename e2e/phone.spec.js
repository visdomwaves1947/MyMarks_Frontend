import { test, expect } from '@playwright/test';
import { API_URL, getAdminToken, openAsAdmin, openAsVisitor } from './helpers';

test.describe.configure({ mode: 'serial' });

// One student from the United Arab Emirates for each screen size
const stamp = `${Date.now()}`.slice(-6);
const student = (testInfo) => ({
  email: `gulf.${testInfo.project.name}.${stamp}@mymarks.test`,
  local: `50${stamp}${testInfo.project.name === 'phone' ? '1' : '2'}`,
  // Sign-up asks for 8+ characters with an upper and lower case letter, a number and a symbol
  password: `Gulf-Pass-${stamp}`,
});

const pickCountry = async (page, field, search, name) => {
  await field.getByTestId('phone-country').click();
  const list = page.getByTestId('phone-country-list');
  await list.getByLabel('Search country or code').fill(search);
  await list.getByRole('option', { name: new RegExp(name) }).first().click();
  await expect(list).toHaveCount(0);
};

test('a phone number starts in India, and the list finds any country by name or code', async ({ page }) => {
  await openAsVisitor(page);
  await page.goto('/signup');
  const field = page.getByTestId('phone-field').first();
  await expect(field.getByTestId('phone-country')).toHaveAccessibleName('Country code: India +91');
  await expect(field.getByTestId('phone-dial')).toHaveText('+91');

  // India comes first, then every country by name
  await field.getByTestId('phone-country').click();
  const list = page.getByTestId('phone-country-list');
  const options = list.getByRole('option');
  await expect(options.first()).toContainText('India');
  await expect(options.first()).toHaveAttribute('aria-selected', 'true');
  expect(await options.count()).toBeGreaterThan(200);

  // By name, by another name, and by code
  await list.getByLabel('Search country or code').fill('emirates');
  await expect(options.first()).toContainText('United Arab Emirates');
  await expect(options.first()).toContainText('+971');
  await list.getByLabel('Search country or code').fill('UK');
  await expect(options.first()).toContainText('United Kingdom');
  await list.getByLabel('Search country or code').fill('+65');
  await expect(options.first()).toContainText('Singapore');

  // Keys: down and Enter choose; Escape closes without changing
  await list.getByLabel('Search country or code').fill('nepal');
  await page.keyboard.press('Enter');
  await expect(field.getByTestId('phone-dial')).toHaveText('+977');
  await field.getByTestId('phone-country').click();
  await page.keyboard.press('Escape');
  await expect(list).toHaveCount(0);
  await expect(field.getByTestId('phone-dial')).toHaveText('+977');

  // A number pasted with its code picks the country
  await field.getByRole('textbox', { name: 'Mobile Number' }).fill('+44 7700 900123');
  await expect(field.getByTestId('phone-dial')).toHaveText('+44');
  await expect(field.getByRole('textbox', { name: 'Mobile Number' })).toHaveValue('7700900123');
});

test('a student from another country signs up with their number and signs in with it', async ({ page }, testInfo) => {
  const me = student(testInfo);
  await openAsVisitor(page);
  await page.goto('/signup');

  await page.getByPlaceholder('Student full name').fill('Gulf Student');
  const mobile = page.getByTestId('phone-field').first();
  await pickCountry(page, mobile, 'emirates', 'United Arab Emirates');
  await mobile.getByRole('textbox', { name: 'Mobile Number' }).fill(me.local);
  await page.getByPlaceholder('student@example.com').fill(me.email);
  await page.locator('input[type="date"]').first().fill('2008-05-14');
  await page.getByPlaceholder('Full name', { exact: true }).fill('Gulf Parent');
  // The parent's number stays in India unless changed; a short one is refused
  await page.getByPlaceholder('10-digit mobile', { exact: true }).fill('98765');
  await page.getByPlaceholder('Create password').fill(me.password);
  await page.getByPlaceholder('Re-enter password').fill(me.password);
  await page.getByRole('button', { name: 'Next Step' }).click();
  await expect(page.getByText('Enter a valid 10-digit mobile number')).toBeVisible();
  await page.getByPlaceholder('10-digit mobile', { exact: true }).fill('9876500011');
  await page.getByRole('button', { name: 'Next Step' }).click();

  await page.getByText('Andhra Pradesh Intermediate', { exact: true }).click();
  await page.getByRole('button', { name: 'Next Step' }).click();
  await page.getByText('First Year', { exact: true }).first().click();
  await page.getByPlaceholder('e.g. Sri Chaitanya Junior College, Vijayawada').fill('Gulf Indian School, Dubai');
  await page.getByPlaceholder('June, 2025').fill('June, 2025');
  await page.getByRole('button', { name: 'Next Step' }).click();

  // The summary shows the number with its code
  await expect(page.getByText(`+971 ${me.local}`)).toBeVisible();
  await expect(page.getByText('(+91 98765 00011)')).toBeVisible();
  await page.locator('input[type="checkbox"]').last().check();
  await page.getByRole('button', { name: /Complete Registration/ }).click();
  await expect(page.getByText(/Registration successful/)).toBeVisible();

  // Saved with its code: +971 and the number; the parent's stays 10 digits
  const token = await getAdminToken(page.request);
  const users = (await (await page.request.get(`${API_URL}/api/admin/users?search=${encodeURIComponent(me.email)}`, { headers: { Authorization: `Bearer ${token}` } })).json()).users;
  const saved = users.find((user) => user.email === me.email);
  expect(saved.mobileNumber).toBe(`+971${me.local}`);

  // Signs in with the number typed with its code and spaces
  await page.getByPlaceholder('Enter 10-digit mobile or email address').fill(`+971 ${me.local.slice(0, 2)} ${me.local.slice(2)}`);
  await page.getByPlaceholder('Enter password (min 6 characters)').fill(me.password);
  await page.getByRole('button', { name: /continue with password/i }).click();
  await expect(page.getByTestId('auth-welcome')).toContainText('Welcome');
  await expect(page.getByRole('button', { name: 'Account menu' })).toBeVisible();

  // The profile shows it as people read it; the enrollment form fills it in with its country
  await page.goto('/profile');
  await expect(page.getByText(`+971 ${me.local}`).filter({ visible: true }).first()).toBeVisible();
  await expect(page.getByText('+91 98765 00011').filter({ visible: true }).first()).toBeVisible();
});

test('the contact form starts in India and keeps its 10-digit check there', async ({ page }) => {
  await openAsVisitor(page);
  await page.goto('/contact');
  const field = page.getByTestId('phone-field');
  await expect(field.getByTestId('phone-dial')).toHaveText('+91');
  await page.getByPlaceholder('Enter your full name').fill('Contact Parent');
  await page.getByPlaceholder('name@example.com').fill('contact.parent@mymarks.test');
  await page.getByPlaceholder('10-digit mobile number').fill('5123456789');
  await page.getByPlaceholder('Write your message here...').fill('Please call me about the Physics course.');
  await page.locator('form').getByRole('button').last().click();
  await expect(page.getByText('Please enter a valid 10-digit mobile number (e.g. 9876543210).')).toBeVisible();

  await page.getByPlaceholder('10-digit mobile number').fill('9123456789');
  await page.locator('form').getByRole('button').last().click();
  await expect(page.getByText(/sent successfully/)).toBeVisible();
});

test('the admin adds a student with a number from another country', async ({ page, request }, testInfo) => {
  test.skip(testInfo.project.name === 'phone', 'The admin panel is used on a laptop');
  const email = `gulf.admin.${stamp}@mymarks.test`;
  await openAsAdmin(page, request);
  await page.goto('/admin/students');
  await page.getByRole('button', { name: 'Add Student' }).click();
  await page.getByPlaceholder('e.g. Varun Bhargav').fill('Gulf Added Student');
  await page.getByPlaceholder('student@example.com').fill(email);
  const field = page.getByTestId('phone-field');
  await expect(field.getByTestId('phone-dial')).toHaveText('+91');
  await pickCountry(page, field, 'oman', 'Oman');
  await field.getByRole('textbox', { name: 'Mobile Number' }).fill('91234567');
  await page.locator('input[type="password"]').last().fill(`gulf-admin-${stamp}`);
  await page.getByRole('button', { name: 'Register Student' }).click();

  await page.getByPlaceholder(/Search student/).fill(email);
  await expect(page.getByText('+968 91234567').first()).toBeVisible();

  // Tidy up
  await page.getByTitle('Delete Student').first().click();
  const confirm = page.getByRole('alertdialog');
  if (await confirm.isVisible().catch(() => false)) await confirm.getByRole('button', { name: /Delete/ }).last().click();
  await expect(page.getByText(email)).toHaveCount(0);
});
