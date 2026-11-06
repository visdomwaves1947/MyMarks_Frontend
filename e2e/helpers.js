import { expect } from '@playwright/test';

export const API_URL = 'http://localhost:5050';

const ACCESS = { key: 'site_privacy_access', value: 'granted' };

let adminToken = null;
const visitorContexts = [];

export async function getAdminToken(request) {
  if (!adminToken) {
    const res = await request.post(`${API_URL}/api/admin/login`, {
      data: { email: process.env.E2E_ADMIN_EMAIL, password: process.env.E2E_ADMIN_PASSWORD },
    });
    expect(res.ok()).toBeTruthy();
    adminToken = (await res.json()).token;
  }
  return adminToken;
}

// Opens the site past the private preview lock, as a visitor
export async function openAsVisitor(page) {
  await page.addInitScript(({ key, value }) => {
    localStorage.setItem(key, value);
  }, ACCESS);
}

// A separate browser, because pages in one context share their saved sign-in
export async function newVisitorPage(page) {
  const context = await page.context().browser().newContext();
  visitorContexts.push(context);
  const visitor = await context.newPage();
  await openAsVisitor(visitor);
  return visitor;
}

export async function closeVisitorPages() {
  await Promise.all(visitorContexts.splice(0).map((context) => context.close()));
}

export async function openAsAdmin(page, request) {
  const token = await getAdminToken(request);
  await page.addInitScript(
    ({ key, value, adminToken: savedToken }) => {
      localStorage.setItem(key, value);
      localStorage.setItem('mymarks_admin_auth', 'true');
      localStorage.setItem('mymarks_admin_token', savedToken);
      localStorage.setItem(
        'mla_user',
        JSON.stringify({ fullName: 'MyMarks Administrator', role: 'admin', token: savedToken })
      );
    },
    { ...ACCESS, adminToken: token }
  );
}

// The API allows one account 10 sign-ins every 15 minutes, so each test worker signs the student in once
let studentLogin = null;

export async function signInStudent(request) {
  if (!studentLogin) {
    const res = await request.post(`${API_URL}/api/auth/login`, {
      data: { signInInput: process.env.E2E_STUDENT_EMAIL, signInPassword: process.env.E2E_STUDENT_PASSWORD },
    });
    expect(res.ok()).toBeTruthy();
    studentLogin = await res.json();
  }
  return studentLogin;
}

export async function openAsStudent(page, request) {
  const user = await signInStudent(request);

  await page.addInitScript(
    ({ key, value, student }) => {
      localStorage.setItem(key, value);
      localStorage.setItem('mla_user', JSON.stringify(student));
    },
    // Saved like the site does after signing in: the account details with the token
    { ...ACCESS, student: { ...(user.user || user), token: user.token } }
  );
}

export async function goToCoursesTab(page) {
  await page.goto('/admin');
  await page.getByRole('button', { name: 'Courses & Streams' }).first().click();
  await expect(page.getByRole('button', { name: 'Add Course' })).toBeVisible();
}

export const courseCard = (page, name) =>
  page.getByTestId('course-card').filter({ has: page.getByRole('heading', { name, exact: true }) });

// A real address on the site, so the page need not wait for an old cached list
export async function goToHome(page) {
  await page.goto('/demo#courses');
  await expect(page.getByTestId('course-card').first()).toBeVisible();
  await waitForScrollToStop(page);
}

// The page scrolls smoothly to the courses, and scrolling closes the phone menu
export async function waitForScrollToStop(page) {
  let last = -1;
  await expect(async () => {
    const position = await page.evaluate(() => window.scrollY);
    const stopped = position === last;
    last = position;
    expect(stopped).toBe(true);
  }).toPass({ intervals: [300] });
}

export async function expectNoSideScroll(page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(1);
}
