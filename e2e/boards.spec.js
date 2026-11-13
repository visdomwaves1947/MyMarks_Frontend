import { test, expect } from '@playwright/test';
import { courseCard, goToHome, openAsAdmin, openAsStudent, openAsVisitor } from './helpers';

// The course list as if the admin had ticked Physics for Telangana only and Botany for no board.
// Changed in this page only, so the other tests keep the shared courses as they are.
const physicsForTelanganaOnly = async (page) => {
  await page.route('**/api/courses', async (route) => {
    const response = await route.fetch();
    const data = await response.json();
    data.courses = data.courses.map((course) => {
      if (course.subject === 'Physics') return { ...course, boards: ['Telangana'] };
      if (course.subject === 'Botany') return { ...course, boards: [] };
      return course;
    });
    await route.fulfill({ response, json: data });
  });
};

const labCard = (page, name) => page.getByRole('heading', { name: `${name} Lab & Practicals`, exact: true });
const labButton = (page, name) => page.getByRole('button', { name: new RegExp(`^${name}\\s*30M$`) });

test('a signed-in student sees only the subjects and labs of their board', async ({ page, request }) => {
  await physicsForTelanganaOnly(page);
  // The test student chose Andhra Pradesh Intermediate at sign-up
  await openAsStudent(page, request);
  await goToHome(page);

  await expect(page.getByTestId('board-pill')).toHaveText('Andhra Pradesh Intermediate Curriculum');
  await expect(courseCard(page, 'Chemistry')).toBeVisible();
  await expect(courseCard(page, 'Physics')).toHaveCount(0);
  // A course with no board ticked is for every board
  await expect(courseCard(page, 'Botany')).toBeVisible();

  await page.getByRole('button', { name: /Lab \/ Practicals/ }).click();
  await expect(labCard(page, 'Chemistry')).toBeVisible();
  await expect(labCard(page, 'Physics')).toHaveCount(0);

  // The labs page leaves the Physics lab out too, even when asked for it
  await page.goto('/practicals?subject=phy');
  await expect(labButton(page, 'Chemistry')).toBeVisible();
  await expect(labButton(page, 'Physics')).toHaveCount(0);
  await expect(page.getByText('Andhra Pradesh Intermediate Practical Curriculum')).toBeVisible();
});

test('visitors and administrators still see every subject and lab', async ({ page, request }) => {
  await physicsForTelanganaOnly(page);
  await openAsVisitor(page);
  await goToHome(page);
  await expect(courseCard(page, 'Physics')).toBeVisible();
  await expect(page.getByTestId('board-pill')).toHaveCount(0);
  await page.getByRole('button', { name: /Lab \/ Practicals/ }).click();
  await expect(labCard(page, 'Physics')).toBeVisible();

  const admin = await page.context().browser().newContext();
  try {
    const adminPage = await admin.newPage();
    await physicsForTelanganaOnly(adminPage);
    await openAsAdmin(adminPage, request);
    await goToHome(adminPage);
    await expect(courseCard(adminPage, 'Physics')).toBeVisible();
    await adminPage.goto('/practicals?subject=phy');
    await expect(labButton(adminPage, 'Physics')).toBeVisible();
  } finally {
    await admin.close();
  }
});
