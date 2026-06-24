---
title: awscdk-lint - Getting Started (ESLint)
titleTemplate: ":title"
---

# ESLint (`eslint-plugin-awscdk`)

## Install

::: code-group

```sh [npm]
npm install -D eslint-plugin-awscdk
```

```sh [yarn]
yarn add -D eslint-plugin-awscdk
```

```sh [pnpm]
pnpm install -D eslint-plugin-awscdk
```

:::

## Setting eslint config

<div class="info-item">
  🚨 This plugin uses typescript type information and must be used in conjunction with
  <a href="https://typescript-eslint.io/getting-started">
    typescript-eslint
  </a>
</div>

### Flat Config

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

### Classic Config

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
