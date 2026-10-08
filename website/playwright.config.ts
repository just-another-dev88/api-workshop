import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
// The site is served under the GitHub Pages baseUrl, e.g. /api-workshop/
const BASE_PATH = process.env.BASE_URL ?? '/api-workshop/';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}${BASE_PATH}`,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  // Serves the production build (run `npm run build` first).
  webServer: {
    command: `npx docusaurus serve --port ${PORT} --no-open`,
    url: `http://localhost:${PORT}${BASE_PATH}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
