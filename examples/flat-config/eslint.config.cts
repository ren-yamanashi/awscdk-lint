const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");
const cdkPlugin = require("eslint-plugin-awscdk");

module.exports = defineConfig([
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      cdkPlugin.configs.strict,
    ],
    rules: {
      "awscdk/require-passing-this": [
        "error",
        // { allowNonThisAndDisallowScope: true },
      ],
      "awscdk/no-parent-name-construct-id-match": ["error", { disallowContainingParentName: true }],
    },
  },
]);
