import { defineConfig } from '@playwright/test';

const previewPort = 4321;
const previewHost = `http://127.0.0.1:${previewPort}`;

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  outputDir: 'qa/playwright-results',
  snapshotPathTemplate: 'tests/visual/__screenshots__/{arg}{ext}',
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
      threshold: 0.2,
      maxDiffPixelRatio: 0.001,
    },
  },
  use: {
    baseURL: previewHost,
    browserName: 'chromium',
    colorScheme: 'light',
    deviceScaleFactor: 1,
    locale: 'en-US',
    timezoneId: 'UTC',
    navigationTimeout: 30_000,
  },
  webServer: {
    command: `npm run build && npm run preview -- --host 127.0.0.1 --port ${previewPort}`,
    url: previewHost,
    timeout: 120_000,
    reuseExistingServer: false,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
