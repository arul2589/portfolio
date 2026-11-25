import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    launchOptions: { executablePath: process.env.CHROME_PATH || undefined, args: ['--no-sandbox'] },
  },
  webServer: { command: 'node scripts/serve.mjs', url: 'http://127.0.0.1:4173/healthz', reuseExistingServer: true },
});
