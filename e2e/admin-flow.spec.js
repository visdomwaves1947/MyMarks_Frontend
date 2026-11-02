import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';
import { API_URL, closeVisitorPages, courseCard, getAdminToken, goToCoursesTab, goToHome, newVisitorPage, openAsAdmin, openAsStudent } from './helpers';

const here = path.dirname(fileURLToPath(import.meta.url));
const IMAGE_FILE = path.join(here, 'fixtures', 'thumbnail.png');
const CHAPTERS_FILE = path.join(here, 'fixtures', 'chapters.csv');
const IMAGE_LINK = 'https://images.example.com/robotics.jpg';
const YOUTUBE_LINK = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

const api = async (request, method, urlPath, data) => {
  const token = await getAdminToken(request);
  const res = await request.fetch(`${API_URL}${urlPath}`, {
    method,
    data,
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(res.ok(), await res.text()).toBeTruthy();
  return res.json();
};

const findCourse = async (request, name) => {
  const { courses } = await api(request, 'GET', '/api/admin/courses');
  return courses.find((course) => course.name === name);
};

const openEditor = async (page, name) => {
  await goToCoursesTab(page);
  await page.getByPlaceholder('Search courses...').fill(name);
  await page.getByRole('button', { name: `Edit ${name}`, exact: true }).click();
  await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
};

const step = (page, name) => page.getByRole('button', { name: new RegExp(`^\\d\\. ${name}$`) }).click();

const saveDraft = async (page) => {
  await page.getByRole('button', { name: 'Save Draft' }).click();
  await expect(page.getByText('Course saved').first()).toBeVisible();
};

test.describe.serial('admin manages a course from start to finish', () => {
  test.setTimeout(90000);
  test.afterEach(closeVisitorPages);

  test('1. a new subject with an uploaded thumbnail appears on the home page in the present card', async ({ page, request }) => {
    await openAsAdmin(page, request);
    await goToCoursesTab(page);

    await page.getByRole('button', { name: 'Add Course' }).click();
    await page.getByLabel('Course name').fill('Robotics');
    await page.getByRole('button', { name: 'MPC', exact: true }).click();
    await page.getByLabel('Short description').fill('Build and program simple robots.');

    await step(page, 'Card');
    await page.getByTestId('image-file-input').setInputFiles(IMAGE_FILE);
    await expect(page.getByText('Image uploaded.')).toBeVisible();
    await page.getByLabel(/^Price \(₹\)/).fill('349');
    await page.getByLabel('Old price (₹)').fill('799');

    // The live preview uses the same card as the website
    await expect(courseCard(page, 'Robotics')).toBeVisible();

    await step(page, 'Publish');
    await page.getByRole('button', { name: 'Publish Course' }).click();
    await expect(page.getByText('Course is now published')).toBeVisible();

    const visitor = await newVisitorPage(page);
    await goToHome(visitor);

    const card = courseCard(visitor, 'Robotics');
    await expect(card).toBeVisible();
    await expect(card.getByText('MPC')).toBeVisible();
    await expect(card.getByRole('button', { name: 'Explore' })).toBeVisible();
    await expect(card.getByRole('button', { name: 'Enroll' })).toBeVisible();
    await expect(card.locator('img')).toHaveAttribute('src', /\/uploads\/thumbnails\//);
  });

  test('2. a course can use a pasted image link', async ({ page, request }) => {
    await openAsAdmin(page, request);
    await goToCoursesTab(page);

    await page.getByRole('button', { name: 'Add Course' }).click();
    await page.getByLabel('Course name').fill('Astronomy');
    await page.getByLabel('Short description').fill('Stars, planets and the night sky.');

    await step(page, 'Card');
    await page.getByPlaceholder('Or paste an https image link').fill(IMAGE_LINK);
    await page.getByRole('button', { name: 'Use Link' }).click();
    await expect(page.getByText('Saved as a link')).toBeVisible();
    await page.getByLabel(/^Price \(₹\)/).fill('199');
    await saveDraft(page);

    const course = await findCourse(request, 'Astronomy');
    expect(course.thumbnail.url).toBe(IMAGE_LINK);
  });

  test('9. a course with no thumbnail cannot be published', async ({ page, request }) => {
    await openAsAdmin(page, request);
    await goToCoursesTab(page);

    await page.getByRole('button', { name: 'Add Course' }).click();
    await page.getByLabel('Course name').fill('No Image Course');
    await page.getByLabel('Short description').fill('Missing a thumbnail.');
    await step(page, 'Card');
    await page.getByLabel(/^Price \(₹\)/).fill('99');

    await step(page, 'Publish');
    await expect(page.getByRole('button', { name: 'Publish Course' })).toBeDisabled();

    // The server refuses it as well, whatever the screen allows
    await page.getByRole('button', { name: 'Save Draft' }).click();
    await expect(page.getByText('Course saved').first()).toBeVisible();
    const course = await findCourse(request, 'No Image Course');
    const token = await getAdminToken(request);
    const res = await request.patch(`${API_URL}/api/admin/courses/${course._id}/status`, {
      data: { status: 'published' },
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status()).toBe(400);
    expect((await res.json()).message).toContain('a thumbnail');
  });

  test('8. a draft stays hidden from students', async ({ page, request }) => {
    await openAsStudent(page, request);

    await page.goto('/courses/astronomy');
    await expect(page.getByRole('heading', { name: 'Course not found' })).toBeVisible();

    await goToHome(page);
    await expect(courseCard(page, 'Astronomy')).toHaveCount(0);
  });

  test('8b. an admin can preview the draft', async ({ page, request }) => {
    await openAsAdmin(page, request);
    await page.goto('/courses/astronomy');
    await expect(page.getByText('Students cannot see this page')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Astronomy/ }).first()).toBeVisible();
  });

  test('3. an own link opens instead of the course page, and removing it brings the page back', async ({ page, request }) => {
    await openAsAdmin(page, request);
    await openEditor(page, 'Robotics');
    await step(page, 'Card');
    await page.getByLabel('Own link').fill('/practicals');
    await saveDraft(page);

    const visitor = await newVisitorPage(page);
    await goToHome(visitor);
    await courseCard(visitor, 'Robotics').getByRole('button', { name: 'Explore' }).click();
    await expect(visitor).toHaveURL(/\/practicals/);

    await page.getByLabel('Own link').fill('');
    await saveDraft(page);

    const second = await newVisitorPage(page);
    await goToHome(second);
    await courseCard(second, 'Robotics').getByRole('button', { name: 'Explore' }).click();
    await expect(second).toHaveURL(/\/courses\/robotics/);
  });

  test('4. flags can be switched on and off, on the card and the page', async ({ page, request }) => {
    await openAsAdmin(page, request);
    await openEditor(page, 'Robotics');
    await step(page, 'Card');

    // Maths and Physics hold no flags, so MPC is free for this course
    await page.getByLabel('Most Bought').check();
    await page.getByLabel('Best Value').check();
    await saveDraft(page);

    const visitor = await newVisitorPage(page);
    await goToHome(visitor);
    const card = courseCard(visitor, 'Robotics');
    await expect(card.getByText('Most Bought')).toBeVisible();
    await expect(card.getByText('Best Value')).toBeVisible();

    await card.getByRole('button', { name: 'Explore' }).click();
    await expect(visitor.getByText('Most Bought').first()).toBeVisible();

    await page.getByLabel('Most Bought').uncheck();
    await saveDraft(page);

    const second = await newVisitorPage(page);
    await goToHome(second);
    await expect(courseCard(second, 'Robotics').getByText('Most Bought')).toHaveCount(0);
    await expect(courseCard(second, 'Robotics').getByText('Best Value')).toBeVisible();
  });

  test('5. a new price shows on the course page and the enrollment form', async ({ page, request }) => {
    await openAsAdmin(page, request);
    await openEditor(page, 'Robotics');
    await step(page, 'Card');
    await page.getByLabel(/^Price \(₹\)/).fill('449');
    await saveDraft(page);

    const visitor = await newVisitorPage(page);
    await visitor.goto('/courses/robotics');
    await expect(visitor.getByTestId('course-price')).toContainText('₹449');

    await visitor.getByRole('button', { name: 'Enroll Now' }).first().click();
    await expect(visitor.getByTestId('enrollment-price')).toHaveText('₹449');
  });

  test('6. an edited FAQ and hidden testimonials change the page', async ({ page, request }) => {
    await openAsAdmin(page, request);
    await openEditor(page, 'Robotics');

    await step(page, 'Page');
    await page.getByRole('button', { name: 'FAQs' }).click();
    await page.getByRole('button', { name: 'Add Question' }).click();
    await page.getByLabel('Question').fill('Do I need a kit?');
    await page.getByLabel('Answer').fill('No, every lesson uses free simulators.');
    await page.getByLabel(/^Heading/).fill('Robotics Questions');
    await saveDraft(page);

    const { course } = await api(request, 'GET', `/api/courses/robotics`);
    expect(course.page.faqs.items[0].q).toBe('Do I need a kit?');

    await api(request, 'PUT', `/api/admin/courses/${course._id}`, {
      page: {
        ...course.page,
        testimonials: { heading: 'Loved by Students', items: [{ name: 'A Student', comment: 'Very clear lessons' }] },
      },
    });

    const visitor = await newVisitorPage(page);
    await visitor.goto('/courses/robotics');
    await expect(visitor.getByRole('button', { name: 'Do I need a kit?' })).toBeVisible();
    await expect(visitor.getByRole('heading', { name: 'Loved by Students' })).toBeVisible();

    await api(request, 'PUT', `/api/admin/courses/${course._id}`, {
      sections: { ...course.sections, testimonials: false },
    });

    const second = await newVisitorPage(page);
    await second.goto('/courses/robotics');
    await expect(second.getByRole('button', { name: 'Do I need a kit?' })).toBeVisible();
    await expect(second.getByRole('heading', { name: 'Loved by Students' })).toHaveCount(0);
  });

  test('7. chapters import from a file, and a student plays a lesson in the new subject', async ({ page, request }) => {
    await openAsAdmin(page, request);
    await openEditor(page, 'Robotics');
    await step(page, 'Curriculum');

    await page.getByTestId('curriculum-file-input').setInputFiles(CHAPTERS_FILE);
    const preview = page.getByTestId('import-preview');
    await expect(preview).toContainText('Found 2 chapters and 3 topics');
    await expect(preview).toContainText('Row 5');
    await preview.getByRole('button', { name: 'Confirm Import' }).click();
    await expect(page.getByTestId('curriculum-chapter')).toHaveCount(2);

    // A video added through the Videos tab reaches the course by its subject
    const token = await getAdminToken(request);
    const created = await request.post(`${API_URL}/api/videos`, {
      data: { title: 'Welcome to Robotics', url: YOUTUBE_LINK, subject: 'Robotics', status: 'published' },
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(created.ok(), await created.text()).toBeTruthy();

    const visitor = await newVisitorPage(page);
    await visitor.goto('/courses/robotics');
    await expect(visitor.getByRole('heading', { name: 'Gears and Motors' })).toBeVisible();

    // A visitor is asked to sign in before watching
    await visitor.getByTestId('course-topic').filter({ hasText: 'Gears and Motors' }).getByRole('button', { name: 'Watch Now' }).click();
    await expect(visitor.getByRole('dialog', { name: 'Sign in required' })).toBeVisible();

    const student = await page.context().browser().newContext({ viewport: { width: 1366, height: 800 } });
    const studentPage = await student.newPage();
    await openAsStudent(studentPage, request);
    await studentPage.goto('/courses/robotics');

    await studentPage.getByRole('button', { name: /More Lessons/ }).click();
    await studentPage.getByTestId('course-topic').filter({ hasText: 'Welcome to Robotics' }).getByRole('button', { name: 'Watch Now' }).click();
    const player = studentPage.getByTestId('lesson-player');
    await expect(player).toBeVisible();
    await expect(player.locator('iframe')).toHaveAttribute('src', /youtube-nocookie\.com\/embed\/dQw4w9WgXcQ/);
    await student.close();
  });

  test('10. a new stream shows on the home page and in the menus', async ({ page, request }) => {
    await openAsAdmin(page, request);
    await goToCoursesTab(page);

    await page.getByRole('button', { name: 'Streams', exact: true }).click();
    await page.getByRole('button', { name: 'Add Stream' }).click();
    await page.getByLabel('Code').fill('STEM');
    await page.getByLabel(/^Name/).fill('Science and Technology');
    await page.getByLabel('Short name for menus').fill('Robotics, Coding');
    await page.getByRole('button', { name: 'Save Stream' }).click();
    await expect(page.getByText('Stream added')).toBeVisible();

    const visitor = await newVisitorPage(page);
    await goToHome(visitor);

    await expect(visitor.getByRole('button', { name: 'STEM', exact: true })).toBeVisible();
    await expect(visitor.getByRole('contentinfo').getByText('STEM (Robotics, Coding)')).toBeVisible();

    await visitor.getByRole('button', { name: 'Intermediate' }).first().hover();
    await expect(visitor.getByText('Robotics, Coding').first()).toBeVisible();
  });

  test('12. an enrollment raises the count with the right course and price', async ({ page, request }) => {
    const before = (await api(request, 'GET', '/api/admin/bookings/new-count')).count;

    const visitor = await newVisitorPage(page);
    await visitor.goto('/courses/robotics');
    await visitor.getByRole('button', { name: 'Enroll Now' }).first().click();

    await visitor.getByPlaceholder('e.g. Rahul Sharma').fill('Test Student');
    await visitor.getByPlaceholder('parent@example.com').fill('parent@mymarks.test');
    await visitor.getByPlaceholder('10-digit mobile number').fill('9000000002');
    await visitor.getByRole('button', { name: 'Send Enrollment Request' }).click();
    await expect(visitor.getByRole('heading', { name: /Request Received/ })).toBeVisible();

    expect((await api(request, 'GET', '/api/admin/bookings/new-count')).count).toBe(before + 1);

    await openAsAdmin(page, request);
    await page.goto('/admin');
    await expect(page.getByTestId('new-booking-count')).toHaveText(String(before + 1));

    await page.getByRole('button', { name: /Bookings & Inquiries/ }).first().click();
    const row = page.getByRole('row').filter({ hasText: 'Test Student' }).first();
    await expect(row).toContainText('Robotics');
    await expect(row).toContainText('₹449 at request');
  });

  test('moving a course changes the order on the website', async ({ page, request }) => {
    await openAsAdmin(page, request);
    await goToCoursesTab(page);

    const firstName = await page.getByTestId('admin-course-row').first().locator('span.font-bold').first().textContent();
    await page.getByRole('button', { name: 'Move Physics up' }).click();
    await expect(page.getByTestId('admin-course-row').first()).toContainText('Physics');
    expect(firstName).toBe('Mathematics');

    await expect(async () => {
      const { courses } = await (await request.get(`${API_URL}/api/courses`)).json();
      expect(courses[0].slug).toBe('physics');
    }).toPass();

    await page.getByRole('button', { name: 'Move Physics down' }).click();
    await expect(page.getByTestId('admin-course-row').first()).toContainText('Mathematics');
  });

  test('admin screens show skeletons while their data loads', async ({ page, request }) => {
    const slowly = async (route) => {
      await new Promise((done) => setTimeout(done, 1200));
      await route.continue();
    };
    await page.route('**/api/admin/stats', slowly);
    await page.route('**/api/admin/courses', slowly);

    await openAsAdmin(page, request);
    await page.goto('/admin');
    await expect(page.getByRole('status', { name: 'Loading admin data' })).toBeVisible();
    await expect(page.getByRole('status', { name: 'Loading admin data' })).toHaveCount(0, { timeout: 15000 });

    await page.getByRole('button', { name: 'Courses & Streams' }).first().click();
    await expect(page.getByRole('status', { name: 'Loading courses' })).toBeVisible();
    await expect(page.getByTestId('admin-course-row').first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('status', { name: 'Loading courses' })).toHaveCount(0);
  });

  test('archiving hides a course and keeps it in the admin panel', async ({ page, request }) => {
    await openAsAdmin(page, request);
    await goToCoursesTab(page);

    await page.getByRole('button', { name: 'Archive Robotics' }).click();
    await expect(page.getByText('Robotics is now archived')).toBeVisible();

    const res = await request.get(`${API_URL}/api/courses/robotics`);
    expect(res.status()).toBe(404);

    await page.getByLabel('Filter by status').selectOption('archived');
    await expect(page.getByRole('button', { name: 'Restore Robotics' })).toBeVisible();
  });
});
