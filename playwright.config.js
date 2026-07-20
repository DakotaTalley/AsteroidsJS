import { defineConfig } from "@playwright/test";

// Dev server serves under vite.config.js's `base`, not the origin root.
const BASE_PATH = "/AsteroidsJS/";
const PORT = 5183;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}${BASE_PATH}`,
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npx vite --port ${PORT}`,
    url: `http://localhost:${PORT}${BASE_PATH}`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
