import { test, expect } from '@playwright/test';
import { API_URL, closeVisitorPages, getAdminToken, newVisitorPage, openAsAdmin, openAsStudent, signInStudent } from './helpers';

// Highlights: parts of lesson videos, and named reels that play them back to back as one video

const CH1 = 'aqz-KE-bpKQ';
const CH5 = 'ScMzIvxBSi4';

// Stands in for YouTube's player API. window.__ytAdvance(seconds) moves every playing video on;
// a video stops at its end time, as YouTube's does.
const FAKE_YOUTUBE_API = `
window.__yt = { players: [] };
function FakePlayer(element, options) {
  var self = this;
  var p = { videoId: options.videoId || '', time: 0, state: -1, muted: false, volume: 100, rate: 1, end: null, destroyed: false };
  window.__yt.players.push(p);
  var frame = document.createElement('div');
  frame.setAttribute('data-fake-youtube', '');
  frame.style.cssText = 'width:100%;height:100%;background:#0f172a';
  if (element.parentNode) element.parentNode.replaceChild(frame, element);
  function emit(state) {
    p.state = state;
    setTimeout(function () {
      if (options.events && options.events.onStateChange) options.events.onStateChange({ data: state, target: self });
    }, 0);
  }
  p.emit = emit;
  this.loadVideoById = function (o) { p.videoId = o.videoId; p.time = o.startSeconds || 0; p.end = o.endSeconds || null; emit(1); };
  this.cueVideoById = function (o) { p.videoId = o.videoId; p.time = o.startSeconds || 0; p.end = o.endSeconds || null; emit(5); };
  this.playVideo = function () { emit(1); };
  this.pauseVideo = function () { emit(2); };
  this.seekTo = function (seconds) { p.time = seconds; };
  this.getCurrentTime = function () { return p.time; };
  this.getDuration = function () { return 900; };
  this.getPlayerState = function () { return p.state; };
  this.mute = function () { p.muted = true; };
  this.unMute = function () { p.muted = false; };
  this.isMuted = function () { return p.muted; };
  this.setVolume = function (volume) { p.volume = volume; };
  this.getVolume = function () { return p.volume; };
  this.setPlaybackRate = function (rate) { p.rate = rate; };
  this.getPlaybackRate = function () { return p.rate; };
  this.destroy = function () { p.destroyed = true; };
  setTimeout(function () { if (options.events && options.events.onReady) options.events.onReady({ target: self }); }, 0);
}
window.YT = { Player: FakePlayer, PlayerState: { ENDED: 0, PLAYING: 1, PAUSED: 2 } };
window.__ytAdvance = function (seconds) {
  window.__yt.players.forEach(function (p) {
    if (p.state !== 1 || p.destroyed) return;
    p.time += seconds;
    if (p.end !== null && p.time >= p.end) { p.time = p.end; p.emit(0); }
  });
};
window.__ytHeard = function () {
  return window.__yt.players
    .filter(function (p) { return p.state === 1 && !p.muted && !p.destroyed; })
    .map(function (p) { return { videoId: p.videoId, time: p.time }; });
};
window.__ytSound = function () {
  return window.__yt.players
    .filter(function (p) { return p.state === 1 && !p.destroyed; })
    .map(function (p) { return { muted: p.muted, volume: p.volume, rate: p.rate }; });
};
if (window.onYouTubeIframeAPIReady) window.onYouTubeIframeAPIReady();`;

const fakeYouTube = (page) =>
  page.route('https://www.youtube.com/iframe_api', (route) =>
    route.fulfill({ contentType: 'application/javascript', body: FAKE_YOUTUBE_API })
  );
// Moves the playing video on, a second at a time so the reel sees each moment
const play = async (page, seconds) => {
  for (let done = 0; done < seconds; done += 1) {
    await page.evaluate(() => window.__ytAdvance(1));
    await page.waitForTimeout(140);
  }
};
const heard = (page) => page.evaluate(() => window.__ytHeard());
// The sound and speed of the video that is playing
const sound = (page) => page.evaluate(() => window.__ytSound());

const headersFor = async (request) => ({ Authorization: `Bearer ${await getAdminToken(request)}` });

// Two lesson videos of a subject of its own: chapter 1 and chapter 5
const addLessons = async (request, subject) => {
  const headers = await headersFor(request);
  const add = async (title, youtubeId, chapterNumber, chapterName) => {
    const res = await request.post(`${API_URL}/api/videos`, {
      headers,
      data: { title, url: `https://www.youtube.com/watch?v=${youtubeId}`, subject, status: 'published', chapterNumber, chapterName },
    });
    expect(res.ok(), await res.text()).toBeTruthy();
    const body = await res.json();
    return { _id: body.data?._id || body.video?._id || body._id, title };
  };
  return {
    ch1: await add(`Trigonometric ratios ${subject}`, CH1, 1, 'Trigonometry'),
    ch5: await add(`Heights and distances ${subject}`, CH5, 5, 'Applications'),
  };
};

const removeAll = async (request, subject, videos) => {
  const headers = await headersFor(request);
  const { reels = [], clips = [] } = await (
    await request.get(`${API_URL}/api/admin/highlights?subject=${encodeURIComponent(subject)}`, { headers })
  ).json();
  for (const reel of reels) await request.delete(`${API_URL}/api/admin/highlight-reels/${reel._id}`, { headers });
  for (const clip of clips) await request.delete(`${API_URL}/api/admin/highlights/${clip._id}`, { headers });
  for (const video of videos) await request.delete(`${API_URL}/api/videos/${video._id}`, { headers });
};

