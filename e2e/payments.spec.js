import crypto from 'node:crypto';
import { test, expect } from '@playwright/test';
import {
  API_URL,
  closeVisitorPages,
  getAdminToken,
  newVisitorPage,
  openAsAdmin,
  openAsStudent,
  signInStudent,
} from './helpers';

// The test server's Razorpay key secret (scripts/e2eServer.js). Real Razorpay is never reached.
const RAZORPAY_TEST_SECRET = 'e2e-razorpay-secret';
const YOUTUBE_ID = 'aqz-KE-bpKQ';

// Stands in for Razorpay's checkout window. window.__razorpayMode picks what the "student" does.
const FAKE_CHECKOUT = `
window.Razorpay = function (options) { this.options = options; this.handlers = {}; };
window.Razorpay.prototype.on = function (name, handler) { this.handlers[name] = handler; };
window.Razorpay.prototype.open = function () {
  var options = this.options;
  var handlers = this.handlers;
  window.__razorpayOptions = options;
  if (window.__razorpayMode === 'fail') {
    handlers['payment.failed']({ error: { description: 'Your bank declined this payment.' } });
    setTimeout(function () { options.modal.ondismiss(); }, 50);
    return;
  }
  window.signRazorpay(options.order_id, 'pay_e2e_1').then(function (signature) {
    options.handler({ razorpay_order_id: options.order_id, razorpay_payment_id: 'pay_e2e_1', razorpay_signature: signature });
  });
};`;

// Stands in for YouTube's player API, so a test can set how far the video got
const FAKE_YOUTUBE_API = `
window.YT = {
  Player: function (element, options) {
    window.__yt = { element: element, options: options, time: 0, state: 1, duration: 600 };
    this.getCurrentTime = function () { return window.__yt.time; };
    this.getDuration = function () { return window.__yt.duration; };
    this.getPlayerState = function () { return window.__yt.state; };
  },
};
if (window.onYouTubeIframeAPIReady) window.onYouTubeIframeAPIReady();`;

const headersFor = async (request) => ({ Authorization: `Bearer ${await getAdminToken(request)}` });

// Courses made here are archived afterwards, so the other tests still see the 18 subjects
const madeCourses = [];

// A published course of its own for each test and screen size, sold online, with one YouTube lesson
const addCourseForSale = async (request, testInfo) => {
  const headers = await headersFor(request);
  const name = `Sale ${testInfo.project.name} ${Date.now()}`;
  const created = await request.post(`${API_URL}/api/admin/courses`, {
    headers,
    data: {
      name,
      subject: name,
      shortDescription: 'A course sold online.',
      thumbnail: 'https://images.example.com/sale.jpg',
      price: 299,
      oldPrice: 999,
      sellOnline: true,
    },
  });
  expect(created.ok(), await created.text()).toBeTruthy();
  const course = (await created.json()).course;
  madeCourses.push(course._id);

  const syllabus = await request.put(`${API_URL}/api/admin/courses/${course._id}/curriculum`, {
    headers,
    data: {
      chapters: [
        {
          number: '1',
          name: 'Motion',
          topics: [{ code: '1.1', title: 'Kinematics', youtubeUrl: `https://www.youtube.com/watch?v=${YOUTUBE_ID}` }],
        },
      ],
    },
  });
  expect(syllabus.ok(), await syllabus.text()).toBeTruthy();
  const published = await request.patch(`${API_URL}/api/admin/courses/${course._id}/status`, { headers, data: { status: 'published' } });
  expect(published.ok(), await published.text()).toBeTruthy();
  return { ...course, name };
};

const fakeRazorpayAndYouTube = async (page) => {
  await page.route('https://checkout.razorpay.com/v1/checkout.js', (route) =>
    route.fulfill({ contentType: 'application/javascript', body: FAKE_CHECKOUT })
  );
  await page.route('https://www.youtube.com/iframe_api', (route) =>
    route.fulfill({ contentType: 'application/javascript', body: FAKE_YOUTUBE_API })
  );
  await page.route('https://www.youtube-nocookie.com/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<html><body style="background:#000"></body></html>' })
  );
  await page.exposeFunction('signRazorpay', (orderId, paymentId) =>
    crypto.createHmac('sha256', RAZORPAY_TEST_SECRET).update(`${orderId}|${paymentId}`).digest('hex')
  );
};

