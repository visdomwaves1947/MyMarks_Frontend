import { test, expect } from '@playwright/test';
import { API_URL, getAdminToken, newVisitorPage, closeVisitorPages, openAsAdmin, openAsStudent, signInStudent } from './helpers';
import { fakeYouTube, heard, play, sound } from './fakeYouTube';

// Study roadmaps made of video parts: the admin picks lessons from the syllabus for each day and sets the
// stretch of each video with its summary; students play only those stretches. Zoology and Telugu are used only here.

test.afterEach(closeVisitorPages);

const headersFor = async (request) => ({ Authorization: `Bearer ${await getAdminToken(request)}` });

// Summary videos made by a test, removed with their highlights and reels after it
const madeVideos = [];
test.afterEach(async ({ request }) => {
  if (madeVideos.length === 0) return;
  const headers = await headersFor(request);
  const { reels = [], clips = [] } = await (await request.get(`${API_URL}/api/admin/highlights?subject=Zoology`, { headers })).json();
  for (const reel of reels) await request.delete(`${API_URL}/api/admin/highlight-reels/${reel._id}`, { headers });
  for (const clip of clips) await request.delete(`${API_URL}/api/admin/highlights/${clip._id}`, { headers });
  for (const id of madeVideos.splice(0)) await request.delete(`${API_URL}/api/videos/${id}`, { headers });
});

// The page opens with no subject chosen, and the subject list has a search box
const openRoadmapsFor = async (page, request, name) => {
  await openAsAdmin(page, request);
  await page.goto('/admin/roadmaps');
  await expect(page.getByRole('heading', { name: 'Study Roadmaps' })).toBeVisible();
  await page.getByRole('button', { name: /^Subject/ }).click();
  await page.getByLabel('Search subjects').fill(name.slice(0, 4));
  await page.getByRole('option', { name: new RegExp(`^${name}`) }).click();
  await expect(page.getByTestId('admin-roadmap').first()).toBeVisible();
};

// The course's lesson videos as the admin sees them (every lesson open), in syllabus order
const lessonsOf = async (request, slug) => {
  const res = await request.get(`${API_URL}/api/courses/${slug}`, { headers: await headersFor(request) });
  const { course, curriculum } = await res.json();
  const nodes = [];
  const visit = (node, chapter) => {
    if (node.lesson?.youtubeId) nodes.push({ nodeId: node.nodeId, title: node.title, code: node.code, youtubeId: node.lesson.youtubeId, chapter });
    (node.children || []).forEach((child) => visit(child, chapter));
  };
  curriculum.chapters.forEach((chapter) => (chapter.topics || []).forEach((topic) => visit(topic, chapter.name)));
  return { course, nodes };
};

const part = (lesson, start, end, summary, points = []) => ({
  time: '',
  title: `${lesson.code} ${lesson.title}`.trim(),
  desc: '',
  resources: [{ kind: 'part', text: `${lesson.code} ${lesson.title}`.trim(), nodeId: lesson.nodeId, start, end, summary, points }],
});

// Adds a roadmap through the admin API, keeping the course's other roadmaps
const addRoadmapByApi = async (request, course, roadmap) => {
  const headers = await headersFor(request);
  const current = await (await request.get(`${API_URL}/api/admin/courses/${course._id}/roadmaps`, { headers })).json();
  const items = current.roadmaps.items.filter((item) => item.title !== roadmap.title && item.days.length !== roadmap.days.length);
  const saved = await request.put(`${API_URL}/api/admin/courses/${course._id}/roadmaps`, {
    headers,
    data: { ...current.roadmaps, isShown: true, items: [...items, roadmap] },
  });
  expect(saved.ok(), await saved.text()).toBeTruthy();
  return (await saved.json()).roadmaps.items.find((item) => item.title === roadmap.title);
};

