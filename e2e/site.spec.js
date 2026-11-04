import { test, expect } from '@playwright/test';
import { API_URL, courseCard, expectNoSideScroll, goToHome, openAsAdmin, openAsStudent, openAsVisitor } from './helpers';

test.beforeEach(async ({ page }) => {
  await openAsVisitor(page);
});

test('the home page shows all 18 subjects in the set order', async ({ page }) => {
  await goToHome(page);
  await expect(page.getByTestId('course-card')).toHaveCount(18);
  await expect(page.getByRole('button', { name: 'All Subjects (18)' })).toBeVisible();
  await expect(page.getByTestId('course-card').first()).toContainText('Mathematics');
  await expectNoSideScroll(page);
});

test('stream filters show the right subjects', async ({ page }) => {
  await goToHome(page);

  await page.getByRole('button', { name: 'BiPC', exact: true }).click();
  await expect(page.getByTestId('course-card')).toHaveCount(4);
  await expect(courseCard(page, 'Botany')).toBeVisible();
  await expect(courseCard(page, 'Mathematics')).toHaveCount(0);

  await page.getByRole('button', { name: /Languages \(6\)/ }).click();
  await expect(page.getByTestId('course-card')).toHaveCount(6);
});

test('a link to a stream opens that stream', async ({ page }) => {
  await page.goto('/demo?group=mpc#courses');
  await expect(page.getByTestId('course-card')).toHaveCount(3);
});

test('lab practicals stay as they were', async ({ page }) => {
  await goToHome(page);
  await page.getByRole('button', { name: /Lab \/ Practicals/ }).click();
  await expect(page.getByTestId('course-card')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: /Geography/ }).first()).toBeVisible();
});

test('14. old addresses land on the new page', async ({ page }) => {
  for (const [address, slug] of [['/maths', 'maths'], ['/math', 'maths'], ['/phy', 'physics'], ['/english', 'english']]) {
    await page.goto(address);
    await expect(page).toHaveURL(new RegExp(`/courses/${slug}$`));
  }
});

test('old redirect addresses still reach the new page', async ({ page }) => {
  await page.goto('/accountancy');
  await expect(page).toHaveURL(/\/courses\/commerce$/);
});

test('a visitor can open a course page without signing in', async ({ page }) => {
  await goToHome(page);
  await courseCard(page, 'Physics').getByRole('button', { name: 'Explore' }).click();

  await expect(page).toHaveURL(/\/courses\/physics$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Master Physics');
  await expect(page.getByTestId('course-price')).toContainText('₹299');
  await expect(page.getByTestId('course-topic').first()).toBeVisible();
  await expectNoSideScroll(page);
});

test('every part of a course page is filled', async ({ page }) => {
  await page.goto('/courses/physics');

  await expect(page.getByRole('heading', { name: 'Why Students Choose Physics Learning Academy' })).toBeVisible();
  await expect(page.getByText('Master Physics Lab Experiments')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Physics Revision Roadmaps' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Loved by Students. Proven by Results.' })).toBeVisible();
  await expect(page.getByText('INTERACTIVE SIMULATIONS')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Everything You Need to Know About Physics' })).toBeVisible();

  await page.getByRole('button', { name: /Syllabus Modules/ }).click();
  await expect(page.getByRole('heading', { name: '1st Year Junior Intermediate Physics' })).toBeVisible();
});

test('the refund guarantee and result numbers carry over from the old page', async ({ page }) => {
  await page.goto('/courses/botany');
  await expect(page.getByRole('heading', { name: '100% Refund Guarantee' })).toBeVisible();
  await expect(page.getByText('Complete at least 3 timed mock exams')).toBeVisible();
  await expect(page.getByText('Live Hours Taught')).toBeVisible();

  await page.goto('/courses/physics');
  await expect(page.getByTestId('course-topic').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: '100% Refund Guarantee' })).toHaveCount(0);
});

test('a subject with modules but no lessons opens on its modules', async ({ page }) => {
  await page.goto('/courses/commerce');
  await expect(page.getByRole('heading', { name: '1st Year Junior Commerce' })).toBeVisible();
  await expect(page.getByText('Forms of Business Organizations')).toBeVisible();
});