const lessonCard = (page) => page.getByTestId('course-topic').filter({ hasText: 'Kinematics' });

test.afterEach(async ({ request }) => {
  await closeVisitorPages();
  const headers = await headersFor(request);
  for (const id of madeCourses.splice(0)) {
    await request.patch(`${API_URL}/api/admin/courses/${id}/status`, { headers, data: { status: 'archived' } });
  }
});

test('a visitor sees a course for sale with every lesson locked, and is asked to sign in before buying', async ({ page, request }, testInfo) => {
  const course = await addCourseForSale(request, testInfo);
  const visitor = await newVisitorPage(page);
  await visitor.goto(`/courses/${course.slug}`);

  await expect(visitor.getByTestId('course-buy-strip')).toContainText(`Every lesson opens once you buy ${course.name}.`);
  await expect(visitor.getByTestId('course-buy-strip')).toContainText('₹299');
  await expect(lessonCard(visitor).getByRole('button', { name: 'Buy to Watch' })).toBeVisible();
  // Nothing on the page leads to the video itself
  expect(await visitor.content()).not.toContain(YOUTUBE_ID);

  await lessonCard(visitor).getByRole('button', { name: 'Buy to Watch' }).click();
  const prompt = visitor.getByRole('dialog', { name: 'Sign in required' });
  await expect(prompt).toContainText('Sign in first, then buy');
  await prompt.getByRole('button', { name: 'Sign In' }).click();
  await expect(visitor.getByText('SECURE LOGIN PORTAL', { exact: true }).first()).toBeVisible();
});

test('a student buys a course with Razorpay, and every lesson opens', async ({ page, request }, testInfo) => {
  const course = await addCourseForSale(request, testInfo);
  await openAsStudent(page, request);
  await fakeRazorpayAndYouTube(page);
  await page.goto(`/courses/${course.slug}`);

  // A failed attempt changes nothing
  await page.evaluate(() => {
    window.__razorpayMode = 'fail';
  });
  await page.getByTestId('course-buy-strip').getByRole('button', { name: 'Buy Now' }).click();
  const failed = page.getByRole('alertdialog').filter({ hasText: 'The payment did not go through' });
  await expect(failed).toContainText('Your bank declined this payment. No money was taken.');
  await failed.getByRole('button', { name: 'OK' }).click();
  await expect(lessonCard(page).getByRole('button', { name: 'Buy to Watch' })).toBeVisible();

  // The locked lesson offers the purchase too
  await page.evaluate(() => {
    window.__razorpayMode = 'pay';
  });
  await lessonCard(page).getByRole('button', { name: 'Buy to Watch' }).click();
  const prompt = page.getByRole('dialog', { name: 'Buy this course' });
  await prompt.getByRole('button', { name: 'Buy for ₹299' }).click();

  const done = page.getByRole('alertdialog').filter({ hasText: `You have ${course.name}` });
  await expect(done).toContainText('Payment received. Every lesson is open now.');
  const sent = await page.evaluate(() => window.__razorpayOptions);
  expect(sent.key).toBe('rzp_test_e2e_key');
  expect(sent.amount).toBe(29900);
  expect(sent.currency).toBe('INR');
  expect(sent.prefill.email).toBe(process.env.E2E_STUDENT_EMAIL);
  await done.getByRole('button', { name: 'Start Learning' }).click();

  await expect(page.getByTestId('course-owned')).toContainText('You have this course');
  await expect(page.getByTestId('course-buy-strip')).toHaveCount(0);
  await lessonCard(page).getByRole('button', { name: /Watch Lecture/ }).click();
  await expect(page.getByTestId('lesson-player').locator('iframe')).toHaveAttribute('src', new RegExp(`youtube-nocookie\\.com/embed/${YOUTUBE_ID}`));
});