const openPlan = async (page, slug, title) => {
  await page.goto(`/courses/${slug}`);
  const card = page.getByTestId('course-roadmap').filter({ hasText: title });
  await card.scrollIntoViewIfNeeded();
  await card.getByRole('button', { name: 'Select Roadmap' }).click();
  await expect(page.getByText('Smart Exam Planner')).toBeVisible();
};

test('an admin plans a 10 day roadmap from the summaries under each subtopic, and cuts parts of videos with none, never whole videos', async ({ page, request }, testInfo) => {
  test.skip(testInfo.project.name === 'phone', 'The admin panel is used on a laptop');
  await fakeYouTube(page);

  // A summary of the first Zoology lesson, made in Highlights: 1:00 to 1:20 of its video, with its summary.
  // Its video record stays a draft, so the course gets no extra lesson.
  const adminHeaders = await headersFor(request);
  const { nodes } = await lessonsOf(request, 'zoology');
  const made = await request.post(`${API_URL}/api/videos`, {
    headers: adminHeaders,
    data: { title: 'Zoology summary source', url: `https://www.youtube.com/watch?v=${nodes[0].youtubeId}`, subject: 'Zoology', status: 'draft' },
  });
  expect(made.ok(), await made.text()).toBeTruthy();
  const madeBody = await made.json();
  const videoId = (madeBody.data || madeBody.video || madeBody)._id;
  madeVideos.push(videoId);
  const highlight = await request.post(`${API_URL}/api/admin/highlights`, {
    headers: adminHeaders,
    data: {
      videoId,
      start: '1:00',
      end: '1:20',
      title: 'Cells at a glance',
      summary: 'Every living thing is made of cells.',
      points: ['Cell theory'],
      newReel: { name: 'Zoology summaries' },
    },
  });
  expect(highlight.ok(), await highlight.text()).toBeTruthy();

  await openRoadmapsFor(page, request, 'Zoology');

  // 1 Day and 30 Days are taken by Zoology's own roadmaps; 10 Days opens the new roadmap's page
  const adding = page.getByRole('group', { name: 'Add a roadmap' });
  await expect(adding.getByRole('button', { name: '1 Day', exact: true })).toBeDisabled();
  await expect(adding.getByRole('button', { name: '2 Days', exact: true })).toBeEnabled();
  await adding.getByRole('button', { name: '10 Days', exact: true }).click();
  const roadmap = page.getByTestId('roadmap-page');
  await expect(roadmap).toBeVisible();
  await roadmap.getByRole('textbox', { name: /^Title/ }).fill('10 Days Zoology Sprint');
  await expect(roadmap.getByRole('tablist', { name: 'Days' }).getByRole('tab')).toHaveCount(10);

  // Day 1: the picker lists the summaries under each subtopic, and shows only summaries at first
  await roadmap.getByRole('button', { name: 'Add summaries from the syllabus' }).click();
  const picker = page.getByTestId('syllabus-picker');
  const onlySummaries = picker.getByRole('switch', { name: 'Only summaries' });
  await expect(onlySummaries).toHaveAttribute('aria-checked', 'true');
  const summary = picker.getByTestId('picker-summary').filter({ hasText: 'Cells at a glance' });
  await expect(summary).toHaveCount(1);
  await expect(summary.getByTestId('picker-summary-times')).toContainText('1:00–1:20 · 20 sec only');
  await expect(summary.getByTestId('picker-summary-text')).toHaveText('Every living thing is made of cells.');
  await summary.getByRole('checkbox').click();
  await expect(picker.getByTestId('picker-count')).toHaveText('Ticked: 1 summary');
  await picker.getByRole('button', { name: 'Add 1 to Day 1' }).click();
  const parts = roadmap.getByTestId('roadmap-part');
  await expect(parts).toHaveCount(1);
  // A summary comes in ready: only its stretch plays, with its summary
  await expect(parts.first().getByTestId('part-times')).toHaveText('1:00–1:20 · 20 sec');

  // Videos with no summary yet: with "Only summaries" off a whole chapter is ticked, leaving out the summary already in the day
  await roadmap.getByRole('button', { name: 'Add summaries from the syllabus' }).click();
  await expect(summary.getByText('In Day 1')).toBeVisible();
  await onlySummaries.click();
  await expect(onlySummaries).toHaveAttribute('aria-checked', 'false');
  await picker.getByTestId('picker-chapter').first().getByRole('checkbox').first().click();
  await expect(picker.getByTestId('picker-count')).toContainText('videos to cut');
  const ticked = Number((await picker.getByTestId('picker-count').innerText()).match(/\d+/)[0]);
  expect(ticked).toBeGreaterThan(1);
  await picker.getByRole('button', { name: new RegExp(`^Add ${ticked} to Day 1`) }).click();
  await expect(parts).toHaveCount(ticked + 1);
  await expect(parts.nth(1).getByTestId('part-times')).toHaveText('Needs times');

  // A part cut by the admin is a stretch: the whole video is refused, a short stretch with a summary is kept
  await parts.nth(1).getByTestId('part-edit').click();
  const editor = page.getByTestId('part-editor');
  await editor.getByTestId('part-start').fill('0:00');
  await editor.getByTestId('part-end').fill('15:00');
  await expect(editor.getByTestId('part-time-note')).toContainText('This is the whole video');
  await expect(editor.getByTestId('part-save')).toBeDisabled();
  await editor.getByTestId('part-start').fill('2:00');
  await editor.getByTestId('part-end').fill('2:30');
  await expect(editor.getByTestId('part-time-note')).toContainText('Students watch 2:00 to 2:30 only');
  await editor.getByTestId('part-summary').fill('A cell is the smallest unit of life.');
  await editor.getByTestId('part-points').fill('Cell theory\nPlant and animal cells');
  await editor.getByTestId('part-save').click();
  await expect(parts.nth(1).getByTestId('part-times')).toHaveText('2:00–2:30 · 30 sec');

  // The next part's times come from where the video is when Set start and Set end are pressed
  await parts.nth(2).getByTestId('part-edit').click();
  await page.evaluate(() => {
    window.__yt.players.at(-1).time = 65;
  });
  await editor.getByTestId('part-set-start').click();
  await page.evaluate(() => {
    window.__yt.players.at(-1).time = 95;
  });
  await editor.getByTestId('part-set-end').click();
  await expect(editor.getByTestId('part-start')).toHaveValue('1:05');
  await expect(editor.getByTestId('part-end')).toHaveValue('1:35');
  await editor.getByTestId('part-summary').fill('The nucleus holds the cell\'s DNA.');
  await editor.getByTestId('part-save').click();
  await expect(parts.nth(2).getByTestId('part-times')).toHaveText('1:05–1:35 · 30 sec');

  // Parts still without times are saved as unfinished; students do not see them yet
  await expect(roadmap.getByTestId('roadmap-unfinished')).toHaveText(`${ticked - 2} not finished`);

  // Day 2: a copy of Day 1, trimmed to one part; the empty last day is removed, back to 10 days
  await roadmap.getByRole('button', { name: 'Copy Day 1' }).click();
  await expect(roadmap.getByRole('tablist', { name: 'Days' }).getByRole('tab')).toHaveCount(11);
  await expect(roadmap.getByRole('tab', { selected: true })).toContainText('Day 2');
  for (let left = ticked + 1; left > 1; left -= 1) {
    await parts.last().getByRole('button', { name: 'Remove part' }).click();
    const confirm = page.getByRole('alertdialog');
    if (await confirm.isVisible().catch(() => false)) await confirm.getByRole('button', { name: 'Remove' }).click();
  }
  await expect(parts).toHaveCount(1);
  await roadmap.getByRole('tab', { name: /^Day 11/ }).click();
  await roadmap.getByRole('button', { name: 'Remove Day 11' }).click();
  await expect(roadmap.getByRole('tablist', { name: 'Days' }).getByRole('tab')).toHaveCount(10);

  await page.getByRole('button', { name: 'Save Roadmaps' }).first().click();
  await expect(page.getByText('Roadmaps saved.')).toBeVisible();

  // What was saved: Day 1 has the summary, the two parts cut and the unfinished ones; Day 2 the summary
  const headers = adminHeaders;
  const zoology = (await (await request.get(`${API_URL}/api/admin/roadmaps`, { headers })).json()).courses.find((item) => item.slug === 'zoology');
  const saved = (await (await request.get(`${API_URL}/api/admin/courses/${zoology._id}/roadmaps`, { headers })).json()).roadmaps.items.find(
    (item) => item.title === '10 Days Zoology Sprint'
  );
  const day1 = saved.days[0].steps.map((step) => step.resources[0]);
  expect(saved.days[0].steps[0].title).toBe('Cells at a glance');
  expect(day1.slice(0, 3).map(({ nodeId, start, end, summary }) => ({ nodeId, start, end, summary }))).toEqual([
    { nodeId: nodes[0].nodeId, start: 60, end: 80, summary: 'Every living thing is made of cells.' },
    { nodeId: day1[1].nodeId, start: 120, end: 150, summary: 'A cell is the smallest unit of life.' },
    { nodeId: day1[2].nodeId, start: 65, end: 95, summary: "The nucleus holds the cell's DNA." },
  ]);
  expect(day1[0].points).toEqual(['Cell theory']);
  expect(day1[1].points).toEqual(['Cell theory', 'Plant and animal cells']);
  expect(day1.slice(3).every((resource) => resource.start === null)).toBe(true);
  expect(saved.days[1].steps.map((step) => step.resources[0].start)).toEqual([60]);

  // Students get only the finished parts
  const publicPlan = (await (await request.get(`${API_URL}/api/courses/zoology`)).json()).course.page.roadmaps.items.find(
    (item) => item.title === '10 Days Zoology Sprint'
  );
  expect(publicPlan.days.map((day) => day.steps.length).slice(0, 3)).toEqual([3, 1, 0]);
});

