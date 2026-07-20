import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";

export default defineConfig({
  base: "/AsteroidsJS/",
  test: {
    // Playwright owns e2e/**; vitest's default *.spec.js glob would
    // otherwise also try (and fail) to run those files.
    exclude: [...configDefaults.exclude, "e2e/**"],
  },
});