test('a lesson resumes where the student stopped, and the admin sees the course and the stop', async ({ page, request }, testInfo) => {
  const course = await addCourseForSale(request, testInfo);
  const student = await signInStudent(request);
  const studentId = (student.user || student)._id;
  const headers = await headersFor(request);
  const given = await request.post(`${API_URL}/api/admin/users/${studentId}/purchases`, {
    headers,
    data: { courseId: course._id, note: 'Paid by UPI' },
  });
  expect(given.ok(), await given.text()).toBeTruthy();

  await openAsStudent(page, request);
  await fakeRazorpayAndYouTube(page);
  await page.goto(`/courses/${course.slug}`);
  await lessonCard(page).getByRole('button', { name: /Watch Lecture/ }).click();
  const player = page.getByTestId('lesson-player');
  await expect(player.locator('iframe')).toHaveAttribute('src', /enablejsapi=1/);
  await expect(player.locator('iframe')).not.toHaveAttribute('src', /start=/);

  // The student pauses at 2:05 of 10:00
  await page.waitForFunction(() => Boolean(window.__yt));
  const saved = page.waitForResponse((res) => res.url().includes('/api/progress/') && res.request().method() === 'PUT');
  await page.evaluate(() => {
    window.__yt.time = 125;
    window.__yt.state = 2;
    window.__yt.options.events.onStateChange({ data: 2 });
  });
  expect((await saved).ok()).toBeTruthy();

  await player.getByRole('button', { name: 'Close lecture' }).click();
  await expect(page.getByTestId('course-continue')).toContainText('Kinematics');
  await expect(page.getByTestId('course-continue')).toContainText('at 2:05');
  await expect(lessonCard(page).getByTestId('lesson-watched')).toBeVisible();
  await expect(lessonCard(page).getByRole('button', { name: /Continue/ })).toBeVisible();

  // Coming back later starts the video at the same place
  await page.reload();
  await page.getByTestId('course-continue').getByRole('button', { name: 'Continue' }).click();
  await expect(player.locator('iframe')).toHaveAttribute('src', /start=125/);
  await expect(player.getByTestId('lesson-resumed')).toHaveText('Resumed at 2:05');
  await player.getByRole('button', { name: 'Close lecture' }).click();

  // The admin sees the course and where the student stopped, and can take the course away
  const admin = await newVisitorPage(page);
  await openAsAdmin(admin, request);
  await admin.goto('/admin/students');
  await admin.getByPlaceholder(/Search student/).fill(process.env.E2E_STUDENT_EMAIL);
  await admin.getByTitle('View Full Profile Details').first().click();
  const details = admin.getByRole('dialog', { name: 'Student details' });
  const owned = details.getByTestId('student-course').filter({ hasText: course.name });
  await expect(owned).toContainText('Given by admin');
  await expect(owned).toContainText('Paid by UPI');
  const watching = details.getByTestId('student-watching').filter({ hasText: course.name });
  await watching.getByRole('button').first().click();
  await expect(watching).toContainText('1.1: Kinematics');
  await expect(watching).toContainText('Stopped at 2:05 of 10:00');

  await owned.getByRole('button', { name: 'Remove' }).click();
  await admin.getByRole('alertdialog').filter({ hasText: `Remove ${course.name}?` }).getByRole('button', { name: 'Remove' }).click();
  await expect(details.getByTestId('student-course').filter({ hasText: course.name })).toContainText('Removed');

  // Gone for the student too
  await page.reload();
  await expect(page.getByTestId('course-buy-strip')).toBeVisible();
});

test('an admin gives a course from the student details, and the course list marks courses sold online', async ({ page, request }, testInfo) => {
  const course = await addCourseForSale(request, testInfo);
  await openAsAdmin(page, request);
  await page.goto('/admin/students');
  await page.getByPlaceholder(/Search student/).fill(process.env.E2E_STUDENT_EMAIL);
  await page.getByTitle('View Full Profile Details').first().click();
  const details = page.getByRole('dialog', { name: 'Student details' });

  await details.getByLabel('Course to give').selectOption({ label: course.name });
  await details.getByLabel('Note').fill('Paid in cash');
  await details.getByRole('button', { name: 'Give Course' }).click();
  await expect(details).toContainText(`${course.name} given to E2E Student.`);
  const row = details.getByTestId('student-course').filter({ hasText: course.name });
  await expect(row).toContainText('Given by admin');
  await expect(row).toContainText('Paid in cash');
  await expect(details.getByLabel('Course to give').locator('option', { hasText: `${course.name} (has it)` })).toBeDisabled();

  // Opened by its address: on phones the admin menu sits behind a button
  await page.goto('/admin/courses');
  await expect(page.getByRole('button', { name: 'Add Course' })).toBeVisible();
  await expect(page.getByText(course.name, { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/• Sold online/).first()).toBeVisible();
});
