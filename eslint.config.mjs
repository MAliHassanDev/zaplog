// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import vitest from "@vitest/eslint-plugin";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true },
      ],
      "@typescript-eslint/array-type": ["error", { default: "generic" }],
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  {
    files: ["tests/**"],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
    },
    settings: {
      vitest: {
        typecheck: true,
      },
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
  },
  {
    ignores: ["build/**", "**/*.mjs", "**/*.js", "**/*.config.ts"],
  },
  {
    files: ["**/*.js"],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