test('a student plays only the part, a part watched to its end ticks itself, and the progress follows the account', async ({ page, request, browser }, testInfo) => {
  const { course, nodes } = await lessonsOf(request, 'zoology');
  const days = testInfo.project.name === 'phone' ? 6 : 4;
  const title = `${days} Days Zoology Parts`;
  await addRoadmapByApi(request, course, {
    title,
    days: [
      { title: 'Cells', steps: [part(nodes[0], 120, 135, 'A cell is the unit of life.', ['Cell theory']), part(nodes[1], 30, 40, 'Cells make cells.')] },
      ...Array.from({ length: days - 1 }, () => ({ title: '', steps: [] })),
    ],
  });
  // The student has the course, so every part plays
  const student = await signInStudent(request);
  await request.post(`${API_URL}/api/admin/users/${(student.user || student)._id}/purchases`, {
    headers: await headersFor(request),
    data: { courseId: course._id, note: 'Roadmap parts test' },
  });

  await fakeYouTube(page);
  await openAsStudent(page, request);
  await openPlan(page, 'zoology', title);
  const cards = page.getByTestId('plan-part');
  await expect(cards).toHaveCount(2);
  await expect(cards.first().getByTestId('plan-part-summary')).toHaveText('A cell is the unit of life.');
  await expect(cards.first()).toContainText('2:00–2:15');
  await expect(cards.first()).toContainText('Cell theory');

  // Play part: only 2:00 to 2:15 of the lesson, and the part ticks itself at its end
  await cards.first().getByTestId('plan-play-part').click();
  const player = page.getByTestId('roadmap-player');
  await expect(player).toBeVisible();
  await expect(player.getByTestId('now-playing-title')).toContainText(nodes[0].title);
  await expect.poll(async () => (await heard(page))[0]).toEqual({ videoId: nodes[0].youtubeId, time: 120 });
  await expect(player.getByTestId('save-highlight')).toHaveCount(0);
  // Captions can be turned off, and back on; the choice is kept for the next video
  await player.getByTestId('reel-captions').click();
  await expect(player.getByTestId('reel-captions')).toHaveAttribute('aria-pressed', 'false');
  await expect.poll(async () => (await sound(page))[0]?.captions).toBe(false);
  await player.getByTestId('reel-captions').click();
  await expect.poll(async () => (await sound(page))[0]?.captions).toBe(true);
  await play(page, 16);
  await expect.poll(async () => (await heard(page))[0]?.videoId).toBe(nodes[1].youtubeId);
  await player.getByRole('button', { name: 'Close the player' }).click();
  await expect(cards.first().getByRole('button', { name: 'Part 01 done' })).toBeVisible();

  // Play the day: both parts in one list
  await page.getByTestId('plan-play-day').click();
  await expect(player.getByTestId('playlist-item')).toHaveCount(2);
  await player.getByRole('button', { name: 'Close the player' }).click();

  // The tick is on the account: a new browser with nothing saved shows it too
  const plans = await (
    await request.get(`${API_URL}/api/roadmaps/${course._id}/progress`, { headers: { Authorization: `Bearer ${student.token}` } })
  ).json();
  expect(plans.plans.find((item) => item.planKey === title.toLowerCase().replace(/\s+/g, '-'))?.done).toContain('0-0');
  const other = await browser.newContext(testInfo.project.use.viewport ? { viewport: testInfo.project.use.viewport } : {});
  const elsewhere = await other.newPage();
  await openAsStudent(elsewhere, request);
  await openPlan(elsewhere, 'zoology', title);
  await expect(elsewhere.getByTestId('plan-part').first().getByRole('button', { name: 'Part 01 done' })).toBeVisible();
  await other.close();
});

