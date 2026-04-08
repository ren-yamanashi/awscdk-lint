import * as eslint from "@eslint/js";
import cdkPlugin from "eslint-plugin-awscdk";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      cdkPlugin.configs.strict,
    ],
    languageOptions: {
      ecmaVersion: "latest",
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      "awscdk/require-passing-this": [
        "error",
        // { allowNonThisAndDisallowScope: true },
      ],
      "awscdk/no-parent-name-construct-id-match": ["error", { disallowContainingParentName: true }],
    },
  },
]);