test('the admin cuts 20 seconds from chapter 1 and 20 from chapter 5 into one reel, and it plays as one 40-second video', async ({ page, request }, testInfo) => {
  test.skip(testInfo.project.name === 'phone', 'The admin panel is checked at laptop size');
  const subject = `Reel Maths ${Date.now()}`;
  const { ch1, ch5 } = await addLessons(request, subject);
  try {
    await fakeYouTube(page);
    await openAsAdmin(page, request);
    await page.goto('/admin');
    await page.getByRole('button', { name: /Videos, YouTube & Links/ }).first().click();
    await page.getByTitle('Grid Card View').click();

    // Chapter 1, from its card: a new reel
    await page.getByRole('button', { name: `Add part of ${ch1.title} to highlights` }).click();
    const editor = page.getByTestId('clip-editor');
    await expect(editor).toContainText(subject);
    await editor.getByTestId('clip-start').fill('2:00');
    await editor.getByTestId('clip-end').fill('2:20');
    await expect(editor.getByTestId('clip-length')).toHaveText('Length 0:20');
    await editor.getByTestId('clip-title').fill('What is trigonometry');
    await editor.getByTestId('clip-new-reel').fill('Trigonometry in 40 seconds');
    await editor.getByTestId('clip-save').click();
    await expect(page.getByText('Saved "What is trigonometry" in 1 reel')).toBeVisible();
    await expect(editor).toHaveCount(0);

    // Chapter 5, from its preview window: the same reel. Set start / Set end take the time the video is at.
    await page.getByRole('heading', { name: ch5.title }).first().click();
    await page.getByTestId('preview-add-to-highlights').click();
    await expect(editor.getByTestId('reel-option')).toHaveCount(1);
    await page.evaluate(() => {
      const player = window.__yt.players[window.__yt.players.length - 1];
      player.time = 430;
    });
    await editor.getByTestId('clip-set-start').click();
    await expect(editor.getByTestId('clip-start')).toHaveValue('7:10');
    await page.evaluate(() => {
      window.__yt.players[window.__yt.players.length - 1].time = 450;
    });
    await editor.getByTestId('clip-set-end').click();
    await expect(editor.getByTestId('clip-end')).toHaveValue('7:30');
    await editor.getByTestId('clip-title').fill('Heights and distances');
    await editor.getByTestId('reel-option').filter({ hasText: 'Trigonometry in 40 seconds' }).getByRole('checkbox').check();
    await editor.getByTestId('clip-save').click();
    await expect(page.getByText('Saved "Heights and distances" in 1 reel')).toBeVisible();

    // The Highlights tab: one reel of two parts, 40 seconds, 2 chapters, in the order they were added
    await page.getByRole('button', { name: 'Highlights', exact: true }).first().click();
    await page.getByTestId('highlights-subject').selectOption(subject);
    const reel = page.getByTestId('admin-reel').filter({ hasText: 'Trigonometry in 40 seconds' });
    await expect(reel.getByTestId('admin-reel-stats')).toHaveText('2 parts · 0:40 · 2 chapters');
    await expect(reel.getByTestId('admin-reel-clip')).toHaveText([/Ch 1 · What is trigonometry/, /Ch 5 · Heights and distances/]);
    await reel.getByRole('button', { name: 'Move Heights and distances up' }).click();
    await expect(reel.getByTestId('admin-reel-clip')).toHaveText([/Heights and distances/, /What is trigonometry/]);
    await reel.getByRole('button', { name: 'Move Heights and distances down' }).click();
    await expect(reel.getByTestId('admin-reel-clip')).toHaveText([/What is trigonometry/, /Heights and distances/]);

    // Played: chapter 1's 20 seconds, then chapter 5's, on one timeline
    await reel.getByRole('button', { name: 'Play', exact: true }).click();
    const player = page.getByTestId('admin-reel-player').getByTestId('reel-player');
    await expect(player).toHaveAttribute('data-state', 'playing');
    await expect(player.getByTestId('reel-part')).toContainText('Part 1 of 2 · Ch 1 · What is trigonometry');
    await expect.poll(() => heard(page)).toEqual([{ videoId: CH1, time: 120 }]);
    await play(page, 10);
    await expect(player.getByTestId('reel-time')).toHaveText('0:10 / 0:40');
    await play(page, 11);
    await expect(player.getByTestId('reel-part')).toContainText('Part 2 of 2 · Ch 5 · Heights and distances');
    await expect.poll(async () => (await heard(page)).map((video) => video.videoId)).toEqual([CH5]);
    await expect(player.getByTestId('reel-time')).toHaveText(/0:2[01] \/ 0:40/);
  } finally {
    await removeAll(request, subject, [ch1, ch5]);
  }
});

