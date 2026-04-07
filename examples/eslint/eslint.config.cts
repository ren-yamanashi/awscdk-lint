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
    languageOptions: {
      ecmaVersion: "latest",
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    settings: {
      typescriptOxlint: {
        parserOptions: {
          projectService: true,
          tsgo: {
            executable: "./node_modules/.bin/tsgo",
          },
        },
      },
    },
    rules: {
      "awscdk/construct-constructor-property-oxlint": "error",
      "awscdk/migrate-disable-comments-oxlint": "error",
      "awscdk/no-construct-in-interface-oxlint": "error",
      "awscdk/no-construct-in-public-property-of-construct-oxlint": "error",
      "awscdk/no-construct-stack-suffix-oxlint": "error",
      "awscdk/no-mutable-property-of-props-interface-oxlint": "error",
      "awscdk/no-mutable-public-property-of-construct-oxlint": "error",
      "awscdk/no-parent-name-construct-id-match-oxlint": [
        "error",
        { disallowContainingParentName: true },
      ],
      "awscdk/no-unused-props-oxlint": "error",
      "awscdk/no-variable-construct-id-oxlint": "error",
      "awscdk/pascal-case-construct-id-oxlint": "error",
      "awscdk/prefer-grants-property-oxlint": "error",
      "awscdk/prevent-construct-id-collision-oxlint": "error",
      "awscdk/props-name-convention-oxlint": "error",
      "awscdk/require-jsdoc-oxlint": "error",
      "awscdk/require-passing-this-oxlint": "error",
      "awscdk/require-props-default-doc-oxlint": "error",
    },
  },
]);