test('a visitor sees the parts and is asked to sign in; a student without the course is asked to buy a locked part', async ({ page, request }, testInfo) => {
  const { course, nodes } = await lessonsOf(request, 'telugu');
  const days = testInfo.project.name === 'phone' ? 6 : 4;
  const title = `${days} Days Telugu Parts`;
  // The first lessons are free to try; a later one is locked until the course is bought
  const locked = nodes[nodes.length - 1];
  await addRoadmapByApi(request, course, {
    title,
    days: [
      { title: 'Poems', steps: [part(nodes[0], 10, 20, 'The poem begins.'), part(locked, 30, 45, 'The last lesson, in short.')] },
      ...Array.from({ length: days - 1 }, () => ({ title: '', steps: [] })),
    ],
  });

  const visitor = await newVisitorPage(page);
  await openPlan(visitor, 'telugu', title);
  const cards = visitor.getByTestId('plan-part');
  await expect(cards).toHaveCount(2);
  await expect(cards.nth(1).getByTestId('plan-part-summary')).toHaveText('The last lesson, in short.');
  await cards.first().getByTestId('plan-play-part').click();
  await expect(visitor.getByRole('dialog', { name: 'Sign in required' })).toBeVisible();

  await fakeYouTube(page);
  await openAsStudent(page, request);
  await openPlan(page, 'telugu', title);
  const studentCards = page.getByTestId('plan-part');
  await expect(studentCards.nth(1).getByTestId('plan-play-part')).toHaveText('Buy to watch');
  await studentCards.nth(1).getByTestId('plan-play-part').click();
  await expect(page.getByRole('dialog', { name: 'Buy this course' })).toBeVisible();
  await page.getByRole('dialog', { name: 'Buy this course' }).getByRole('button', { name: 'Close' }).first().click();
  await expect(studentCards.first().getByTestId('plan-play-part')).toHaveText('Play part');
});
