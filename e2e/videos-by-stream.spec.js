import { test, expect } from '@playwright/test';
import { API_URL, getAdminToken, openAsAdmin } from './helpers';

test.describe.configure({ mode: 'serial' });

const YOUTUBE = 'https://www.youtube.com/watch?v=aqz-KE-bpKQ';
const SUBJECT = 'Statistics';
const TITLES = ['Dice Games', 'Regression Basics', 'Draft Lesson', 'Stream Test Orientation', 'Sample Spaces'];
let courseId;

const headersFor = async (request) => ({ Authorization: `Bearer ${await getAdminToken(request)}` });

// A course whose syllabus has typed YouTube links, like the language courses, plus Lesson Studio videos
test.beforeAll(async ({ request }) => {
  const headers = await headersFor(request);
  const streams = await (await request.get(`${API_URL}/api/admin/streams`, { headers })).json();
  const mpc = streams.streams.find((stream) => stream.code === 'MPC');

  const created = await request.post(`${API_URL}/api/admin/courses`, {
    headers,
    data: {
      name: SUBJECT,
      subject: SUBJECT,
      streams: [mpc._id],
      shortDescription: 'Data, chance and averages.',
      thumbnail: 'https://images.example.com/statistics.jpg',
      price: 199,
      oldPrice: 499,
    },
  });
  expect(created.ok(), await created.text()).toBeTruthy();
  courseId = (await created.json()).course._id;
  const published = await request.patch(`${API_URL}/api/admin/courses/${courseId}/status`, { headers, data: { status: 'published' } });
  expect(published.ok(), await published.text()).toBeTruthy();

  const syllabus = await request.put(`${API_URL}/api/admin/courses/${courseId}/curriculum`, {
    headers,
    data: {
      chapters: [
        {
          number: '9',
          name: 'Probability',
          topics: [
            {
              code: '9.1',
              title: 'Random Experiments',
              youtubeUrl: YOUTUBE,
              children: [{ code: '9.1.1', title: 'Coin Tosses', youtubeUrl: YOUTUBE }],
            },
          ],
        },
      ],
    },
  });
  expect(syllabus.ok(), await syllabus.text()).toBeTruthy();

  const shared = { type: 'youtube', url: YOUTUBE, status: 'published', year: '1st Year', board: 'Both Boards', subject: SUBJECT };
  const videos = [
    // Goes into chapter 9 as topic 9.2
    { title: 'Dice Games', uploadLevel: 'topic', code: '9.2', chapterNumber: 9, chapterName: 'Probability', topicNumber: '9.2', topicName: 'Dice Games' },
    // Chapter 12 is not in the syllabus, so the page lists it under More Lessons
    { title: 'Regression Basics', uploadLevel: 'chapter', code: '12', chapterNumber: 12, chapterName: 'Regression' },
    // Drafts are not on the page
    { title: 'Draft Lesson', uploadLevel: 'topic', code: '9.5', chapterNumber: 9, chapterName: 'Probability', topicNumber: '9.5', topicName: 'Draft Lesson', status: 'draft' },
    // A subject with no course page
    { title: 'Stream Test Orientation', subject: 'Orientation', uploadLevel: 'chapter', chapterNumber: 1 },
  ];
  for (const video of videos) {
    const res = await request.post(`${API_URL}/api/videos`, { headers, data: { ...shared, ...video } });
    expect(res.ok(), await res.text()).toBeTruthy();
  }
});

// The site tests on phones run after this file and count courses and published videos
test.afterAll(async ({ request }) => {
  const headers = await headersFor(request);
  const res = await request.get(`${API_URL}/api/videos?limit=500&status=all`, { headers });
  const { data = [] } = await res.json();
  for (const video of data.filter((item) => TITLES.includes(item.title))) {
    await request.delete(`${API_URL}/api/videos/${video._id || video.id}`, { headers });
  }
  if (courseId) await request.patch(`${API_URL}/api/admin/courses/${courseId}/status`, { headers, data: { status: 'archived' } });
});

// Drafts can repeat a chapter in their own group below, so look at the page's own tree
const coursePage = (page) =>
  page.getByRole('region', { name: 'Topic hierarchy' }).getByRole('group', { name: 'Course page', exact: true });

const openSubject = async (page) => {
  await page.goto('/admin/videos');
  const folders = page.getByRole('region', { name: 'Videos by stream' });
  await folders.getByTestId('stream-folder').filter({ hasText: 'MPC' }).click();
  const card = folders.getByTestId('stream-subject').filter({ hasText: SUBJECT });
  return { folders, card };
};

