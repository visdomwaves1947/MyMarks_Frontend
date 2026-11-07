import { test, expect } from '@playwright/test';
import {
  API_URL,
  courseCard,
  expectNoSideScroll,
  getAdminToken,
  goToHome,
  openAsAdmin,
  openAsStudent,
  openAsVisitor,
} from './helpers';

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
  const res = await request.get(`${API_URL}/api/courses/history`, {
    headers: { Authorization: `Bearer ${await getAdminToken(request)}` },
  });
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

test('the enrollment form fills in a signed-in student\'s details, and stays empty for a visitor', async ({ page, request, browser, isMobile }) => {
  // Two browsers each open the home page and wait for it to scroll, which takes a while
  test.setTimeout(90000);
  const name = (target) => target.getByPlaceholder('e.g. Rahul Sharma');
  // On phones the form sits behind its own tab
  const openForm = async (target) => {
    if (isMobile) await target.getByRole('button', { name: /^Enrollment Form/ }).click();
  };
  const grade = (target) => target.locator('select').filter({ has: target.locator('option', { hasText: 'Junior Inter' }) });

  await goToHome(page);
  await courseCard(page, 'Chemistry').getByRole('button', { name: 'Enroll' }).click();
  await openForm(page);
  await expect(name(page)).toHaveValue('');
  await expect(page.getByPlaceholder('parent@example.com')).toHaveValue('');
  await expect(page.getByTestId('booking-filled')).toHaveCount(0);

  const context = await browser.newContext(isMobile ? { viewport: { width: 412, height: 839 } } : {});
  const student = await context.newPage();
  await openAsStudent(student, request);
  await goToHome(student);
  await courseCard(student, 'Chemistry').getByRole('button', { name: 'Enroll' }).click();
  await openForm(student);
  await expect(student.getByTestId('booking-filled')).toBeVisible();
  await expect(name(student)).toHaveValue('E2E Student');
  await expect(student.getByPlaceholder('parent@example.com')).toHaveValue(process.env.E2E_STUDENT_EMAIL);
  await expect(student.getByPlaceholder('10-digit mobile number')).toHaveValue('9000000001');
  await expect(grade(student)).toHaveValue('Intermediate 1st Year (Junior Inter)');

  // What the student changes is kept when the form opens again
  await name(student).fill('Ravi Kumar');
  await student.getByRole('button', { name: 'Close dialog' }).first().click();
  await courseCard(student, 'Physics').getByRole('button', { name: 'Enroll' }).click();
  await openForm(student);
  await expect(name(student)).toHaveValue('Ravi Kumar');
  await expect(student.getByPlaceholder('10-digit mobile number')).toHaveValue('9000000001');
  await context.close();
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
  // Maths is sold online, so most of its lessons are locked for students; the admin sees them all
  await openAsAdmin(studentPage, request);

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

test('the profile shows the student details, a few subjects below them, and no video list', async ({ page, request, browser, isMobile }) => {
  const context = await browser.newContext(isMobile ? { viewport: { width: 412, height: 839 } } : {});
  const studentPage = await context.newPage();
  await openAsStudent(studentPage, request);

  await studentPage.goto('/profile');
  await expect(studentPage.getByRole('heading', { level: 1, name: 'E2E Student' })).toBeVisible();
  await expect(studentPage.getByText(process.env.E2E_STUDENT_EMAIL).first()).toBeVisible();
  await expect(studentPage.getByText('Academic & College Credentials')).toBeVisible();
  // The college shows in the credentials card, and on wider screens also on the cover
  await expect(studentPage.getByText('E2E College').filter({ visible: true }).first()).toBeVisible();

  const subjects = studentPage.getByTestId('profile-subjects');
  await expect(subjects.getByRole('button', { name: /Mathematics/ })).toBeVisible();
  await expect(subjects.getByRole('button')).toHaveCount(8);
  await expect(subjects.getByRole('link', { name: 'See all subjects' })).toHaveAttribute('href', '/demo#courses');

  // The lesson videos live on the course pages, not on the profile
  await expect(studentPage.getByText('Curriculum Video Lectures & Masterclasses')).toHaveCount(0);
  await expectNoSideScroll(studentPage);
  await context.close();
});

test('a student signs out from the navbar on any page, and the profile has one Log Out', async ({ request, browser, isMobile }) => {
  const context = await browser.newContext(isMobile ? { viewport: { width: 412, height: 839 } } : {});
  const studentPage = await context.newPage();
  await openAsStudent(studentPage, request);

  await studentPage.goto('/profile');
  await expect(studentPage.getByRole('heading', { level: 1, name: 'E2E Student' })).toBeVisible();
  await expect(studentPage.getByRole('button', { name: /^Log Out/ })).toHaveCount(1);

  await studentPage.goto('/courses/maths');
  await expect(studentPage.getByTestId('course-roadmap').first()).toBeAttached();
  if (isMobile) {
    await studentPage.getByRole('button', { name: 'Open Menu' }).click();
    await studentPage.getByRole('button', { name: 'Sign Out', exact: true }).click();
  } else {
    await studentPage.getByRole('button', { name: 'Sign Out', exact: true }).click();
  }

  // It asks first, then signs the student out
  const dialog = studentPage.getByRole('alertdialog');
  await expect(dialog).toContainText('Sign out?');
  await dialog.getByRole('button', { name: 'Sign Out' }).click();
  await expect.poll(() => studentPage.evaluate(() => localStorage.getItem('mla_user'))).toBeNull();
  await expect(studentPage.getByRole('button', { name: 'Sign Out', exact: true })).toHaveCount(0);
  await context.close();
});

// How visible the sign-in card is: its own opacity times that of everything around it
const cardOpacity = (page) =>
  page.evaluate(() => {
    let opacity = 1;
    for (let element = document.querySelector('[data-testid="auth-card"]'); element; element = element.parentElement) {
      opacity *= Number(getComputedStyle(element).opacity);
    }
    return opacity;
  });

// The lowest that visibility gets over the next 1.2 seconds, sampled every frame
const lowestCardOpacity = (page) =>
  page.evaluate(async () => {
    const card = document.querySelector('[data-testid="auth-card"]');
    let lowest = 1;
    const started = performance.now();
    while (performance.now() - started < 1200) {
      let opacity = 1;
      for (let element = card; element; element = element.parentElement) {
        opacity *= Number(getComputedStyle(element).opacity);
      }
      lowest = Math.min(lowest, opacity);
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    return lowest;
  });

test('signing in with a password shows a welcome, then fades back into the page it came from', async ({ page }) => {
  await page.goto('/courses/physics');
  await page.getByRole('button', { name: 'Sign In / Sign Up' }).first().click();
  await expect(page).toHaveURL(/\/signin/);
  await page.getByPlaceholder('Enter 10-digit mobile or email address').fill(process.env.E2E_STUDENT_EMAIL);
  await page.getByPlaceholder('Enter password (min 6 characters)').fill(process.env.E2E_STUDENT_PASSWORD);
  await page.getByRole('button', { name: /continue with password/i }).click();

  const welcome = page.getByTestId('auth-welcome');
  await expect(welcome).toContainText('Welcome back, E2E!');
  await expect(welcome).toContainText('Taking you back to the course');
  // The course page comes back behind it, signed in, as the sign-in page fades away
  await expect(page).toHaveURL(/\/courses\/physics$/);
  await expect(page.getByTestId('auth-page')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Account menu' })).toBeVisible();
  await expectNoSideScroll(page);
});

test('a wrong sign-in or an incomplete sign-up shakes the card without it closing and opening again', async ({ page }) => {
  await page.goto('/signin');
  const card = page.getByTestId('auth-card');
  await expect(card).toBeVisible();
  // The card fades in once when it opens; measure only after that
  await expect.poll(() => cardOpacity(page)).toBeGreaterThan(0.99);

  await page.getByPlaceholder('Enter 10-digit mobile or email address').fill('nobody@mymarks.test');
  await page.getByPlaceholder('Enter password (min 6 characters)').fill('wrong-password');
  await page.getByRole('button', { name: /continue with password/i }).click();
  // The card shakes as the message appears; watch it from then on
  await expect(page.getByText('Invalid credentials')).toBeVisible();
  expect(await lowestCardOpacity(page)).toBeGreaterThan(0.95);

  await page.getByRole('button', { name: 'Sign Up/Register' }).click();
  await expect(page.getByRole('button', { name: 'Next Step' })).toBeVisible();
  await expect.poll(() => cardOpacity(page)).toBeGreaterThan(0.99);
  await page.getByRole('button', { name: 'Next Step' }).click();
  expect(await lowestCardOpacity(page)).toBeGreaterThan(0.95);
  await expect(card).toBeVisible();
});

test("the administrator's avatar opens a menu with their profile and the admin panel", async ({ page, request }) => {
  await openAsAdmin(page, request);
  await page.goto('/demo');

  const avatar = page.getByRole('button', { name: 'Account menu' });
  await avatar.click();
  const menu = page.getByRole('menu', { name: 'Account' });
  await expect(menu).toContainText('Administrator');
  await expect(menu.getByRole('menuitem')).toHaveText(['View Profile', 'Admin Panel']);

  // Escape closes it, and View Profile opens the administrator's own profile
  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
  await avatar.click();
  await menu.getByRole('menuitem', { name: 'View Profile' }).click();
  // The same profile page students see, with the administrator's name
  await expect(page).toHaveURL(/\/profile/);
  await expect(page.getByRole('heading', { name: 'MyMarks Administrator' })).toBeVisible();
  await expect(page.getByText('Account Management')).toBeVisible();

  await page.getByRole('button', { name: 'Account menu' }).click();
  await page.getByRole('menu', { name: 'Account' }).getByRole('menuitem', { name: 'Admin Panel' }).click();
  await expect(page).toHaveURL(/\/admin/);
});

test('in the admin panel the avatar opens View Profile, View Website and Sign Out, like on the website', async ({ page, request, isMobile }) => {
  await openAsAdmin(page, request);
  await page.goto('/admin');

  const avatar = page.getByRole('button', { name: 'Account menu' });
  await avatar.click();
  const menu = page.getByRole('menu', { name: 'Account' });
  await expect(menu).toContainText('MyMarks Administrator');
  await expect(menu.getByRole('menuitem')).toHaveText(['View Profile', 'View Website', 'Sign Out']);
  // The whole menu shows, below the avatar and inside the screen
  const box = await menu.boundingBox();
  const avatarBox = await avatar.boundingBox();
  const width = page.viewportSize().width;
  expect(box.y).toBeGreaterThan(avatarBox.y + avatarBox.height - 1);
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(width);

  // Escape and a click outside close it
  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
  await avatar.click();
  await expect(menu).toBeVisible();
  await page.mouse.click(5, page.viewportSize().height - 5);
  await expect(menu).toHaveCount(0);

  // View Profile opens the same profile page students see
  await avatar.click();
  await menu.getByRole('menuitem', { name: 'View Profile' }).click();
  await expect(page).toHaveURL(/\/profile/);
  await expect(page.getByRole('heading', { name: 'MyMarks Administrator' })).toBeVisible();

  await page.goto('/admin');
  await avatar.click();
  await menu.getByRole('menuitem', { name: 'View Website' }).click();
  await expect(page).toHaveURL(/\/demo/);

  // On a phone the profile row in the menu drawer opens the profile too
  if (isMobile) {
    await page.goto('/admin');
    await page.getByRole('button', { name: 'Open Navigation Menu' }).click();
    await page.getByRole('button', { name: /View Profile/ }).click();
    await expect(page).toHaveURL(/\/profile/);
    await page.goto('/admin');
  }

  await page.goto('/admin');
  await avatar.click();
  await menu.getByRole('menuitem', { name: 'Sign Out' }).click();
  await expect(page).not.toHaveURL(/\/admin/);
});

test('Get Started signs a visitor up, and takes a signed-in student on to the subjects', async ({ page, request }) => {
  await page.goto('/demo');
  await page.getByTestId('how-to-use-start').click();
  await expect(page).toHaveURL(/\/signup/);

  await openAsStudent(page, request);
  await page.goto('/demo');
  await page.getByTestId('how-to-use-start').click();
  await expect(page.locator('#courses')).toBeInViewport();
  await expect(page).toHaveURL(/\/demo/);
});

test('the admin course list works on this screen size', async ({ page, request }) => {
  await openAsAdmin(page, request);
  await page.goto('/admin');
  await page.waitForLoadState('networkidle');
  await expectNoSideScroll(page);
});
