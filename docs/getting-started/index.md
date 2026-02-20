---
title: eslint-plugin-awscdk - Getting Started
titleTemplate: ":title"
---

# eslint-plugin-awscdk

## Install

Just run this:

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

Write `eslint.config.mjs` as follows:

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

## Migration from eslint-cdk-plugin

This package was previously published as `eslint-cdk-plugin`. Starting from v4.0.0, it has been renamed to `eslint-plugin-awscdk` to follow ESLint's official naming convention.

### Migration Steps

#### 1. Update `eslint-cdk-plugin` to latest version

::: code-group

```sh [npm]
npm install -D eslint-cdk-plugin@latest
```

```sh [yarn]
yarn add -D eslint-cdk-plugin@latest
```

```sh [pnpm]
pnpm install -D eslint-cdk-plugin@latest
```

:::

#### 2. execute migration command

```bash
npx migrate-cdk-plugin
```

The old package name will continue to receive updates until for a while , after which it will be deprecated.
