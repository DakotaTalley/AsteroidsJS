import js from "@eslint/js";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  { ignores: ["dist/**"] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ["playwright.config.js", "vite.config.js", "e2e/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  eslintConfigPrettier,
];