test('a reel asks a visitor to sign in, a student to buy the course, and plays for everyone once it is a free preview', async ({ page, request }, testInfo) => {
  const headers = await headersFor(request);
  const subject = `Reel Course ${testInfo.project.name} ${Date.now()}`;
  const created = await request.post(`${API_URL}/api/admin/courses`, {
    headers,
    data: { name: subject, subject, shortDescription: 'Sold online.', thumbnail: 'https://images.example.com/reel.jpg', price: 299, oldPrice: 999, sellOnline: true },
  });
  expect(created.ok(), await created.text()).toBeTruthy();
  const course = (await created.json()).course;
  const syllabus = await request.put(`${API_URL}/api/admin/courses/${course._id}/curriculum`, {
    headers,
    data: { chapters: [{ number: '1', name: 'Trigonometry', topics: [{ code: '1.1', title: 'Ratios', youtubeUrl: `https://www.youtube.com/watch?v=${CH1}` }] }] },
  });
  expect(syllabus.ok(), await syllabus.text()).toBeTruthy();
  const published = await request.patch(`${API_URL}/api/admin/courses/${course._id}/status`, { headers, data: { status: 'published' } });
  expect(published.ok(), await published.text()).toBeTruthy();

  const { ch1, ch5 } = await addLessons(request, subject);
  try {
    const first = await request.post(`${API_URL}/api/admin/highlights`, {
      headers,
      data: { videoId: ch1._id, start: '2:00', end: '2:20', title: 'What is trigonometry', summary: 'Sides and angles of triangles.', newReel: { name: 'Trigonometry in 40 seconds' } },
    });
    expect(first.ok(), await first.text()).toBeTruthy();
    const reelId = (await first.json()).reels[0]._id;
    const second = await request.post(`${API_URL}/api/admin/highlights`, {
      headers,
      data: { videoId: ch5._id, start: '7:10', end: '7:30', title: 'Heights and distances', reelIds: [reelId] },
    });
    expect(second.ok(), await second.text()).toBeTruthy();

    // A visitor sees what is in the reel, and is asked to sign in
    const visitor = await newVisitorPage(page);
    await visitor.goto(`/highlights/${reelId}`);
    await expect(visitor.getByTestId('reel-name')).toHaveText('Trigonometry in 40 seconds');
    await expect(visitor.getByTestId('reel-locked')).toContainText('Sign in to watch these highlights');
    await expect(visitor.getByTestId('reel-item')).toHaveText([/Ch 1 · What is trigonometry[\s\S]*2:00–2:20/, /Ch 5 · Heights and distances[\s\S]*7:10–7:30/]);
    await closeVisitorPages();

    // A student without the course is asked to buy it
    await fakeYouTube(page);
    await openAsStudent(page, request);
    await page.goto(`/highlights/${reelId}`);
    await expect(page.getByTestId('reel-locked')).toContainText(`These highlights are part of the ${subject} course`);
    await expect(page.getByTestId('reel-player')).toHaveCount(0);

    // Once the admin makes it a free preview, it plays for the student as one video
    const free = await request.put(`${API_URL}/api/admin/highlight-reels/${reelId}`, { headers, data: { freePreview: true } });
    expect(free.ok(), await free.text()).toBeTruthy();
    await page.reload();
    const player = page.getByTestId('reel-player');
    await expect(player.getByTestId('reel-time')).toHaveText('0:00 / 0:40');
    await expect(player.getByTestId('reel-segment')).toHaveCount(2);
    await expect(page.getByTestId('playlist-item')).toHaveText([/What is trigonometry[\s\S]*Ch 1 · Trigonometry/, /Heights and distances[\s\S]*Ch 5 · Applications/]);
    await expect(page.getByTestId('now-playing')).toContainText('Sides and angles of triangles.');
    await player.getByTestId('reel-play').click();
    await play(page, 5);
    await expect(player.getByTestId('reel-time')).toHaveText('0:05 / 0:40');

    // Jumping three quarters along the timeline lands 10 seconds into chapter 5
    const bar = await player.getByTestId('reel-timeline').boundingBox();
    await page.mouse.click(bar.x + bar.width * 0.75, bar.y + bar.height / 2);
    await expect(player.getByTestId('reel-part')).toContainText('Part 2 of 2 · Ch 5 · Heights and distances');
    await expect.poll(async () => (await heard(page))[0]?.videoId).toBe(CH5);
    await expect.poll(async () => Math.round((await heard(page))[0]?.time)).toBe(440);

    // It stops at 7:30, the end of the reel, and can play again from the start
    await play(page, 12);
    await expect(player.getByTestId('reel-ended')).toContainText('Reel finished');
    await expect(player).toHaveAttribute('data-state', 'ended');
    await expect(player.getByTestId('reel-time')).toHaveText('0:40 / 0:40');
    await player.getByRole('button', { name: 'Replay' }).click();
    await expect(player.getByTestId('reel-part')).toContainText('Part 1 of 2 · Ch 1 · What is trigonometry');
    await expect.poll(async () => (await heard(page))[0]?.videoId).toBe(CH1);
  } finally {
    await removeAll(request, subject, [ch1, ch5]);
    await request.patch(`${API_URL}/api/admin/courses/${course._id}/status`, { headers, data: { status: 'archived' } });
  }
});

// ── Search, and the highlights in a video's edit window ─────────

// A course for sale with two lessons and one highlight, "What is trigonometry" at 2:00–2:20 of chapter 1
const addCourseWithHighlight = async (request, testInfo, { freePreview = false } = {}) => {
  const headers = await headersFor(request);
  const subject = `Search Course ${testInfo.project.name} ${Date.now()}`;
  const created = await request.post(`${API_URL}/api/admin/courses`, {
    headers,
    data: { name: subject, subject, shortDescription: 'Sold online.', thumbnail: 'https://images.example.com/search.jpg', price: 299, oldPrice: 999, sellOnline: true },
  });
  expect(created.ok(), await created.text()).toBeTruthy();
  const course = (await created.json()).course;
  await request.put(`${API_URL}/api/admin/courses/${course._id}/curriculum`, {
    headers,
    data: { chapters: [{ number: '1', name: 'Trigonometry', topics: [{ code: '1.1', title: 'Ratios', youtubeUrl: `https://www.youtube.com/watch?v=${CH1}` }] }] },
  });
  const published = await request.patch(`${API_URL}/api/admin/courses/${course._id}/status`, { headers, data: { status: 'published' } });
  expect(published.ok(), await published.text()).toBeTruthy();
  const lessons = await addLessons(request, subject);
  const made = await request.post(`${API_URL}/api/admin/highlights`, {
    headers,
    data: {
      videoId: lessons.ch1._id,
      start: '2:00',
      end: '2:20',
      title: 'What is trigonometry',
      summary: 'Trigonometry studies the sides and angles of triangles.',
      points: 'Sine, cosine and tangent',
      freePreview,
    },
  });
  expect(made.ok(), await made.text()).toBeTruthy();
  const cleanUp = async () => {
    await removeAll(request, subject, [lessons.ch1, lessons.ch5]);
    await request.patch(`${API_URL}/api/admin/courses/${course._id}/status`, { headers, data: { status: 'archived' } });
  };
  return { subject, course, lessons, cleanUp };
};

