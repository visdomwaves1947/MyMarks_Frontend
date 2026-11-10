import { test, expect } from '@playwright/test';
import { API_URL, getAdminToken, openAsAdmin, openAsVisitor } from './helpers';

// Points from the 7 November bug report: the refund picture, Refresh Requests and the admin video window

const adminHeaders = async (request) => ({ Authorization: `Bearer ${await getAdminToken(request)}` });

test('the refund guarantee card shows the clean picture, not a checkerboard', async ({ page }) => {
  await openAsVisitor(page);
  await page.goto('/demo');
  const picture = page.getByRole('img', { name: '100% Refund Guarantee' }).first();
  await picture.scrollIntoViewIfNeeded();
  await expect(picture).toHaveAttribute('src', '/home/refund-guarantee.jpg');
  await expect.poll(() => picture.evaluate((img) => img.complete && img.naturalWidth)).toBeGreaterThan(0);
});

test('Refresh Requests loads a new request at once and says so', async ({ page, request }, testInfo) => {
  await openAsAdmin(page, request);
  await page.goto('/admin');
  await page.getByRole('button', { name: /Bookings & Inquiries/ }).first().click();
  const refresh = page.getByTestId('refresh-bookings');
  await expect(refresh).toBeVisible();

  // A request sent after the page opened
  const name = `Refresh ${testInfo.project.name} ${Date.now()}`;
  const sent = await request.post(`${API_URL}/api/contact`, {
    data: {
      name,
      email: 'parent@mymarks.test',
      phone: '9000000003',
      subject: 'Admissions',
      message: 'Enrollment request for Mathematics. Year: First Year. Goal: Full marks. Focus: Algebra',
    },
  });
  expect(sent.ok(), await sent.text()).toBeTruthy();
  const rows = page.getByRole('row').filter({ hasText: name });
  await expect(rows).toHaveCount(0);

  try {
    await refresh.click();
    await expect(rows.first()).toBeVisible();
    await expect(page.getByText(/^Requests updated: \d+ requests?$/)).toBeVisible();
    await expect(page.getByTestId('bookings-updated')).toContainText('Updated at');
    await expect(refresh).toHaveText('Refresh Requests');
  } finally {
    const headers = await adminHeaders(request);
    const { bookings = [] } = await (await request.get(`${API_URL}/api/admin/bookings`, { headers })).json();
    for (const booking of bookings.filter((b) => JSON.stringify(b).includes(name))) {
      await request.delete(`${API_URL}/api/admin/bookings/${booking._id || booking.id}`, { headers });
    }
  }
});

test('the admin video window keeps its top bar on screen when it is taller than the window', async ({ page, request }, testInfo) => {
  const headers = await adminHeaders(request);
  const title = `Preview ${testInfo.project.name} ${Date.now()}`;
  const created = await request.post(`${API_URL}/api/videos`, {
    headers,
    data: { title, url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ', subject: 'Mathematics', status: 'published' },
  });
  expect(created.ok(), await created.text()).toBeTruthy();
  const made = await created.json();
  const videoId = made.data?._id || made.video?._id || made._id;

  try {
    // A short laptop window, where the old window lost its top bar
    if (testInfo.project.name === 'desktop') await page.setViewportSize({ width: 1280, height: 560 });
    await page.route('https://www.youtube.com/embed/**', (route) =>
      route.fulfill({ contentType: 'text/html', body: '<html><body>player</body></html>' })
    );
    await openAsAdmin(page, request);
    await page.goto('/admin');
    await page.getByRole('button', { name: /Videos, YouTube & Links/ }).first().click();
    await page.getByTitle('Grid Card View').click();
    await page.getByRole('heading', { name: title }).first().click();

    const modal = page.getByTestId('video-preview-modal');
    await expect(modal).toBeVisible();
    const copy = modal.getByTitle('Copy Link URL');
    await expect(copy).toBeVisible();
    const box = await copy.boundingBox();
    expect(box.y, 'the top bar starts inside the window').toBeGreaterThanOrEqual(0);
  } finally {
    await request.delete(`${API_URL}/api/videos/${videoId}`, { headers });
  }
});
