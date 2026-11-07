import crypto from 'node:crypto';
import { test, expect } from '@playwright/test';
import {
  API_URL,
  closeVisitorPages,
  expectNoSideScroll,
  getAdminToken,
  newVisitorPage,
  openAsAdmin,
  openAsStudent,
  openAsVisitor,
  signInStudent,
} from './helpers';

// The test server's Razorpay key secret (scripts/e2eServer.js). Real Razorpay is never reached.
const RAZORPAY_TEST_SECRET = 'e2e-razorpay-secret';
// One YouTube video per lesson, in page order. The first two lessons are free.
const YOUTUBE_IDS = ['aqz-KE-bpKQ', 'ScMzIvxBSi4', 'LXb3EKWsInQ'];

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

// A published course of its own for each test and screen size, sold online, with three YouTube lessons
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

  const lesson = (code, title, index) => ({ code, title, youtubeUrl: `https://www.youtube.com/watch?v=${YOUTUBE_IDS[index]}` });
  const syllabus = await request.put(`${API_URL}/api/admin/courses/${course._id}/curriculum`, {
    headers,
    data: {
      chapters: [
        {
          number: '1',
          name: 'Motion',
          topics: [lesson('1.1', 'Kinematics', 0), lesson('1.2', 'Projectiles', 1), lesson('1.3', 'Circular Motion', 2)],
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

const lessonCard = (page, title) => page.getByTestId('course-topic').filter({ hasText: title });

// The playing lesson reaches its end, once its own player is the one attached to the video
const endPlayingLesson = async (page) => {
  await page.waitForFunction(
    () => window.__yt && window.__yt.element === document.querySelector('[data-testid="lesson-player"] iframe')
  );
  await page.evaluate(() => {
    window.__yt.time = window.__yt.duration;
    window.__yt.state = 0;
    window.__yt.options.events.onStateChange({ data: 1 });
    window.__yt.options.events.onStateChange({ data: 0 });
  });
  // The Up next card slides in; a click during that first moment can be lost, as with a real tap
  await expect(page.getByTestId('up-next')).toHaveAttribute('data-state', 'shown');
  await page.waitForTimeout(350);
};

// The student pauses the playing lesson at a time, or plays it to the end
const watchUntil = async (page, seconds, { ended = false } = {}) => {
  await page.waitForFunction(() => Boolean(window.__yt));
  const saved = page.waitForResponse((res) => res.url().includes('/api/progress/') && res.request().method() === 'PUT');
  await page.evaluate(
    ({ time, end }) => {
      window.__yt.time = time;
      window.__yt.state = end ? 0 : 2;
      window.__yt.options.events.onStateChange({ data: 1 });
      window.__yt.options.events.onStateChange({ data: end ? 0 : 2 });
    },
    { time: seconds, end: ended }
  );
  expect((await saved).ok()).toBeTruthy();
};

const giveCourse = async (request, courseId, note) => {
  const student = await signInStudent(request);
  const res = await request.post(`${API_URL}/api/admin/users/${(student.user || student)._id}/purchases`, {
    headers: await headersFor(request),
    data: { courseId, note },
  });
  expect(res.ok(), await res.text()).toBeTruthy();
};

test.afterEach(async ({ request }) => {
  await closeVisitorPages();
  const headers = await headersFor(request);
  for (const id of madeCourses.splice(0)) {
    await request.patch(`${API_URL}/api/admin/courses/${id}/status`, { headers, data: { status: 'archived' } });
  }
});

test('a visitor sees the first two lessons free and the rest locked, and signs in first either way', async ({ page, request }, testInfo) => {
  const course = await addCourseForSale(request, testInfo);
  const visitor = await newVisitorPage(page);
  await visitor.goto(`/courses/${course.slug}`);

  const strip = visitor.getByTestId('course-buy-strip');
  await expect(strip).toContainText('The first 2 lessons are free.');
  await expect(strip).toContainText(`Buy ${course.name} to open all 3 lessons for ₹299`);
  await expect(lessonCard(visitor, 'Kinematics').getByTestId('lesson-free')).toBeVisible();
  await expect(lessonCard(visitor, 'Projectiles').getByTestId('lesson-free')).toBeVisible();
  await expect(lessonCard(visitor, 'Circular Motion').getByRole('button', { name: 'Buy to Watch' })).toBeVisible();
  // Nothing on the page leads to the locked video itself
  expect(await visitor.content()).not.toContain(YOUTUBE_IDS[2]);

  await lessonCard(visitor, 'Kinematics').getByRole('button', { name: /Watch Lecture/ }).click();
  await expect(visitor.getByRole('dialog', { name: 'Sign in required' })).toContainText('Please sign in to watch');
  await visitor.getByRole('button', { name: 'Close' }).first().click();

  await lessonCard(visitor, 'Circular Motion').getByRole('button', { name: 'Buy to Watch' }).click();
  const prompt = visitor.getByRole('dialog', { name: 'Sign in required' });
  await expect(prompt).toContainText('Sign in first, then buy');
  await prompt.getByRole('button', { name: 'Sign In' }).click();
  await expect(visitor.getByText('SECURE LOGIN PORTAL', { exact: true }).first()).toBeVisible();
});

test('a student watches a free lesson, then buys the course with Razorpay, and every lesson opens', async ({ page, request }, testInfo) => {
  const course = await addCourseForSale(request, testInfo);
  await openAsStudent(page, request);
  await fakeRazorpayAndYouTube(page);
  await page.goto(`/courses/${course.slug}`);

  // A free lesson plays straight away
  await lessonCard(page, 'Kinematics').getByRole('button', { name: /Watch Lecture/ }).click();
  const player = page.getByTestId('lesson-player');
  await expect(player.locator('iframe')).toHaveAttribute('src', new RegExp(`youtube-nocookie\\.com/embed/${YOUTUBE_IDS[0]}`));
  await player.getByRole('button', { name: 'Close lecture' }).click();

  // A failed attempt changes nothing
  await page.evaluate(() => {
    window.__razorpayMode = 'fail';
  });
  // Buy Now opens the checkout with only this course
  await page.getByTestId('course-buy-strip').getByRole('button', { name: 'Buy Now' }).click();
  await expect(page).toHaveURL(new RegExp(`/checkout\\?course=${course.slug}$`));
  await expect(page.getByTestId('checkout-item')).toHaveCount(1);
  await expect(page.getByTestId('checkout-step-1')).toContainText('Signed in as');
  await expect(page.getByTestId('checkout-step-2')).toContainText('UPI, cards, net banking and wallets');
  await expect(page.getByTestId('checkout-summary')).toContainText('Discount (70% off)');
  await expect(page.getByTestId('checkout-total')).toHaveText('₹299');
  await page.getByTestId('checkout-pay').click();
  const failed = page.getByRole('alertdialog').filter({ hasText: 'The payment did not go through' });
  await expect(failed).toContainText('Your bank declined this payment. No money was taken.');
  await failed.getByRole('button', { name: 'OK' }).click();
  await page.getByRole('link', { name: 'Back to Course' }).click();
  await expect(lessonCard(page, 'Circular Motion').getByRole('button', { name: 'Buy to Watch' })).toBeVisible();

  // The locked lesson offers the purchase too
  await page.evaluate(() => {
    window.__razorpayMode = 'pay';
  });
  await lessonCard(page, 'Circular Motion').getByRole('button', { name: 'Buy to Watch' }).click();
  const prompt = page.getByRole('dialog', { name: 'Buy this course' });
  await prompt.getByRole('button', { name: 'Buy for ₹299' }).click();
  await expect(page).toHaveURL(/\/checkout\?course=/);
  await expect(page.getByTestId('checkout-pay')).toHaveText('Pay ₹299');
  await page.getByTestId('checkout-pay').click();

  const done = page.getByRole('alertdialog').filter({ hasText: `You have ${course.name}` });
  await expect(done).toContainText('Payment received. Every lesson is open now.');
  const sent = await page.evaluate(() => window.__razorpayOptions);
  const config = await (await request.get(`${API_URL}/api/payments/config`)).json();
  expect(sent.key).toBe(config.keyId);
  expect(sent.amount).toBe(29900);
  expect(sent.currency).toBe('INR');
  expect(sent.prefill.email).toBe(process.env.E2E_STUDENT_EMAIL);
  await done.getByRole('button', { name: 'Start Learning' }).click();

  await expect(page.getByTestId('course-owned')).toContainText('You have this course');
  await expect(page.getByTestId('course-buy-strip')).toHaveCount(0);
  await expect(page.getByTestId('lesson-free')).toHaveCount(0);
  await lessonCard(page, 'Circular Motion').getByRole('button', { name: /Watch Lecture/ }).click();
  await expect(player.locator('iframe')).toHaveAttribute('src', new RegExp(`youtube-nocookie\\.com/embed/${YOUTUBE_IDS[2]}`));
});

test('when a lesson ends, the next one plays by itself after 10 seconds or at once, and Watch again starts it over', async ({ page, request }, testInfo) => {
  const course = await addCourseForSale(request, testInfo);
  await giveCourse(request, course._id, 'Paid by UPI');
  await openAsStudent(page, request);
  await fakeRazorpayAndYouTube(page);
  await page.goto(`/courses/${course.slug}`);
  const player = page.getByTestId('lesson-player');
  const frame = player.locator('iframe');
  const upNext = player.getByTestId('up-next');
  const title = player.getByRole('heading', { level: 1 });

  await lessonCard(page, 'Kinematics').getByRole('button', { name: /Watch Lecture/ }).click();
  await endPlayingLesson(page);
  await expect(upNext).toContainText('Up next in');
  await expect(upNext).toContainText('1.2 Projectiles');
  await expect(upNext.getByTestId('up-next-seconds')).toHaveText(/^(10|9|8)$/);

  // By itself after 10 seconds
  await expect(frame).toHaveAttribute('src', new RegExp(`/embed/${YOUTUBE_IDS[1]}`), { timeout: 15000 });
  await expect(title).toHaveText('Projectiles');
  await expect(upNext).toHaveCount(0);

  // Watch again starts the same lesson over
  await endPlayingLesson(page);
  await expect(upNext).toContainText('1.3 Circular Motion');
  await upNext.getByRole('button', { name: 'Watch again' }).click();
  await expect(upNext).toHaveCount(0);
  await expect(title).toHaveText('Projectiles');
  await expect(frame).toHaveAttribute('src', new RegExp(`/embed/${YOUTUBE_IDS[1]}`));
  await expect(frame).not.toHaveAttribute('src', /start=/);

  // Play now goes on at once
  await endPlayingLesson(page);
  await upNext.getByRole('button', { name: 'Play now' }).click();
  await expect(title).toHaveText('Circular Motion');
  await expect(frame).toHaveAttribute('src', new RegExp(`/embed/${YOUTUBE_IDS[2]}`));

  // After the last lesson there is nothing to go on to; the cross closes the card
  await endPlayingLesson(page);
  await expect(upNext).toContainText('Course finished');
  await expect(upNext.getByRole('button', { name: 'Play now' })).toHaveCount(0);
  await expect(upNext.getByRole('button', { name: 'Watch again' })).toBeVisible();
  await upNext.getByRole('button', { name: 'Close up next' }).click();
  await expect(upNext).toHaveCount(0);
});

test('a free lesson that ends offers to unlock the next, locked one instead of playing it', async ({ page, request }, testInfo) => {
  const course = await addCourseForSale(request, testInfo);
  await openAsStudent(page, request);
  await fakeRazorpayAndYouTube(page);
  await page.goto(`/courses/${course.slug}`);
  const player = page.getByTestId('lesson-player');
  const upNext = player.getByTestId('up-next');

  // Lessons 1 and 2 are free; lesson 3 is locked until the course is bought
  await lessonCard(page, 'Projectiles').getByRole('button', { name: /Watch Lecture/ }).click();
  await endPlayingLesson(page);
  await expect(upNext).toContainText('Next lesson is locked');
  await expect(upNext).toContainText('1.3 Circular Motion');
  await expect(upNext.getByTestId('up-next-seconds')).toHaveCount(0);
  await upNext.getByRole('button', { name: 'Unlock' }).click();
  await expect(page.getByRole('dialog', { name: 'Buy this course' })).toBeVisible();
});

test('a topic card with subtopics shows how many are finished, says Watching, and Continue opens the one in progress', async ({ page, request }, testInfo) => {
  const course = await addCourseForSale(request, testInfo);
  const headers = await headersFor(request);
  const youtube = (index) => `https://www.youtube.com/watch?v=${YOUTUBE_IDS[index]}`;
  const tree = await request.put(`${API_URL}/api/admin/courses/${course._id}/curriculum`, {
    headers,
    data: {
      chapters: [
        {
          number: '1',
          name: 'Motion',
          topics: [
            {
              code: '1.1',
              title: 'Kinematics',
              youtubeUrl: youtube(0),
              children: [
                { code: '1.1.1', title: 'Speed', youtubeUrl: youtube(1) },
                { code: '1.1.2', title: 'Velocity', youtubeUrl: youtube(2) },
              ],
            },
          ],
        },
      ],
    },
  });
  expect(tree.ok(), await tree.text()).toBeTruthy();
  await giveCourse(request, course._id, 'Paid by UPI');

  const student = await signInStudent(request);
  const asStudent = { Authorization: `Bearer ${student.token}` };
  const topic = (await (await request.get(`${API_URL}/api/courses/${course.slug}`, { headers: asStudent })).json()).curriculum.chapters[0].topics[0];
  const [speed, velocity] = topic.children;
  const save = (node, values) =>
    request.put(`${API_URL}/api/progress/${course._id}`, { headers: asStudent, data: { lessonKey: node.lesson.videoId || node.nodeId, ...values } });
  // The topic's own lesson is finished and Speed is stopped at 2:05
  expect((await save(topic, { position: 600, duration: 600, completed: true })).ok()).toBeTruthy();
  expect((await save(speed, { position: 125, duration: 600 })).ok()).toBeTruthy();

  await openAsStudent(page, request);
  await fakeRazorpayAndYouTube(page);
  await page.goto(`/courses/${course.slug}`);
  const card = lessonCard(page, 'Kinematics');
  await expect(card.getByTestId('lesson-watching')).toHaveText('Watching · 1/3');
  await expect(card.getByTestId('lesson-completed')).toHaveCount(0);
  await expect(card.getByTestId('topic-progress')).toContainText('1 of 3 finished');
  await card.getByRole('button', { name: 'Continue (1.1)' }).click();
  const player = page.getByTestId('lesson-player');
  await expect(player.getByRole('heading', { level: 1 })).toHaveText('Speed');
  await expect(player.getByTestId('lesson-resumed')).toHaveText('Resumed at 2:05');
  await player.getByRole('button', { name: 'Close lecture' }).click();

  // Once every lesson under it is finished, the card says Watched
  expect((await save(speed, { position: 600, duration: 600, completed: true })).ok()).toBeTruthy();
  expect((await save(velocity, { position: 600, duration: 600, completed: true })).ok()).toBeTruthy();
  await page.reload();
  await expect(card.getByTestId('lesson-completed')).toHaveText('Watched');
  await expect(card.getByTestId('lesson-watching')).toHaveCount(0);
  await expect(card.getByTestId('topic-progress')).toContainText('3 of 3 finished');
  await expect(card.getByRole('button', { name: 'Watch Lecture (1.1)' })).toBeVisible();
});

test('the Continue cards step aside by themselves after 10 seconds, but not while the pointer is on them', async ({ page, request }, testInfo) => {
  test.setTimeout(120000);
  const course = await addCourseForSale(request, testInfo);
  await giveCourse(request, course._id, 'Paid by UPI');
  await openAsStudent(page, request);
  await page.goto('/demo');
  const band = page.getByTestId('continue-learning');
  const tab = page.getByTestId('continue-reopen');
  await expect(band.getByTestId('continue-course').filter({ hasText: course.name })).toBeInViewport();

  // The pointer on the cards holds them
  await band.getByTestId('continue-course').filter({ hasText: course.name }).hover();
  await expect(band).toHaveAttribute('data-held', 'true');
  await page.waitForTimeout(11000);
  await expect(band).toBeVisible();

  // Left alone, they go after 10 seconds and the tab is left
  await page.mouse.move(5, 600);
  await expect(band).not.toHaveAttribute('data-held', 'true');
  await expect(band).toBeVisible();
  await expect(tab).toBeVisible({ timeout: 15000 });
  await expect(band).toHaveCount(0);

  // The tab brings them back, with 10 seconds again
  await tab.click();
  await expect(band).toBeVisible();
  await page.mouse.move(5, 600);
  await expect(band).toHaveAttribute('data-closes-in', /^(10|9)$/);
});

test('Continue still resumes where the student stopped after the topic gets an uploaded video', async ({ page, request }, testInfo) => {
  const course = await addCourseForSale(request, testInfo);
  await giveCourse(request, course._id, 'Paid by UPI');
  const student = await signInStudent(request);
  const asStudent = { Authorization: `Bearer ${student.token}` };
  const pageData = async () => (await request.get(`${API_URL}/api/courses/${course.slug}`, { headers: asStudent })).json();

  // Stopped at 2:05 in Kinematics while it was a YouTube link typed into the syllabus: saved under its topic
  const before = (await pageData()).curriculum.chapters[0].topics[0];
  expect(before.lesson.videoId || '').toBe('');
  const saved = await request.put(`${API_URL}/api/progress/${course._id}`, {
    headers: asStudent,
    data: { lessonKey: before.nodeId, position: 125, duration: 600 },
  });
  expect(saved.ok(), await saved.text()).toBeTruthy();

  // Later the admin adds a Lesson Studio video for the same topic, so the lesson now has a video id too
  const headers = await headersFor(request);
  const video = await request.post(`${API_URL}/api/videos`, {
    headers,
    data: {
      url: `https://www.youtube.com/watch?v=${YOUTUBE_IDS[0]}`,
      subject: course.name,
      status: 'published',
      chapterNumber: '1',
      chapterName: 'Motion',
      topicNumber: '1.1',
      topicName: 'Kinematics',
    },
  });
  expect(video.ok(), await video.text()).toBeTruthy();
  const made = await video.json();
  const videoId = made.data?._id || made.video?._id || made._id;
  try {
    const after = (await pageData()).curriculum.chapters[0].topics[0];
    expect(after.nodeId).toBe(before.nodeId);
    expect(after.lesson.videoId).toBeTruthy();

    await openAsStudent(page, request);
    await fakeRazorpayAndYouTube(page);
    await page.goto(`/courses/${course.slug}`);
    await expect(page.getByTestId('course-continue')).toContainText('at 2:05');
    await expect(lessonCard(page, 'Kinematics').getByTestId('lesson-watched')).toBeVisible();
    await page.getByTestId('course-continue').getByRole('button', { name: 'Continue' }).click();
    const player = page.getByTestId('lesson-player');
    await expect(player.locator('iframe')).toHaveAttribute('src', /start=125/);
    await expect(player.getByTestId('lesson-resumed')).toHaveText('Resumed at 2:05');
    await player.getByRole('button', { name: 'Close lecture' }).click();

    // And from the home page
    await page.goto('/demo');
    await page.getByTestId('continue-learning').getByTestId('continue-course').filter({ hasText: course.name }).click();
    await expect(player.locator('iframe')).toHaveAttribute('src', /start=125/);

    // The course's card in the home page grid says it is theirs and goes back in, with no Enroll
    await page.goto('/demo');
    const homeCard = page.getByTestId('course-card').filter({ hasText: course.name });
    await expect(homeCard.getByTestId('course-card-owned')).toHaveText('Your course');
    await expect(homeCard.getByRole('button', { name: 'Enroll' })).toHaveCount(0);
    await homeCard.getByRole('button', { name: 'Continue' }).click();
    await expect(player.locator('iframe')).toHaveAttribute('src', /start=125/);

    // The Continue cards on the side close with the cross into a small tab, which brings them back,
    // step aside while the page is scrolled down, and are back when the home page opens again
    await page.goto('/demo');
    const band = page.getByTestId('continue-learning');
    const mine = band.getByTestId('continue-course').filter({ hasText: course.name });
    const tab = page.getByTestId('continue-reopen');
    await expect(mine).toBeVisible();
    await expect(mine).toBeInViewport();
    await expectNoSideScroll(page);
    await band.getByRole('button', { name: 'Close continue learning' }).click();
    await expect(band).toHaveCount(0);
    await tab.click();
    await expect(mine).toBeInViewport();
    await expect(tab).toHaveCount(0);

    await page.evaluate(() => window.scrollTo(0, 800));
    await expect(band).toHaveCount(0);
    await expect(tab).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(mine).toBeInViewport();

    await band.getByRole('button', { name: 'Close continue learning' }).click();
    await expect(band).toHaveCount(0);
    await page.reload();
    await expect(page.getByTestId('continue-learning').getByTestId('continue-course').filter({ hasText: course.name })).toBeVisible();
  } finally {
    if (videoId) await request.delete(`${API_URL}/api/videos/${videoId}`, { headers });
  }
});

test('lessons resume where the student stopped, a finished one gets a tick, and My Courses and the admin show both', async ({ page, request }, testInfo) => {
  const course = await addCourseForSale(request, testInfo);
  await giveCourse(request, course._id, 'Paid by UPI');

  await openAsStudent(page, request);
  await fakeRazorpayAndYouTube(page);
  await page.goto(`/courses/${course.slug}`);
  const player = page.getByTestId('lesson-player');

  // Kinematics is watched to the end: the player marks it finished in the topic hierarchy
  await lessonCard(page, 'Kinematics').getByRole('button', { name: /Watch Lecture/ }).click();
  await watchUntil(page, 600, { ended: true });
  // The Up next card comes up; closing it stops the next lesson starting by itself
  await expect(player.getByTestId('up-next')).toContainText('1.2 Projectiles');
  await player.getByRole('button', { name: 'Close up next' }).click();
  await expect(player.getByTestId('up-next')).toHaveCount(0);
  const kinematicsRow = player.getByTestId('syllabus-node').filter({ hasText: 'Kinematics' });
  await expect(kinematicsRow.getByTestId('lesson-finished')).toBeVisible();
  await expect(kinematicsRow).toHaveAttribute('data-finished', 'true');
  await expect(player.getByTestId('lesson-done')).toHaveText('Finished');
  await expect(player.getByTestId('hierarchy-finished')).toHaveText('1 of 3 finished');
  await expect(player.getByTestId('syllabus-node').filter({ hasText: 'Projectiles' }).getByTestId('lesson-finished')).toHaveCount(0);
  // Another lesson: the finished one shows Revisit
  await player.getByTestId('syllabus-node').filter({ hasText: 'Projectiles' }).click();
  await expect(kinematicsRow.getByTestId('lesson-revisit')).toHaveText('Revisit');
  await expect(player.getByTestId('lesson-done')).toHaveCount(0);
  await player.getByRole('button', { name: 'Close lecture' }).click();
  await expect(lessonCard(page, 'Kinematics').getByTestId('lesson-completed')).toHaveText('Watched');

  // Projectiles is paused at 2:05 of 10:00
  await lessonCard(page, 'Projectiles').getByRole('button', { name: /Watch Lecture/ }).click();
  await expect(player.locator('iframe')).not.toHaveAttribute('src', /start=/);
  await watchUntil(page, 125);
  await player.getByRole('button', { name: 'Close lecture' }).click();
  await expect(page.getByTestId('course-continue')).toContainText('Projectiles');
  await expect(page.getByTestId('course-continue')).toContainText('at 2:05');
  await expect(lessonCard(page, 'Projectiles').getByTestId('lesson-watched')).toBeVisible();
  await expect(lessonCard(page, 'Projectiles').getByRole('button', { name: /Continue/ })).toBeVisible();
  await expect(lessonCard(page, 'Projectiles').getByTestId('lesson-completed')).toHaveCount(0);

  // Coming back later starts the video at the same place, and opening it without playing keeps the place
  await page.reload();
  await page.getByTestId('course-continue').getByRole('button', { name: 'Continue' }).click();
  await expect(player.locator('iframe')).toHaveAttribute('src', /start=125/);
  await expect(player.getByTestId('lesson-resumed')).toHaveText('Resumed at 2:05');
  await player.getByRole('button', { name: 'Close lecture' }).click();

  // The home page shows the course at the top, and the avatar menu leads to My Courses
  await page.goto('/demo');
  const quick = page.getByTestId('continue-learning').getByTestId('continue-course').filter({ hasText: course.name });
  await expect(quick).toContainText('1.2: Projectiles at 2:05');
  await page.getByRole('button', { name: 'Account menu' }).click();
  await page.getByRole('menu', { name: 'Account' }).getByRole('menuitem', { name: 'My Courses' }).click();
  await expect(page).toHaveURL(/\/my-courses$/);
  const mine = page.getByTestId('my-course').filter({ hasText: course.name });
  await expect(mine).toContainText('Given by MyMarks');
  await expect(mine).toContainText('1 of 3 lessons finished, 1 started');
  await expect(mine).toContainText('Last: 1.2: Projectiles at 2:05');

  // Continue goes straight back into the lesson, from My Courses and from the home page
  await mine.getByRole('link', { name: 'Continue' }).click();
  await expect(page).toHaveURL(new RegExp(`/courses/${course.slug}`));
  await expect(player.locator('iframe')).toHaveAttribute('src', /start=125/);
  await expect(player.getByTestId('lesson-resumed')).toHaveText('Resumed at 2:05');
  await player.getByRole('button', { name: 'Close lecture' }).click();
  await expect(page).not.toHaveURL(/continue=/);

  await page.goto('/demo');
  await quick.click();
  await expect(player.locator('iframe')).toHaveAttribute('src', /start=125/);
  await player.getByRole('button', { name: 'Close lecture' }).click();

  // The profile lists it too
  await page.goto('/profile');
  await expect(page.getByTestId('my-course').filter({ hasText: course.name })).toContainText('1 of 3 lessons finished');

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
  await expect(watching).toContainText('Finished');
  await expect(watching).toContainText('Stopped at 2:05 of 10:00');

  await owned.getByRole('button', { name: 'Remove' }).click();
  await admin.getByRole('alertdialog').filter({ hasText: `Remove ${course.name}?` }).getByRole('button', { name: 'Remove' }).click();
  await expect(details.getByTestId('student-course').filter({ hasText: course.name })).toContainText('Removed');

  // Gone for the student too, apart from the free lessons
  await page.goto(`/courses/${course.slug}`);
  await expect(page.getByTestId('course-buy-strip')).toBeVisible();
  await expect(lessonCard(page, 'Circular Motion').getByRole('button', { name: 'Buy to Watch' })).toBeVisible();
});

test('the enrollment form lets a student pay online now, or ask the team to call', async ({ page, request, isMobile }, testInfo) => {
  const course = await addCourseForSale(request, testInfo);
  await openAsStudent(page, request);
  await fakeRazorpayAndYouTube(page);
  await page.goto(`/courses/${course.slug}`);

  const openForm = async () => {
    await page.getByRole('button', { name: 'Book 1-on-1 Doubt Session' }).click();
    if (isMobile) await page.getByRole('button', { name: /^Enrollment Form/ }).click();
  };

  await openForm();
  const pay = page.getByTestId('booking-pay');
  await expect(pay.getByRole('button', { name: 'Pay ₹299 now' })).toBeVisible();
  await expect(pay).toContainText('or');
  await expect(page.getByRole('button', { name: 'Send Enrollment Request' })).toBeVisible();

  await pay.getByRole('button', { name: 'Pay ₹299 now' }).click();
  const done = page.getByRole('alertdialog').filter({ hasText: `You have ${course.name}` });
  await expect(done).toContainText('Payment received. Every lesson is open now.');
  await done.getByRole('button', { name: 'Start Learning' }).click();
  await expect(page).toHaveURL(new RegExp(`/courses/${course.slug}$`));
  await expect(page.getByTestId('course-owned')).toBeVisible();
  await expect(lessonCard(page, 'Circular Motion').getByRole('button', { name: /Watch Lecture/ })).toBeVisible();

  // Having it, the form offers to start learning instead
  await openForm();
  await expect(pay.getByRole('button', { name: new RegExp(`You have ${course.name}: Start Learning`) })).toBeVisible();
});

test('a student likes courses on the home page and a course page, finds them on Liked Courses, and removes them', async ({ page, request, isMobile }, testInfo) => {
  const first = await addCourseForSale(request, testInfo);
  const second = await addCourseForSale(request, testInfo);

  // A visitor's heart asks them to sign in first
  await openAsVisitor(page);
  await page.goto(`/courses/${first.slug}`);
  await page.getByRole('button', { name: `Like ${first.name}` }).click();
  await expect(page).toHaveURL(/\/signin/);

  // A student likes one from the home page grid and one from its course page
  await openAsStudent(page, request);
  await page.goto('/demo');
  const card = page.getByTestId('course-card').filter({ hasText: first.name });
  await card.getByRole('button', { name: `Like ${first.name}` }).click();
  await expect(card.getByRole('button', { name: `Remove ${first.name} from liked courses` })).toHaveAttribute('aria-pressed', 'true');
  if (!isMobile) await expect(page.getByTestId('nav-liked')).toHaveAccessibleName(/^Liked courses, \d+$/);

  await page.goto(`/courses/${second.slug}`);
  await page.getByRole('button', { name: `Like ${second.name}` }).click();
  await expect(page.getByRole('button', { name: `Remove ${second.name} from liked courses` })).toHaveText('Liked');

  // Liked Courses: newest first, with the price and Add to Cart, kept on the account
  await page.goto('/liked');
  const liked = page.getByTestId('liked-course');
  await expect(liked.first()).toContainText(second.name);
  const firstLiked = liked.filter({ hasText: first.name });
  await expect(firstLiked).toContainText('₹299');
  await firstLiked.getByRole('button', { name: 'Add to Cart' }).click();
  await expect(firstLiked.getByRole('link', { name: 'Go to Cart' })).toBeVisible();
  await expectNoSideScroll(page);
  await page.reload();
  await expect(liked.filter({ hasText: second.name })).toBeVisible();

  // The heart takes them off the list
  for (const course of [first, second]) {
    await liked.filter({ hasText: course.name }).getByRole('button', { name: `Remove ${course.name} from liked courses` }).click();
    await expect(liked.filter({ hasText: course.name })).toHaveCount(0);
  }
  await page.goto(`/courses/${second.slug}`);
  await expect(page.getByRole('button', { name: `Like ${second.name}` })).toHaveText('Like');

  // The avatar menu leads to the page too
  await page.getByRole('button', { name: 'Account menu' }).click();
  await page.getByRole('menu', { name: 'Account' }).getByRole('menuitem', { name: 'Liked Courses' }).click();
  await expect(page).toHaveURL(/\/liked$/);
});

test('a visitor fills the cart, signs in at checkout, and one Razorpay payment opens every course in it', async ({ page, request }, testInfo) => {
  const first = await addCourseForSale(request, testInfo);
  const second = await addCourseForSale(request, testInfo);
  await fakeRazorpayAndYouTube(page);
  await openAsVisitor(page);

  // The cart works before signing in, from the top of the page and from the lesson list
  await page.goto(`/courses/${first.slug}`);
  await expect(page.getByTestId('nav-cart')).toHaveAccessibleName('Cart');
  await page.getByTestId('hero-cart').click();
  const added = page.getByRole('alertdialog').filter({ hasText: 'Added to cart' });
  await expect(added).toContainText(`${first.name} is in your cart.`);
  await added.getByRole('button', { name: 'Keep Browsing' }).click();
  await expect(page.getByTestId('hero-cart')).toHaveText('Go to Cart');
  await expect(page.getByTestId('nav-cart')).toHaveAccessibleName('Cart, 1 course');
  await page.goto(`/courses/${second.slug}`);
  await page.getByTestId('course-buy-strip').getByRole('button', { name: 'Add to Cart' }).click();
  await expect(page.getByTestId('nav-cart')).toHaveAccessibleName('Cart, 2 courses');
  await added.getByRole('button', { name: 'Go to Cart' }).click();

  await expect(page).toHaveURL(/\/cart$/);
  await expect(page.getByTestId('cart-item')).toHaveCount(2);
  await expect(page.getByTestId('cart-total')).toHaveText('₹598');
  await expectNoSideScroll(page);
  await expect(page.getByTestId('cart-checkout')).toHaveText('Proceed to Checkout');
  await page.getByTestId('cart-checkout').click();

  // The checkout asks a visitor to sign in first; billing and payment open after that
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page.getByTestId('checkout-item')).toHaveCount(2);
  await expect(page.getByTestId('checkout-step-1')).toContainText('Sign in or create an account');
  await expect(page.getByTestId('checkout-step-2')).not.toContainText('Mobile');
  await expect(page.getByTestId('checkout-summary')).toContainText('Original price');
  await expect(page.getByTestId('checkout-summary')).toContainText('Discount (70% off)');
  await expect(page.getByTestId('checkout-summary')).toContainText('Total (2 courses)');
  await expect(page.getByTestId('checkout-total')).toHaveText('₹598');
  await expectNoSideScroll(page);
  await page.getByTestId('checkout-pay').click();
  await expect(page).toHaveURL(/\/signin/);

  // Signed in, the same order is waiting
  await openAsStudent(page, request);
  await page.goto('/checkout');
  await expect(page.getByTestId('checkout-item')).toHaveCount(2);
  await expect(page.getByTestId('checkout-step-2')).toContainText('Mobile');
  await expect(page.getByTestId('checkout-pay')).toHaveText('Pay ₹598');
  await page.getByTestId('checkout-pay').click();
  const done = page.getByRole('alertdialog').filter({ hasText: 'You have 2 new courses' });
  await expect(done).toContainText('Payment received. Every lesson is open now.');

  // One checkout window for the total of both
  const options = await page.evaluate(() => window.__razorpayOptions);
  expect(options.amount).toBe(59800);
  expect(options.description).toBe(`2 courses: ${first.name}, ${second.name}`);

  await done.getByRole('button', { name: 'Go to My Courses' }).click();
  await expect(page).toHaveURL(/\/my-courses/);
  for (const course of [first, second]) {
    await expect(page.getByTestId('my-course').filter({ hasText: course.name })).toBeVisible();
  }
  await expect(page.getByTestId('nav-cart')).toHaveAccessibleName('Cart');

  await page.goto(`/courses/${second.slug}`);
  await expect(page.getByTestId('course-owned')).toBeVisible();
  await expect(page.getByTestId('hero-cart')).toHaveCount(0);
  await expect(lessonCard(page, 'Circular Motion').getByRole('button', { name: /Watch Lecture/ })).toBeVisible();
});

test('Buy Now takes the course out of the cart, and a course the student has is left out of the cart total', async ({ page, request }, testInfo) => {
  const later = await addCourseForSale(request, testInfo);
  const now = await addCourseForSale(request, testInfo);
  await fakeRazorpayAndYouTube(page);
  await openAsStudent(page, request);

  for (const course of [later, now]) {
    await page.goto(`/courses/${course.slug}`);
    await page.getByTestId('hero-cart').click();
    await page.getByRole('alertdialog').filter({ hasText: 'Added to cart' }).getByRole('button', { name: 'Keep Browsing' }).click();
  }
  await expect(page.getByTestId('nav-cart')).toHaveAccessibleName('Cart, 2 courses');

  await page.getByTestId('course-buy-strip').getByRole('button', { name: 'Buy Now' }).click();
  await expect(page.getByTestId('checkout-item')).toHaveCount(1);
  await expect(page.getByTestId('checkout-item')).toContainText(now.name);
  await page.getByTestId('checkout-pay').click();
  await page.getByRole('alertdialog').filter({ hasText: `You have ${now.name}` }).getByRole('button', { name: 'Start Learning' }).click();
  await expect(page).toHaveURL(new RegExp(`/courses/${now.slug}$`));
  await expect(page.getByTestId('course-owned')).toBeVisible();
  await expect(page.getByTestId('nav-cart')).toHaveAccessibleName('Cart, 1 course');

  // Buy Now on a course the student has says so
  await page.goto(`/checkout?course=${now.slug}`);
  await expect(page.getByTestId('checkout-owned')).toContainText(`You already have ${now.name}.`);

  // A cart saved in another tab before that still holds the bought course
  await page.evaluate((course) => {
    const cart = JSON.parse(localStorage.getItem('mymarks_cart'));
    cart.push({ id: course._id, slug: course.slug, name: course.name, price: 299, oldPrice: 999, image: '' });
    localStorage.setItem('mymarks_cart', JSON.stringify(cart));
  }, now);
  await page.goto('/cart');
  await expect(page.getByTestId('cart-item')).toHaveCount(2);
  await expect(page.getByTestId('cart-item').filter({ hasText: now.name })).toContainText('You have this course');
  await expect(page.getByTestId('cart-total')).toHaveText('₹299');
  await expect(page.getByTestId('cart-checkout')).toHaveText('Proceed to Checkout');

  // Remove takes a course out
  await page.getByRole('button', { name: `Remove ${now.name}` }).click();
  await expect(page.getByTestId('cart-item')).toHaveCount(1);
  await page.getByRole('button', { name: `Remove ${later.name}` }).click();
  await expect(page.getByTestId('cart-empty')).toBeVisible();
  await expect(page.getByTestId('nav-cart')).toHaveAccessibleName('Cart');
});

test('with the payment method set to Demo, a student buys with no money and sees what happens after paying', async ({ page, request }, testInfo) => {
  const course = await addCourseForSale(request, testInfo);
  const headers = await headersFor(request);
  try {
    const set = await request.put(`${API_URL}/api/admin/payment-settings`, { headers, data: { provider: 'demo' } });
    expect(set.ok(), await set.text()).toBeTruthy();

    await openAsStudent(page, request);
    await page.goto(`/courses/${course.slug}`);
    await expect(page.getByTestId('course-buy-strip')).toContainText('demo payment, no real money');
    await page.getByTestId('course-buy-strip').getByRole('button', { name: 'Buy Now' }).click();
    await expect(page.getByTestId('checkout-step-2')).toContainText('Demo payment');
    await expect(page.getByTestId('checkout-pay')).toHaveText('Pay ₹299 (demo)');
    await page.getByTestId('checkout-pay').click();

    const ask = page.getByRole('alertdialog').filter({ hasText: 'This is a demo' });
    await expect(ask).toContainText('no money is taken');
    await ask.getByRole('button', { name: 'Pay ₹299 (demo)' }).click();
    const done = page.getByRole('alertdialog').filter({ hasText: `You have ${course.name}` });
    await expect(done).toContainText('Demo payment done, no money was taken.');
    await done.getByRole('button', { name: 'Start Learning' }).click();
    await expect(page.getByTestId('course-owned')).toBeVisible();
    await expect(lessonCard(page, 'Circular Motion').getByRole('button', { name: /Watch Lecture/ })).toBeVisible();

    // My Courses and the admin show it as a demo
    await page.goto('/my-courses');
    await expect(page.getByTestId('my-course').filter({ hasText: course.name })).toContainText('Bought with a demo payment');

    const admin = await newVisitorPage(page);
    await openAsAdmin(admin, request);
    await admin.goto('/admin/payments');
    await expect(admin.getByTestId('payments-table').locator('tr').filter({ hasText: course.name })).toContainText('Demo, no money');
    await admin.getByRole('tab', { name: 'Settings' }).click();
    await expect(admin.getByTestId('demo-warning')).toBeVisible();
    await expect(admin.getByRole('radio', { name: /Demo \(no real money\)/ })).toBeChecked();
  } finally {
    // Back to the default for the other tests (the test server has Razorpay keys, so that is Razorpay)
    await request.put(`${API_URL}/api/admin/payment-settings`, { headers, data: { provider: 'auto' } });
  }
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

test('the admin Payments page lists payments as they come in and saves the Razorpay keys', async ({ page, request }, testInfo) => {
  const course = await addCourseForSale(request, testInfo);
  await giveCourse(request, course._id, 'Paid at the office');
  const headers = await headersFor(request);

  try {
    await openAsAdmin(page, request);
    await page.goto('/admin/payments');
    const table = page.getByTestId('payments-table');
    const row = table.locator('tr').filter({ hasText: course.name });
    await expect(row).toContainText('E2E Student');
    await expect(row).toContainText('Given by admin');
    await expect(page.getByTestId('payment-summary')).toContainText('Collected online');

    await page.getByRole('button', { name: 'Given by admin' }).click();
    await expect(row).toBeVisible();
    await page.getByRole('button', { name: 'Not finished', exact: true }).click();
    await expect(table.locator('tr').filter({ hasText: course.name })).toHaveCount(0);
    await page.getByRole('button', { name: 'All', exact: true }).click();
    await page.getByLabel('Search payments').fill(course.name);
    await expect(table.locator('tbody tr')).toHaveCount(1);

    // Settings: the keys are checked with Razorpay, then saved; the secret is never shown again
    await page.getByRole('tab', { name: 'Settings' }).click();
    await expect(page.getByTestId('payment-status')).toContainText('Payments are on.');
    await expect(page.getByTestId('payment-status')).toContainText('server settings');
    // The method starts on Automatic, which uses Razorpay here because the server has keys
    await expect(page.getByRole('radio', { name: /Automatic \(recommended\)/ })).toBeChecked();
    await expect(page.getByTestId('demo-warning')).toHaveCount(0);
    await page.getByLabel('Key id').fill('rzp_test_e2eRefused');
    await page.getByLabel('Key secret').fill('some-secret-value');
    await page.getByRole('button', { name: 'Check keys' }).click();
    await expect(page.getByTestId('key-check')).toContainText('Razorpay refused these keys');

    await page.getByLabel('Key id').fill('rzp_test_E2eAdminKey1');
    await page.getByLabel('Key secret').fill('admin-secret-9876');
    await page.getByRole('button', { name: 'Check keys' }).click();
    await expect(page.getByTestId('key-check')).toContainText('Razorpay accepted these keys.');
    await expect(page.getByLabel('Webhook address')).toHaveValue(/\/api\/payments\/webhook$/);
    await page.getByRole('button', { name: 'Save Payment Settings' }).click();

    await expect(page.getByTestId('payment-status')).toContainText('Using the keys saved on this page.');
    await expect(page.getByTestId('payment-status')).toContainText('Test mode');
    await expect(page.getByLabel('Key secret')).toHaveValue('');
    await expect(page.getByText('Saved, ends in 9876. Leave empty to keep it.')).toBeVisible();
    expect(await page.content()).not.toContain('admin-secret-9876');
    expect((await (await request.get(`${API_URL}/api/payments/config`)).json()).keyId).toBe('rzp_test_E2eAdminKey1');
  } finally {
    // Back to the test server's own keys, for the other tests
    await request.put(`${API_URL}/api/admin/payment-settings`, { headers, data: { keyId: '', enabled: true } });
  }
});
