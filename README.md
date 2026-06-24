<p align="center">
  <img width="160px" height="160px" src="https://raw.githubusercontent.com/ren-yamanashi/eslint-plugin-awscdk/main/assets/logo.png" alt="awscdk-lint logo">
</p>

<h1 align="center">awscdk-lint</h1>
<p align="center">Lint plugins for AWS CDK projects (Oxlint and ESLint)</p>

This repository ships the same set of AWS CDK lint rules as two packages. Pick the one matching the linter your project uses:

| Linter | Package                                      | npm                                                                                                                 |
| ------ | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Oxlint | [`oxlint-plugin-awscdk`](./packages/oxlint/) | [![npm](https://img.shields.io/npm/v/oxlint-plugin-awscdk.svg)](https://www.npmjs.com/package/oxlint-plugin-awscdk) |
| ESLint | [`eslint-plugin-awscdk`](./packages/eslint/) | [![npm](https://img.shields.io/npm/v/eslint-plugin-awscdk.svg)](https://www.npmjs.com/package/eslint-plugin-awscdk) |

## 📔 Documentation

https://awscdk-lint.dev/

## Oxlint (`oxlint-plugin-awscdk`)

### Installation

```bash
# npm
npm install -D oxlint oxlint-plugin-awscdk

# yarn
yarn add -D oxlint oxlint-plugin-awscdk

# pnpm
pnpm install -D oxlint oxlint-plugin-awscdk
```

### Usage

#### `oxlint.config.ts`

```ts
// oxlint.config.ts
import { defineConfig } from "oxlint";
import cdkPlugin from "oxlint-plugin-awscdk";

export default defineConfig({
  extends: [
    // ✅ Add plugins
    cdkPlugin.configs.recommended, // or cdkPlugin.configs.strict
  ],
  rules: {
    // ✅ Add rules (use custom rules)
    "awscdk/require-jsdoc": "warn",
  },
});
```

#### `.oxlintrc.json`

```jsonc
{
  // ✅ Add plugins
  "jsPlugins": ["oxlint-plugin-awscdk"],
  "rules": {
    // ✅ Add rules
    "awscdk/construct-constructor-property": "error",
    "awscdk/no-construct-in-interface": "error",
    "awscdk/no-construct-in-public-property-of-construct": "error",
    "awscdk/no-construct-stack-suffix": "error",
    "awscdk/no-mutable-property-of-props-interface": "warn",
    "awscdk/no-mutable-public-property-of-construct": "warn",
    "awscdk/no-parent-name-construct-id-match": [
      "error",
      { "disallowContainingParentName": false },
    ],
    "awscdk/no-unused-props": "error",
    "awscdk/no-variable-construct-id": "error",
    "awscdk/pascal-case-construct-id": "error",
    "awscdk/prefer-grants-property": "warn",
    "awscdk/require-passing-this": ["error", { "allowNonThisAndDisallowScope": true }],
  },
}
```

## ESLint (`eslint-plugin-awscdk`)

### Installation

```bash
# npm
npm install -D eslint-plugin-awscdk

# yarn
yarn add -D eslint-plugin-awscdk

# pnpm
pnpm install -D eslint-plugin-awscdk
```

### Usage

Note: This plugin uses typescript type information and must be used in conjunction with [typescript-eslint](https://typescript-eslint.io/getting-started).

#### Flat Config

```js
// eslint.config.mjs
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import cdkPlugin from "eslint-plugin-awscdk";

export default defineConfig([
  {
    files: ["lib/**/*.ts", "bin/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      // ✅ Add plugins
      cdkPlugin.configs.recommended, // or cdkPlugin.configs.strict
    ],
    rules: {
      // ✅ Add rules (use custom rules)
      "awscdk/require-jsdoc": "warn",
    },
  },
]);
```

#### Classic Config

```js
// .eslintrc.cjs
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    project: "./tsconfig.json",
  },
  // ✅ Add plugins
  plugins: ["@typescript-eslint", "awscdk"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    // ✅ Add recommended config
    "plugin:awscdk/classicRecommended", // or "plugin:awscdk/classicStrict"
  ],
  rules: {
    // ✅ Add rules (use custom rules)
    "awscdk/require-jsdoc": "warn",
  },
};
```

## 📝 Rules

https://awscdk-lint.dev/rules/

## ❗ Issue

If you have any questions or suggestions, please open an [issue](https://github.com/ren-yamanashi/eslint-plugin-awscdk/issues).

## 💪 Contribution

Contributions are welcome! Please see [Contribution Guide](https://github.com/ren-yamanashi/eslint-plugin-awscdk/blob/main/CONTRIBUTING.md) for more details.

## ⚓ Versioning Policy

Please see [Versioning Policy](https://github.com/ren-yamanashi/eslint-plugin-awscdk/blob/main/VERSIONING_POLICY.md).

## ©️ License

[MIT](http://opensource.org/licenses/MIT)
