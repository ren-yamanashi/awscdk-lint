import eslint from "@eslint/js";
import cdkPlugin from "eslint-plugin-awscdk";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    extends: [cdkPlugin.configs.strict],
    rules: {
      "awscdk/require-passing-this": [
        "error",
        // { allowNonThisAndDisallowScope: true },
      ],
      "awscdk/no-parent-name-construct-id-match": ["error", { disallowContainingParentName: true }],
    },
  },
  {
    ignores: ["eslint.config.mjs", "eslint.config.cjs", "*.d.ts", "node_modules"],
  },
]);
