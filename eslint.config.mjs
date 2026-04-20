import prettier from "eslint-config-prettier/flat";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

/**
 * Shared plugins and rules for the Masumi Identity SDK monorepo.
 * Mirrors masumi-saas conventions for consistency across repos.
 */
export const sharedPlugins = {
  "simple-import-sort": simpleImportSort,
  "unused-imports": unusedImports,
};

export const sharedRules = {
  "simple-import-sort/imports": "error",
  "simple-import-sort/exports": "error",
  "unused-imports/no-unused-imports": "error",
  "import/first": "error",
  "import/newline-after-import": "error",
  "import/no-duplicates": "error",

  "@typescript-eslint/no-unused-vars": [
    "warn",
    {
      varsIgnorePattern: "^_",
      argsIgnorePattern: "^_",
      caughtErrorsIgnorePattern: "^_",
      destructuredArrayIgnorePattern: "^_",
    },
  ],
  "@typescript-eslint/no-explicit-any": "error",
};

const baseConfig = [
  {
    ignores: ["**/dist/**", "**/build/**", "**/node_modules/**", "**/coverage/**"],
  },
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...tseslint.configs.recommended,
  prettier,
  {
    plugins: {
      ...sharedPlugins,
      import: importPlugin,
    },
    rules: sharedRules,
  },
];

export default baseConfig;
