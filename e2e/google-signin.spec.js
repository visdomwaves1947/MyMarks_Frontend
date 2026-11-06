import { test, expect } from '@playwright/test';
import { API_URL, openAsVisitor } from './helpers';

// The tests cannot reach Google, so Google's button script is replaced in the test browser
// with a stand-in that hands the page a test credential. The test API server accepts only
// these "e2e-google:" credentials (MyMarks_Backend/scripts/e2eServer.js).
const FAKE_GOOGLE_SCRIPT = `
  window.google = { accounts: { id: {
    initialize(options) { window.__googleCallback = options.callback; },
    renderButton(holder, options) {
      holder.innerHTML = '';
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = options.text === 'signup_with' ? 'Sign up with Google' : 'Sign in with Google';
      button.onclick = () => window.__googleCallback({ credential: window.__nextGoogleCredential });
      holder.appendChild(button);
    },
  } } };
`;

const GOOGLE_STUDENT = {
  googleId: 'g-e2e-student',
  email: 'google.student@gmail.test',
  fullName: 'Google Student',
  avatarUrl: '',
};

const credentialFor = (account) => `e2e-google:${Buffer.from(JSON.stringify(account)).toString('base64')}`;

const useFakeGoogle = async (page) => {
  await openAsVisitor(page);
  await page.route('https://accounts.google.com/gsi/client', (route) =>
    route.fulfill({ contentType: 'application/javascript', body: FAKE_GOOGLE_SCRIPT })
  );
};

const clickGoogle = async (page, name, credential) => {
  await page.evaluate((value) => {
    window.__nextGoogleCredential = value;
  }, credential);
  await page.getByRole('button', { name }).click();
};

const signedInEmail = (page) =>
  page.evaluate(() => JSON.parse(localStorage.getItem('mla_user') || '{}').email || '');

test('a new student signs up with Google, fills in the rest of the form, and is signed in without a password', async ({ page, request }) => {
  await useFakeGoogle(page);
  await page.goto('/signup');
  // Google sits under the sign-up form
  const nextButton = await page.getByRole('button', { name: 'Next Step' }).boundingBox();
  const googleButton = await page.getByRole('button', { name: 'Sign up with Google' }).boundingBox();
  expect(googleButton.y).toBeGreaterThan(nextButton.y);
  await clickGoogle(page, 'Sign up with Google', credentialFor(GOOGLE_STUDENT));

  // Google's name and verified email are filled in, and no password is asked for
  await expect(page.getByTestId('google-signup-note')).toContainText('google.student@gmail.test');
  await expect(page.getByPlaceholder('Student full name')).toHaveValue('Google Student');
  const email = page.getByPlaceholder('student@example.com');
  await expect(email).toHaveValue('google.student@gmail.test');
  await expect(email).toHaveAttribute('readonly', '');
  await expect(page.getByPlaceholder('Create password')).toHaveCount(0);

  await page.getByPlaceholder('10-digit phone').fill('9876500011');
  await page.locator('input[type="date"]').fill('2008-05-10');
  await page.getByPlaceholder('Full name', { exact: true }).fill('Parent Name');
  await page.getByPlaceholder('10-digit mobile', { exact: true }).fill('9876500012');
  await page.getByRole('button', { name: 'Next Step' }).click();
  await page.getByRole('button', { name: 'Next Step' }).click();
  await page.getByPlaceholder('e.g. Sri Chaitanya Junior College, Vijayawada').fill('Test Junior College, Vijayawada');
  await page.getByRole('button', { name: 'Next Step' }).click();
  await page.locator('input[type="checkbox"]').check();
  await page.getByRole('button', { name: /Complete Registration/ }).click();

  // Signed in at once, and taken to the home page
  await expect(page).toHaveURL(/\/demo/);
  await expect.poll(() => signedInEmail(page)).toBe('google.student@gmail.test');

  // The account has no password, so the password sign-in cannot open it
  const withPassword = await request.post(`${API_URL}/api/auth/login`, {
    data: { signInInput: 'google.student@gmail.test', signInPassword: 'any-password' },
  });
  expect(withPassword.status()).toBe(401);
});

test('the same student signs in with Google next time, straight away', async ({ page }) => {
  await useFakeGoogle(page);
  await page.goto('/signin');
  // Google sits under the password form
  const passwordButton = await page.getByRole('button', { name: /Continue with password/i }).boundingBox();
  const googleButton = await page.getByRole('button', { name: 'Sign in with Google' }).boundingBox();
  expect(googleButton.y).toBeGreaterThan(passwordButton.y);
  await clickGoogle(page, 'Sign in with Google', credentialFor(GOOGLE_STUDENT));

  await expect(page).toHaveURL(/\/demo/);
  await expect.poll(() => signedInEmail(page)).toBe('google.student@gmail.test');
});

test('a Google sign-in that cannot be checked shows a message and signs no one in', async ({ page }) => {
  await useFakeGoogle(page);
  await page.goto('/signin');
  await clickGoogle(page, 'Sign in with Google', 'not-a-google-credential');

  await expect(page.getByRole('alert').filter({ hasText: 'This Google sign-in could not be checked.' })).toBeVisible();
  await expect(page).toHaveURL(/\/signin/);
  expect(await signedInEmail(page)).toBe('');
});

test('leaving a Google sign-up brings back the email and password fields', async ({ page }) => {
  await useFakeGoogle(page);
  await page.goto('/signup');
  await clickGoogle(page, 'Sign up with Google', credentialFor({ ...GOOGLE_STUDENT, googleId: 'g-e2e-other', email: 'other.student@gmail.test' }));
  await expect(page.getByTestId('google-signup-note')).toBeVisible();

  await page.getByRole('button', { name: 'Use another way' }).click();
  await expect(page.getByTestId('google-signup-note')).toHaveCount(0);
  await expect(page.getByPlaceholder('student@example.com')).toHaveValue('');
  await expect(page.getByPlaceholder('Create password')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign up with Google' })).toBeVisible();
});
