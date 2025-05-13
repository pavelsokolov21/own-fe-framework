import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import vitest from "@vitest/eslint-plugin";

export default defineConfig([
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["__tests__/**"],
    plugins: {
      vitest,
    },
    rules: vitest.configs.all.rules,
  },
]);