test('a subject shows its course page, typed syllabus links included', async ({ page, request }) => {
  await openAsAdmin(page, request);
  const { folders, card } = await openSubject(page);

  // Typed links count as lessons, so a language-style course no longer shows 0
  await expect(card.getByTestId('subject-summary')).toHaveText('4 lessons · 1 chapter');
  await expect(card).toContainText('2 YouTube links typed in the syllabus');
  await card.click();

  const tree = page.getByRole('region', { name: 'Topic hierarchy' });
  await expect(tree).toContainText('4 Lessons');
  const chapter = coursePage(page).getByTestId('stream-chapter').filter({ hasText: 'Probability' });
  await expect(chapter).toHaveAttribute('data-videos', '3');
  await expect(chapter.getByText('Coin Tosses', { exact: true })).toBeVisible();
  await expect(chapter.getByText('9.1.1', { exact: true })).toBeVisible();
  await expect(chapter.getByText('In syllabus')).toHaveCount(2);
  await expect(chapter.getByText('Dice Games', { exact: true })).toBeVisible();
  await expect(chapter.getByText('9.2', { exact: true })).toBeVisible();

  await expect(tree.getByTestId('more-lessons')).toContainText('Regression Basics');
  await expect(tree.getByRole('group', { name: /Not on the course page/ })).toContainText('Draft Lesson');

  await tree.getByRole('button', { name: '− Collapse All' }).click();
  await expect(chapter.getByText('Coin Tosses', { exact: true })).toBeHidden();
  await tree.getByRole('button', { name: '+ Expand All' }).click();
  await expect(chapter.getByText('Coin Tosses', { exact: true })).toBeVisible();

  // Search finds a lesson and says where it is
  await tree.getByLabel('Search lessons').fill('coin');
  await expect(tree.getByTestId('lesson-node')).toHaveCount(1);
  await expect(tree).toContainText('Course page / 9 Probability / 9.1 Random Experiments');
  await tree.getByLabel('Clear lesson search').click();

  // The breadcrumb goes back up, and a subject with no course has its own folder
  await page.getByRole('navigation', { name: 'Video folders' }).getByRole('button', { name: 'All Streams' }).click();
  await folders.getByTestId('stream-folder').filter({ hasText: 'Not in a Course' }).click();
  await expect(folders.getByTestId('stream-subject').filter({ hasText: 'Orientation' })).toBeVisible();
});

test('editing a typed link opens that lesson in the course syllabus', async ({ page, request }) => {
  await openAsAdmin(page, request);
  const { card } = await openSubject(page);
  await card.click();

  await page.getByRole('button', { name: 'Edit Coin Tosses in the course syllabus' }).click();
  await expect(page.getByLabel('YouTube link')).toHaveValue(YOUTUBE);
  await expect(page.getByLabel('Title')).toHaveValue('Coin Tosses');
});

test('adding a topic fills in the Lesson Studio, and the video lands in the chapter', async ({ page, request }) => {
  await openAsAdmin(page, request);
  const { card } = await openSubject(page);
  await card.click();

  const chapter = coursePage(page).getByTestId('stream-chapter').filter({ hasText: 'Probability' });
  await chapter.getByRole('button', { name: 'Add Topic', exact: true }).click();

  // The studio already knows the subject, the chapter and the next topic number
  await expect(page.getByPlaceholder('Chapter Name (e.g. FUNCTION / Thermodynamics)')).toHaveValue('Probability');
  await expect(page.getByPlaceholder('1.0', { exact: true })).toHaveValue('9.3');
  await expect(page.locator('select').filter({ hasText: 'General / Platform Demo' })).toHaveValue(SUBJECT);

  await page.getByPlaceholder(/^Topic Name/).fill('Sample Spaces');
  // Chapter, topic, subtopic and sub-subtopic each have one
  await page.getByRole('button', { name: 'YouTube URL', exact: true }).nth(1).click();
  await page.getByPlaceholder(/youtube\.com\/watch/).fill(YOUTUBE);
  await page.getByRole('button', { name: 'Attach Video', exact: true }).click();
  await page.getByText('Publish Video / Lesson').click();

  // The course page now has it as topic 9.3
  await expect(chapter).toHaveAttribute('data-videos', '4');
  await expect(chapter.getByText('Sample Spaces', { exact: true })).toBeVisible();
  await expect(chapter.getByText('9.3', { exact: true })).toBeVisible();
});