test('a YouTube live link plays as a lesson', async ({ request }) => {
  const res = await request.get(`${API_URL}/api/courses/history`);
  const { curriculum } = await res.json();
  const lessons = curriculum.chapters.flatMap((chapter) => chapter.topics).map((topic) => topic.lesson?.youtubeId);
  expect(lessons).toContain('XF_dbbzXCOA');
});

test('the topic search finds subtopics deep in a chapter', async ({ page }) => {
  await page.goto('/courses/maths');
  await page.getByLabel('Search topics').fill('Meaning and Notation');
  await expect(page.getByTestId('course-topic').filter({ hasText: 'Meaning and Notation' }).first()).toBeVisible();
});

test('a topic card previews its subtopics', async ({ page }) => {
  await page.goto('/courses/maths');
  const card = page.getByTestId('course-topic').filter({ hasText: 'Interactive Syllabus' }).first();
  await expect(card).toContainText('Definition & Equality of Ordered Pairs');
  await expect(card).toContainText(/\d+ Subtopics/);
});

test('11. a roadmap opens the plan of its own course, and one with no plan hides its button', async ({ page }) => {
  await page.goto('/courses/maths');

  const roadmaps = page.getByTestId('course-roadmap');
  await expect(roadmaps).toHaveCount(6);
  await expect(page.getByRole('button', { name: 'Select Roadmap' })).toHaveCount(1);

  await page.getByRole('button', { name: 'Select Roadmap' }).click();
  await expect(page.getByText('Mathematics Academic Coach')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Algebra Basics & High-Yield Equations' })).toBeVisible();

  await page.goto('/courses/physics');
  await expect(page.getByTestId('course-roadmap').first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Select Roadmap' })).toHaveCount(0);
});

test('own-link subjects keep opening their lab pages', async ({ page }) => {
  await goToHome(page);
  await courseCard(page, 'Electronics').getByRole('button', { name: 'Explore' }).click();
  await expect(page).toHaveURL(/\/practicals\?subject=elec/);
});

test('the enrollment form opens with the course from the card', async ({ page }) => {
  await goToHome(page);
  await courseCard(page, 'Chemistry').getByRole('button', { name: 'Enroll' }).click();
  await expect(page.getByText('Enroll in Chemistry Course & Doubt Portal')).toBeVisible();
  await expect(page.getByTestId('enrollment-price')).toHaveText('₹299');
});

test('a course page sets its title and description', async ({ page }) => {
  await page.goto('/courses/physics');
  await expect(page).toHaveTitle('Physics | MyMarks');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Physics | MyMarks');
});

test('13. a shared link gives WhatsApp the course name and image', async ({ request }) => {
  const res = await request.get(`${API_URL}/share/courses/physics`, {
    headers: { 'User-Agent': 'WhatsApp/2.23' },
  });
  expect(res.ok()).toBeTruthy();

  const html = await res.text();
  expect(html).toContain('<meta property="og:title" content="Physics | MyMarks">');
  expect(html).toContain('<meta property="og:image" content="https://site.test/books/physics.jpg">');
});

test('the sitemap lists published course pages', async ({ request }) => {
  const res = await request.get(`${API_URL}/sitemap.xml`);
  const xml = await res.text();
  expect(xml).toContain('https://site.test/courses/physics');
  expect(xml).not.toContain('courses/electronics');
});

test('the menu lists streams and languages from the database', async ({ page, isMobile }) => {
  test.skip(isMobile, 'The phone menu is covered below');

  await goToHome(page);
  await page.getByRole('button', { name: 'Intermediate' }).first().hover();
  await expect(page.getByText('Maths, Physics, Chem').first()).toBeVisible();

  await page.getByRole('link', { name: 'Telugu' }).first().click();
  await expect(page).toHaveURL(/\/courses\/telugu$/);
});

test('the phone menu opens and reaches a course', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Only for the phone layout');

  await goToHome(page);
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.getByRole('button', { name: 'Intermediate', exact: true }).click();
  await page.getByRole('link', { name: 'Telugu' }).first().click();
  await expect(page).toHaveURL(/\/courses\/telugu$/);
  await expectNoSideScroll(page);
});

test('the API being down gives a retry message, not sample content', async ({ page }) => {
  await page.route('**/api/courses**', (route) => route.abort());
  await page.route('**/api/streams**', (route) => route.abort());

  await page.goto('/demo#courses');
  await expect(page.getByText('We could not load the courses')).toBeVisible();
  await expect(page.getByTestId('course-card')).toHaveCount(0);

  await page.unroute('**/api/courses**');
  await page.unroute('**/api/streams**');
  await page.getByRole('button', { name: 'Try Again' }).click();
  await expect(page.getByTestId('course-card')).toHaveCount(18);
});

test('a course page also offers a retry', async ({ page }) => {
  await page.route('**/api/courses/physics', (route) => route.abort());
  await page.goto('/courses/physics');
  await expect(page.getByRole('heading', { name: 'We could not load this course' })).toBeVisible();

  await page.unroute('**/api/courses/physics');
  await page.getByRole('button', { name: 'Try Again' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Master Physics');
});

test('the old page keeps working if a course is not published', async ({ page }) => {
  await page.route('**/api/courses', async (route) => {
    const response = await route.fetch();
    const body = await response.json();
    await route.fulfill({
      response,
      json: { ...body, courses: body.courses.filter((course) => course.slug !== 'history') },
    });
  });

  await page.goto('/history');
  await expect(page).toHaveURL(/\/history$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('a signed-in student plays a free lesson', async ({ page, request, browser, isMobile }) => {
  const context = await browser.newContext(isMobile ? { viewport: { width: 412, height: 839 } } : {});
  const studentPage = await context.newPage();
  await openAsStudent(studentPage, request);

  await studentPage.goto('/courses/physics');
  await studentPage.getByTestId('course-topic').first().getByRole('button', { name: /Watch Lecture/ }).click();

  const player = studentPage.getByTestId('lesson-player');
  await expect(player).toBeVisible();
  await expect(player.locator('iframe')).toHaveAttribute('src', /youtube-nocookie\.com\/embed\//);

  const title = player.getByRole('heading', { level: 1 });
  const first = await title.textContent();
  await player.getByRole('button', { name: /Next Lesson/ }).click();
  await expect(title).not.toHaveText(first);
  await expect(player.locator('[data-playing="true"]')).toContainText(await title.textContent());

  await studentPage.keyboard.press('Escape');
  await expect(player).toHaveCount(0);
  await context.close();
});

test('the lecture player lists the subtopics of the opened topic', async ({ request, browser, isMobile }) => {
  const context = await browser.newContext(isMobile ? { viewport: { width: 412, height: 839 } } : {});
  const studentPage = await context.newPage();
  await openAsStudent(studentPage, request);

  await studentPage.goto('/courses/maths');
  await studentPage.getByTestId('course-topic').filter({ hasText: 'Interactive Syllabus' }).first()
    .getByRole('button', { name: /Watch Lecture/ }).click();

  const hierarchy = studentPage.getByRole('complementary', { name: 'Topic hierarchy' });
  await expect(hierarchy).toContainText('14 Lessons');
  await expect(hierarchy).toContainText('Definition & Equality of Ordered Pairs');

  await hierarchy.getByTestId('syllabus-node').filter({ hasText: 'Cartesian Product' }).first().click();
  await expect(studentPage.getByTestId('lesson-player').getByRole('heading', { level: 1 })).toHaveText('Cartesian Product');
  await expect(hierarchy.locator('[data-playing="true"]')).toContainText('Cartesian Product');
  await expectNoSideScroll(studentPage);
  await context.close();
});

test('profile cards and the video filter come from the courses', async ({ page, request, browser, isMobile }) => {
  const context = await browser.newContext(isMobile ? { viewport: { width: 412, height: 839 } } : {});
  const studentPage = await context.newPage();
  await openAsStudent(studentPage, request);

  await studentPage.goto('/profile');
  await expect(studentPage.getByRole('button', { name: /Mathematics/ }).first()).toBeVisible();
  await expect(studentPage.getByRole('button', { name: /Commerce/ }).first()).toBeVisible();
  await context.close();
});

test('the admin course list works on this screen size', async ({ page, request }) => {
  await openAsAdmin(page, request);
  await page.goto('/admin');
  await page.waitForLoadState('networkidle');
  await expectNoSideScroll(page);
});