test('the top bar search finds "what is trignometry", marks the words, and asks a visitor to sign in to play', async ({ page, request }, testInfo) => {
  const { subject, cleanUp } = await addCourseWithHighlight(request, testInfo);
  try {
    const visitor = await newVisitorPage(page);
    await visitor.goto('/demo');
    let box = visitor.getByTestId('search-input-bar');
    if (testInfo.project.name === 'phone') {
      await visitor.getByRole('button', { name: 'Open Menu' }).click();
      box = visitor.getByTestId('search-input-drawer');
    }
    await box.fill('what is trignometry');

    // Suggestions while typing: the misspelt word is searched as "trigonometry", and marked
    const suggestions = visitor.getByTestId('search-suggestions');
    await expect(suggestions).toContainText('Showing results for what is trigonometry');
    const suggestion = suggestions.getByTestId('search-suggestion').filter({ hasText: subject }).first();
    await expect(suggestion).toContainText('What is trigonometry');
    await expect(suggestion).toContainText('2:00–2:20 · 20 sec');
    await expect(suggestion.locator('mark')).toHaveText('trigonometry');

    // Enter opens every result
    await box.press('Enter');
    await expect(visitor).toHaveURL(/\/search\?q=what%20is%20trignometry$/);
    await expect(visitor.getByTestId('search-did-you-mean')).toHaveText('Showing results for what is trigonometry');
    const result = visitor.getByTestId('search-result-highlight').filter({ hasText: subject });
    await expect(result.locator('h3 mark')).toHaveText('trigonometry');
    await expect(result).toContainText('Trigonometry studies the sides and angles of triangles.');
    await expect(result.getByTestId('highlight-signin')).toHaveText('Sign in to play');
    await expect(result.getByTestId('highlight-play')).toHaveCount(0);
  } finally {
    await closeVisitorPages();
    await cleanUp();
  }
});

test('a student plays only 2:00 to 2:20 of the lesson from the search, once the highlight is a free preview', async ({ page, request }, testInfo) => {
  const locked = await addCourseWithHighlight(request, testInfo);
  await fakeYouTube(page);
  await openAsStudent(page, request);
  try {
    // Without the course and without a free preview: buy to play
    await page.goto('/search?q=what%20is%20trigonometry');
    const lockedResult = page.getByTestId('search-result-highlight').filter({ hasText: locked.subject });
    await expect(lockedResult.getByTestId('highlight-buy')).toHaveText(`Buy ${locked.subject} to play`);
    await lockedResult.getByTestId('highlight-buy').click();
    await expect(page).toHaveURL(new RegExp(`/checkout\\?course=${locked.course.slug}$`));
  } finally {
    await locked.cleanUp();
  }

  const free = await addCourseWithHighlight(request, testInfo, { freePreview: true });
  try {
    await page.goto('/search?q=what%20is%20trigonometry');
    const result = page.getByTestId('search-result-highlight').filter({ hasText: free.subject });
    await result.getByTestId('highlight-play').click();
    const player = result.getByTestId('reel-player');
    await expect(player.getByTestId('reel-part')).toHaveText('Ch 1 · What is trigonometry');
    await expect(player.getByTestId('reel-time')).toHaveText('0:00 / 0:20');
    await expect.poll(() => heard(page)).toEqual([{ videoId: CH1, time: 120 }]);
    await play(page, 10);
    await expect(player.getByTestId('reel-time')).toHaveText('0:10 / 0:20');
    // It stops at 2:20 by itself
    await play(page, 11);
    await expect(player.getByTestId('reel-ended')).toContainText('Highlight finished');
    await expect.poll(() => heard(page)).toEqual([]);
  } finally {
    await free.cleanUp();
  }
});

test("every video's Edit Lesson window lists its highlights and adds new ones", async ({ page, request }, testInfo) => {
  test.skip(testInfo.project.name === 'phone', 'The admin panel is checked at laptop size');
  const { lessons, cleanUp } = await addCourseWithHighlight(request, testInfo);
  try {
    await fakeYouTube(page);
    await openAsAdmin(page, request);
    await page.goto('/admin');
    await page.getByRole('button', { name: /Videos, YouTube & Links/ }).first().click();
    await page.getByTitle('Grid Card View').click();
    await page.getByRole('heading', { name: lessons.ch1.title }).first().click();
    await page.getByTestId('video-preview-modal').getByRole('button', { name: 'Edit Video' }).click();

    const section = page.getByTestId('video-highlights');
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByTestId('video-highlight')).toHaveCount(1);
    await expect(section.getByTestId('video-highlight')).toContainText('What is trigonometry');
    await expect(section.getByTestId('video-highlight')).toContainText('2:00–2:20 · In no reel');

    await section.getByTestId('video-add-highlight').click();
    const editor = page.getByTestId('clip-editor');
    await editor.getByTestId('clip-start').fill('4:00');
    await editor.getByTestId('clip-end').fill('4:15');
    await editor.getByTestId('clip-title').fill('Sine and cosine');
    await editor.getByTestId('clip-save').click();
    await expect(editor).toHaveCount(0);
    await expect(section.getByTestId('video-highlight')).toHaveCount(2);
    await expect(section.getByTestId('video-highlight').filter({ hasText: 'Sine and cosine' })).toContainText('4:00–4:15');
  } finally {
    await cleanUp();
  }
});

// ── Highlights under a lesson in the lesson player ──────────────

// Stands in for YouTube's player API in the lesson player, so a test can end the video
const LESSON_YOUTUBE_API = `
window.__lessonPlayers = [];
window.YT = {
  Player: function (element, options) {
    var self = this;
    window.__lessonPlayers.push({ element: element, options: options });
    this.getCurrentTime = function () { return window.__lessonTime || 0; };
    this.getDuration = function () { return 900; };
    this.getPlayerState = function () { return -1; };
    this.seekTo = function (seconds) { window.__lessonSeek = seconds; };
    this.playVideo = function () {};
    setTimeout(function () { if (options.events && options.events.onReady) options.events.onReady({ target: self }); }, 0);
  },
};
if (window.onYouTubeIframeAPIReady) window.onYouTubeIframeAPIReady();`;

// The video in the lesson player reaches its end (for a highlight, its end time)
const endLessonVideo = async (page) => {
  await page.waitForFunction(() => {
    const list = window.__lessonPlayers || [];
    const last = list[list.length - 1];
    return last && last.element === document.querySelector('[data-testid="lesson-player"] iframe');
  });
  await page.evaluate(() => {
    const last = window.__lessonPlayers[window.__lessonPlayers.length - 1];
    last.options.events.onStateChange({ data: 1 });
    last.options.events.onStateChange({ data: 0 });
  });
};

