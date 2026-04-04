const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");
const cdkPlugin = require("eslint-cdk-plugin");

module.exports = defineConfig([
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    extends: [cdkPlugin.configs.strict],
    rules: {
      "cdk/require-passing-this": [
        "error",
        // { allowNonThisAndDisallowScope: true },
      ],
      "cdk/no-parent-name-construct-id-match": ["error", { disallowContainingParentName: true }],
    },
  },
  {
    ignores: ["eslint.config.mjs", "eslint.config.cjs", "*.d.ts", "node_modules"],
  },
]);
