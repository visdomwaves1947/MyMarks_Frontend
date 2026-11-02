import { defineConfig, devices } from '@playwright/test';

export const API_URL = 'http://localhost:5050';

// A *.localhost address, so the site uses this API and not the one on port 5000
export const SITE_URL = 'http://mymarks.localhost:4173';

// Test-only logins for the in-memory database started below
const testEnv = {
  E2E_ADMIN_EMAIL: 'owner@mymarks.test',
  E2E_ADMIN_PASSWORD: 'e2e-admin-password',
  E2E_STUDENT_EMAIL: 'student@mymarks.test',
  E2E_STUDENT_PASSWORD: 'e2e-student-password',
};
Object.assign(process.env, testEnv);

export default defineConfig({
  testDir: './e2e',
  // The tests share one database and build on each other's courses
  workers: 1,
  fullyParallel: false,
  timeout: 45000,
  expect: { timeout: 8000 },
  reporter: [['list']],
  use: {
    baseURL: SITE_URL,
    channel: 'chrome',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1366, height: 800 } } },
    {
      name: 'phone',
      use: { ...devices['Pixel 7'], channel: 'chrome' },
      testMatch: /site\.spec\.js/,
    },
  ],
  webServer: [
    {
      command: 'node ../MyMarks_Backend/scripts/e2eServer.js',
      url: `${API_URL}/api/health`,
      env: testEnv,
      timeout: 120000,
      reuseExistingServer: false,
    },
    {
      command: 'npx vite build && npx vite preview --port 4173 --strictPort',
      url: 'http://localhost:4173',
      env: { VITE_API_URL: API_URL },
      timeout: 120000,
      reuseExistingServer: false,
    },
  ],
});