test('the lesson player lists the highlights under the video, and Play runs only that part', async ({ page, request }, testInfo) => {
  const { course, lessons, cleanUp } = await addCourseWithHighlight(request, testInfo);
  const headers = await headersFor(request);
  try {
    const earlier = await request.post(`${API_URL}/api/admin/highlights`, {
      headers,
      data: { videoId: lessons.ch1._id, start: '0:30', end: '0:45', title: 'Angles first', summary: 'What an angle is.' },
    });
    expect(earlier.ok(), await earlier.text()).toBeTruthy();

    await page.route('https://www.youtube.com/iframe_api', (route) =>
      route.fulfill({ contentType: 'application/javascript', body: LESSON_YOUTUBE_API })
    );
    await page.route('https://www.youtube-nocookie.com/**', (route) =>
      route.fulfill({ contentType: 'text/html', body: '<html><body style="background:#000"></body></html>' })
    );
    await openAsStudent(page, request);
    await page.goto(`/courses/${course.slug}`);
    // The syllabus lesson "Ratios" uses the same YouTube video as the lesson the highlights were cut from
    await page
      .getByTestId('course-topic')
      .filter({ hasText: 'Ratios' })
      .filter({ hasNotText: 'Trigonometric' })
      .getByRole('button', { name: /Watch Lecture/ })
      .click();
    const player = page.getByTestId('lesson-player');
    const iframe = player.locator('iframe');
    await expect(iframe).toHaveAttribute('src', new RegExp(`/embed/${CH1}\\?`));

    // Under the video, in time order
    const list = player.getByTestId('lesson-highlights');
    await expect(list).toContainText('Highlights in this lesson (2)');
    await expect(list.getByTestId('lesson-highlight')).toHaveText([/0:30–0:45[\s\S]*Angles first/, /2:00–2:20[\s\S]*What is trigonometry/]);

    // Play: only 2:00 to 2:20 of the lesson
    await list.getByTestId('lesson-highlight').filter({ hasText: 'What is trigonometry' }).getByTestId('lesson-highlight-play').click();
    await expect(iframe).toHaveAttribute('src', /start=120&end=140/);
    await expect(player.getByTestId('highlight-playing')).toContainText('What is trigonometry · 2:00–2:20');
    await expect(list.getByTestId('lesson-highlight').filter({ hasText: 'What is trigonometry' })).toHaveAttribute('data-playing', 'true');

    // At its end: Highlight finished, not the next lesson
    await endLessonVideo(page);
    await expect(player.getByTestId('highlight-ended')).toContainText('Highlight finished');
    await expect(player.getByTestId('up-next')).toHaveCount(0);
    // Watching a highlight does not finish the lesson or move the student's place
    const progress = await (
      await request.get(`${API_URL}/api/progress/${course._id}`, {
        headers: { Authorization: `Bearer ${await page.evaluate(() => JSON.parse(localStorage.getItem('mla_user')).token)}` },
      })
    ).text();
    expect(progress).not.toContain('"completed":true');

    // The whole lesson carries on from the start of the highlight
    // A click in the first moment of the card can be lost, as with a real tap; it is tried again
    await expect(async () => {
      await player.getByTestId('highlight-full').click({ timeout: 1000 });
      await expect(iframe).toHaveAttribute('src', /start=120(?!&end)/, { timeout: 1000 });
    }).toPass();
    await expect(player.getByTestId('highlight-playing')).toHaveCount(0);

    // Next highlight goes on to the following part
    await list.getByTestId('lesson-highlight').filter({ hasText: 'Angles first' }).getByTestId('lesson-highlight-play').click();
    await expect(iframe).toHaveAttribute('src', /start=30&end=45/);
    await endLessonVideo(page);
    // On phones the page may still be scrolling up to the video; a tap that lands mid-scroll is tried again
    await expect(async () => {
      await player.getByTestId('highlight-next').click({ timeout: 1000 });
      await expect(iframe).toHaveAttribute('src', /start=120&end=140/, { timeout: 1000 });
    }).toPass();
  } finally {
    await cleanUp();
  }
});

// ── My Highlights ───────────────────────────────────────────────

