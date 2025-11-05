import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30000,
  retries: 0,
  use: {
    env: { VITE_E2E: "true" },
    headless: true,
    baseURL: "http://localhost:5173",
    viewport: { width: 1280, height: 800 },
    javaScriptEnabled: true,
  },
  webServer: {
    command: "npm run dev",
    port: 5173,
    reuseExistingServer: true,
  },
});
