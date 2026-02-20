---
title: eslint-plugin-awscdk - Getting Started
titleTemplate: ":title"
---

# eslint-plugin-awscdk

## インストール

以下のコマンドを実行してインストールします。

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

## eslint の設定

`eslint.config.mjs` を以下のように記述します。

<div class="info-item">
  🚨 このプラグインは typescript の型情報を使う為
  <a href="https://typescript-eslint.io/getting-started">
    typescript-eslint
  </a>
  との併用が必要になります。
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

## eslint-cdk-plugin からの移行

本パッケージは以前 `eslint-cdk-plugin` として提供しておりましたが、v4.0.0 以降、ESLint の公式命名規則に従うため `eslint-plugin-awscdk` に名称変更いたしました。

### 移行手順

### 1. `eslint-cdk-plugin` を最新バージョンに更新

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

### 2. 移行コマンドを実行

```sh
npx migrate-cdk-plugin
```

古いパッケージ名もしばらくの間更新が続きますが、その後非推奨となります。