test('a student saves highlights from a lesson and from the search, and My Highlights plays the subject as one video', async ({ page, request }, testInfo) => {
  const { subject, course, lessons, cleanUp } = await addCourseWithHighlight(request, testInfo);
  const headers = await headersFor(request);
  try {
    const later = await request.post(`${API_URL}/api/admin/highlights`, {
      headers,
      data: { videoId: lessons.ch5._id, start: '7:10', end: '7:30', title: 'Heights and distances', summary: 'Using tan to find a height.' },
    });
    expect(later.ok(), await later.text()).toBeTruthy();
    // The student has the course, so every saved highlight plays
    const student = await signInStudent(request);
    const given = await request.post(`${API_URL}/api/admin/users/${(student.user || student)._id}/purchases`, {
      headers,
      data: { courseId: course._id, note: 'My Highlights test' },
    });
    expect(given.ok(), await given.text()).toBeTruthy();

    await page.route('https://www.youtube.com/iframe_api', (route) =>
      route.fulfill({ contentType: 'application/javascript', body: LESSON_YOUTUBE_API })
    );
    await page.route('https://www.youtube-nocookie.com/**', (route) =>
      route.fulfill({ contentType: 'text/html', body: '<html><body style="background:#000"></body></html>' })
    );
    await openAsStudent(page, request);

    // 1. From under a lesson video
    await page.goto(`/courses/${course.slug}`);
    await page
      .getByTestId('course-topic')
      .filter({ hasText: 'Ratios' })
      .filter({ hasNotText: 'Trigonometric' })
      .getByRole('button', { name: /Watch Lecture/ })
      .click();
    const fromLesson = page.getByTestId('lesson-highlight').filter({ hasText: 'What is trigonometry' });
    await fromLesson.getByTestId('save-highlight').click();
    await expect(fromLesson.getByTestId('save-highlight')).toHaveText('Saved');
    await expect(fromLesson.getByTestId('save-highlight')).toHaveAttribute('aria-pressed', 'true');

    // 2. From the search
    await page.goto('/search?q=heights%20and%20distances');
    const fromSearch = page.getByTestId('search-result-highlight').filter({ hasText: subject }).filter({ hasText: 'Heights and distances' }).first();
    await fromSearch.getByTestId('save-highlight').click();
    await expect(fromSearch.getByTestId('save-highlight')).toHaveText('Saved');
    if (testInfo.project.name === 'desktop') {
      await expect(page.getByTestId('nav-saved-highlights')).toHaveAccessibleName(/My Highlights, \d+/);
    }

    // 3. My Highlights: one section for the subject, chapter 1 before chapter 5, and Play all as one 40-second video
    await page.unroute('https://www.youtube.com/iframe_api');
    await fakeYouTube(page);
    await page.goto('/my-highlights');
    const section = page.getByTestId('saved-subject').filter({ hasText: subject });
    await expect(section.getByTestId('saved-subject-stats')).toContainText('2 highlights · 0:40 to play');
    await expect(section.getByTestId('saved-highlight')).toHaveText([/Ch 1 · What is trigonometry[\s\S]*2:00–2:20/, /Ch 5 · Heights and distances[\s\S]*7:10–7:30/]);
    await section.getByTestId('saved-play-all').click();
    const player = section.getByTestId('reel-player');
    await expect(player.getByTestId('reel-part')).toContainText('Part 1 of 2 · Ch 1 · What is trigonometry');
    await expect.poll(() => heard(page)).toEqual([{ videoId: CH1, time: 120 }]);
    await play(page, 21);
    await expect(player.getByTestId('reel-part')).toContainText('Part 2 of 2 · Ch 5 · Heights and distances');
    await expect.poll(async () => (await heard(page)).map((video) => video.videoId)).toEqual([CH5]);

    // Removing one leaves the other
    await section.getByTestId('saved-highlight').filter({ hasText: 'Heights and distances' }).getByTestId('save-highlight').click();
    await expect(section.getByTestId('saved-highlight')).toHaveCount(1);
    await expect(section.getByTestId('saved-subject-stats')).toContainText('1 highlight · 0:20 to play');
  } finally {
    await cleanUp();
  }
});

test('My Highlights plays like a playlist: rows beside the player that jump, with mute, volume, speed, keys and loop', async ({ page, request }, testInfo) => {
  const { subject, course, lessons, cleanUp } = await addCourseWithHighlight(request, testInfo);
  const headers = await headersFor(request);
  try {
    const later = await request.post(`${API_URL}/api/admin/highlights`, {
      headers,
      data: { videoId: lessons.ch5._id, start: '7:10', end: '7:30', title: 'Heights and distances', summary: 'Using tan to find a height.', points: 'Angle of elevation' },
    });
    expect(later.ok(), await later.text()).toBeTruthy();
    const student = await signInStudent(request);
    const given = await request.post(`${API_URL}/api/admin/users/${(student.user || student)._id}/purchases`, {
      headers,
      data: { courseId: course._id, note: 'Playlist test' },
    });
    expect(given.ok(), await given.text()).toBeTruthy();
    const { clips } = await (await request.get(`${API_URL}/api/admin/highlights?subject=${encodeURIComponent(subject)}`, { headers })).json();
    expect(clips).toHaveLength(2);
    for (const clip of clips) {
      const saved = await request.put(`${API_URL}/api/saved-highlights/${clip._id}`, { headers: { Authorization: `Bearer ${student.token}` } });
      expect(saved.ok(), await saved.text()).toBeTruthy();
    }

    await fakeYouTube(page);
    await openAsStudent(page, request);
    // The volume and speed of an earlier visit are not carried into this test
    await page.addInitScript(() => localStorage.removeItem('mymarks_player'));
    await page.goto('/my-highlights');
    const section = page.getByTestId('saved-subject').filter({ hasText: subject });

    // Play on the second highlight opens the whole list, playing from that highlight
    await section.getByTestId('saved-highlight').filter({ hasText: 'Heights and distances' }).getByTestId('saved-play-one').click();
    const watch = section.getByTestId('reel-watch');
    const player = watch.getByTestId('reel-player');
    const rows = watch.getByTestId('playlist-item');
    await expect(rows).toHaveText([/What is trigonometry[\s\S]*Ch 1 · Trigonometry/, /Heights and distances[\s\S]*Ch 5 · Applications/]);
    await expect(player).toHaveAttribute('data-state', 'playing');
    await expect(watch.getByTestId('playlist-position')).toHaveText('2 / 2');
    await expect(rows.nth(1)).toHaveAttribute('aria-current', 'true');
    await expect(watch.getByTestId('now-playing-title')).toHaveText('Heights and distances');
    await expect(watch.getByTestId('now-playing')).toContainText('Using tan to find a height.');
    await expect(watch.getByTestId('now-playing')).toContainText('Angle of elevation');
    await expect(player.getByTestId('reel-time')).toHaveText('0:20 / 0:40');
    await expect.poll(() => heard(page)).toEqual([{ videoId: CH5, time: 430 }]);

    // A click on the first row plays from that highlight
    await rows.first().click();
    await expect(watch.getByTestId('playlist-position')).toHaveText('1 / 2');
    await expect(rows.first()).toHaveAttribute('aria-current', 'true');
    await expect(watch.getByTestId('now-playing-title')).toHaveText('What is trigonometry');
    await expect.poll(() => heard(page)).toEqual([{ videoId: CH1, time: 120 }]);

    // While it plays the controls leave with the pointer, and come back with it
    await page.mouse.move(2, 2);
    await expect(player).toHaveAttribute('data-controls', 'hidden');
    await player.hover();
    await expect(player).toHaveAttribute('data-controls', 'shown');

    // The speaker mutes the video that is playing; the down arrow turns the volume down
    await player.getByTestId('reel-mute').click();
    await expect.poll(() => sound(page)).toEqual([{ muted: true, volume: 100, rate: 1 }]);
    await player.hover();
    await player.getByTestId('reel-mute').click();
    await expect.poll(() => sound(page)).toEqual([{ muted: false, volume: 100, rate: 1 }]);
    await player.press('ArrowDown');
    await expect.poll(() => sound(page)).toEqual([{ muted: false, volume: 95, rate: 1 }]);

    // The gear sets the speed
    await player.hover();
    await player.getByTestId('reel-settings').click();
    await player.getByTestId('reel-speed-menu').getByRole('menuitemradio', { name: '1.5', exact: true }).click();
    await expect(player.getByTestId('reel-speed-menu')).toHaveCount(0);
    await expect.poll(() => sound(page)).toEqual([{ muted: false, volume: 95, rate: 1.5 }]);

    // Keys: K pauses and plays, the right arrow skips 5 seconds, Shift+N goes to the next highlight
    await player.press('k');
    await expect(player).toHaveAttribute('data-state', 'paused');
    await player.press('k');
    await expect(player).toHaveAttribute('data-state', 'playing');
    await player.press('ArrowRight');
    await expect(player.getByTestId('reel-time')).toHaveText('0:05 / 0:40');
    await player.press('Shift+N');
    await expect(watch.getByTestId('playlist-position')).toHaveText('2 / 2');
    await expect.poll(async () => (await heard(page)).map((video) => video.videoId)).toEqual([CH5]);
    // The volume and speed stay with the next highlight
    await expect.poll(() => sound(page)).toEqual([{ muted: false, volume: 95, rate: 1.5 }]);

    // With Loop on, the list starts again after its last highlight
    await watch.getByTestId('playlist-loop').click();
    await expect(watch.getByTestId('playlist-loop')).toHaveAttribute('aria-pressed', 'true');
    await play(page, 21);
    await expect(watch.getByTestId('playlist-position')).toHaveText('1 / 2');
    await expect(player).toHaveAttribute('data-state', 'playing');
    await expect.poll(async () => (await heard(page)).map((video) => video.videoId)).toEqual([CH1]);

    // Closing the list takes the player away
    await watch.getByRole('button', { name: 'Close the player' }).click();
    await expect(section.getByTestId('reel-player')).toHaveCount(0);
  } finally {
    await cleanUp();
  }
});

