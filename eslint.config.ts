import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import tsEslint from "typescript-eslint";

export default defineConfig(
  eslint.configs.recommended,
  ...tsEslint.configs.strictTypeChecked,
  ...tsEslint.configs.stylisticTypeChecked,
  {
    files: ["src/*.{mts,ts}", "src/**/*.{mts,ts}", "*.config.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      parser: tsEslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      "@typescript-eslint/consistent-indexed-object-style": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "require-await": "off",
      "@typescript-eslint/require-await": "error",
      "no-empty-function": "off",
      "@typescript-eslint/no-empty-function": "warn",
      "import/order": [
        "warn",
        {
          alphabetize: { order: "asc" },
          "newlines-between": "always",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    ignores: ["*.js", "dist", "node_modules", ".vscode", "package.json", "docs", "examples"],
  },
);