test('My Highlights asks a visitor to sign in', async ({ page }) => {
  const visitor = await newVisitorPage(page);
  await visitor.goto('/my-highlights');
  await expect(visitor.getByTestId('my-highlights-page')).toContainText('Sign in to see your saved highlights');
  await closeVisitorPages();
});

// ── My Notes: a note for each video ─────────────────────────────

// A course of two chapters: 1.1 Ordered Pairs and 1.2 Cartesian Product, then 2.1 Heights
const addNotesCourse = async (request, testInfo) => {
  const headers = await headersFor(request);
  const name = `Notes Course ${testInfo.project.name} ${Date.now()}`;
  const created = await request.post(`${API_URL}/api/admin/courses`, {
    headers,
    data: { name, subject: name, shortDescription: 'Two chapters.', thumbnail: 'https://images.example.com/notes.jpg', price: 299, oldPrice: 999, sellOnline: true },
  });
  expect(created.ok(), await created.text()).toBeTruthy();
  const course = (await created.json()).course;
  const syllabus = await request.put(`${API_URL}/api/admin/courses/${course._id}/curriculum`, {
    headers,
    data: {
      chapters: [
        {
          number: '1',
          name: 'Functions',
          topics: [
            { code: '1.1', title: 'Ordered Pairs', youtubeUrl: `https://www.youtube.com/watch?v=${CH1}` },
            { code: '1.2', title: 'Cartesian Product', youtubeUrl: `https://www.youtube.com/watch?v=${CH5}` },
          ],
        },
        { number: '2', name: 'Applications', topics: [{ code: '2.1', title: 'Heights', youtubeUrl: `https://www.youtube.com/watch?v=${CH1}` }] },
      ],
    },
  });
  expect(syllabus.ok(), await syllabus.text()).toBeTruthy();
  const chapters = (await syllabus.json()).chapters;
  await request.patch(`${API_URL}/api/admin/courses/${course._id}/status`, { headers, data: { status: 'published' } });
  return {
    name,
    course,
    nodeIds: [chapters[0].topics[0].nodeId, chapters[0].topics[1].nodeId, chapters[1].topics[0].nodeId],
    archive: () => request.patch(`${API_URL}/api/admin/courses/${course._id}/status`, { headers, data: { status: 'archived' } }),
  };
};

const fakeLessonVideo = async (page) => {
  await page.route('https://www.youtube.com/iframe_api', (route) =>
    route.fulfill({ contentType: 'application/javascript', body: LESSON_YOUTUBE_API })
  );
  await page.route('https://www.youtube-nocookie.com/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<html><body style="background:#000"></body></html>' })
  );
};

const studentHeaders = async (request) => ({ Authorization: `Bearer ${(await signInStudent(request)).token}` });

test('each video keeps its own note with its title and length, and [0:55] jumps the video there', async ({ page, request }, testInfo) => {
  const { course, archive } = await addNotesCourse(request, testInfo);
  try {
    // A note written before notes were kept per video, for the whole chapter
    const older = await request.put(`${API_URL}/api/notes/${course._id}/1`, {
      headers: await studentHeaders(request),
      data: { text: 'Older chapter note.', chapterName: 'Chapter 1: Functions' },
    });
    expect(older.ok(), await older.text()).toBeTruthy();

    await fakeLessonVideo(page);
    await openAsStudent(page, request);
    await page.goto(`/courses/${course.slug}`);
    await page.getByTestId('course-topic').filter({ hasText: 'Ordered Pairs' }).getByRole('button', { name: /Watch Lecture/ }).click();
    const player = page.getByTestId('lesson-player');
    await player.getByTestId('panel-notes').click();
    const notes = player.getByTestId('lesson-notes');

    // The video the note is for, with its length
    await expect(notes.getByTestId('notes-video-title')).toHaveText('1.1 · Ordered Pairs');
    await expect(notes.getByTestId('notes-video-length')).toHaveText('Video · 15:00 · Chapter 1: Functions');
    await expect(notes.getByTestId('notes-chapter-note')).toContainText('Older chapter note.');

    // Type, put in the time, and jump back to it
    const box = notes.getByTestId('notes-text');
    await box.fill('Order matters.');
    await page.evaluate(() => {
      window.__lessonTime = 55;
    });
    await page.waitForTimeout(1300);
    await box.press('End');
    await notes.getByTestId('notes-add-time').click();
    await box.pressSequentially('(a, b) = (c, d) when both parts match.');
    await expect(box).toHaveValue('Order matters.\n[0:55] (a, b) = (c, d) when both parts match.');
    await expect(notes.getByTestId('notes-status')).toHaveText(/^Saved /);
    await notes.getByTestId('notes-time-chip').filter({ hasText: '0:55' }).click();
    await expect.poll(() => page.evaluate(() => window.__lessonSeek)).toBe(55);

    // The next video has its own note, and lists this one under Other videos in this chapter
    await page.evaluate(() => {
      window.__lessonTime = 0;
    });
    await player.getByRole('button', { name: /Next Lesson/ }).click();
    await expect(notes.getByTestId('notes-video-title')).toHaveText('1.2 · Cartesian Product');
    await expect(box).toHaveValue('');
    await box.fill('Pairs from two sets.');
    await expect(notes.getByTestId('notes-status')).toHaveText(/^Saved /);
    const other = notes.getByTestId('notes-other-video');
    await expect(other).toHaveCount(1);
    await expect(other).toContainText('1.1 · Ordered Pairs');
    await expect(other).toContainText('Video · 15:00 · Order matters.');

    // Its [0:55] opens that video at 0:55
    await other.getByRole('button', { name: /1\.1 · Ordered Pairs/ }).click();
    await other.getByTestId('note-time').filter({ hasText: '0:55' }).click();
    await expect(player.locator('iframe')).toHaveAttribute('src', new RegExp(`/embed/${CH1}\\?.*start=55`));
    await expect(notes.getByTestId('notes-video-title')).toHaveText('1.1 · Ordered Pairs');

    // Saved on the account: one note per video with its title, number and length, and the chapter note
    const saved = (await (await request.get(`${API_URL}/api/notes/${course._id}`, { headers: await studentHeaders(request) })).json()).notes;
    expect(saved.map((note) => [note.kind, note.lessonCode, note.lessonTitle, note.duration])).toEqual([
      ['chapter', '', '', 0],
      ['video', '1.1', 'Ordered Pairs', 900],
      ['video', '1.2', 'Cartesian Product', 900],
    ]);
  } finally {
    await archive();
  }
});

test('My Notes lists notes by chapter and video, finds words, and a time opens the lesson there', async ({ page, request }, testInfo) => {
  const { name, course, nodeIds, archive } = await addNotesCourse(request, testInfo);
  try {
    const headers = await studentHeaders(request);
    const save = (key, data) => request.put(`${API_URL}/api/notes/${course._id}/lessons/${encodeURIComponent(key)}`, { headers, data });
    await save(nodeIds[1], { text: 'Pairs from two sets.', chapterKey: '1', chapterName: 'Chapter 1: Functions', lessonTitle: 'Cartesian Product', lessonCode: '1.2', duration: 268 });
    await save(nodeIds[0], { text: 'Order matters.\n[0:55] Equal when both parts match.', chapterKey: '1', chapterName: 'Chapter 1: Functions', lessonTitle: 'Ordered Pairs', lessonCode: '1.1', duration: 190 });
    await save(nodeIds[2], { text: 'Use tan for heights.', chapterKey: '2', chapterName: 'Chapter 2: Applications', lessonTitle: 'Heights', lessonCode: '2.1', duration: 300 });
    await request.put(`${API_URL}/api/notes/${course._id}/1`, { headers, data: { text: 'Older chapter note.', chapterName: 'Chapter 1: Functions' } });

    await fakeLessonVideo(page);
    await openAsStudent(page, request);
    await page.goto('/my-notes');
    const tab = page.getByRole('tab', { name: new RegExp(name) });
    if (await tab.count()) await tab.click();
    await expect(page.getByTestId('my-notes-subject')).toHaveText(name);

    // Chapter by chapter, each video with its title and length, in lesson order
    const chapters = page.getByTestId('notes-chapter-section');
    await expect(chapters).toHaveCount(2);
    await expect(chapters.nth(0)).toContainText('Chapter 1: Functions');
    await expect(chapters.nth(0).getByTestId('notes-chapter-block')).toContainText('Older chapter note.');
    await expect(chapters.nth(0).getByTestId('notes-video-block')).toHaveText([/1\.1 · Ordered Pairs[\s\S]*Video · 3:10/, /1\.2 · Cartesian Product[\s\S]*Video · 4:28/]);
    await expect(chapters.nth(1).getByTestId('notes-video-block')).toContainText('2.1 · Heights');

    // Search my notes
    await page.getByTestId('my-notes-search').fill('two sets');
    await expect(page.getByTestId('notes-video-block')).toHaveCount(1);
    await expect(page.getByTestId('notes-video-block')).toContainText('Cartesian Product');
    await page.getByTestId('my-notes-search').fill('');

    // A time opens that lesson at that moment
    await page.getByTestId('notes-video-block').filter({ hasText: 'Ordered Pairs' }).getByTestId('note-time').click();
    const player = page.getByTestId('lesson-player');
    await expect(player.locator('iframe')).toHaveAttribute('src', new RegExp(`/embed/${CH1}\\?.*start=55`));
    await expect(page).toHaveURL(new RegExp(`/courses/${course.slug}$`));
  } finally {
    await archive();
  }
});

test('My Notes asks a visitor to sign in', async ({ page }) => {
  const visitor = await newVisitorPage(page);
  await visitor.goto('/my-notes');
  await expect(visitor.getByTestId('my-notes-page')).toContainText('Sign in to see your notes');
  await closeVisitorPages();
});
