---
title: awscdk-lint - Getting Started (Oxlint)
titleTemplate: ":title"
---

# Oxlint (`oxlint-plugin-awscdk`)

## インストール

::: code-group

```sh [npm]
npm install -D oxlint oxlint-plugin-awscdk
```

```sh [yarn]
yarn add -D oxlint oxlint-plugin-awscdk
```

```sh [pnpm]
pnpm install -D oxlint oxlint-plugin-awscdk
```

:::

## oxlint の設定

### `oxlint.config.ts`

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

### `.oxlintrc.json`

```json
// .oxlintrc.json
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
      { "disallowContainingParentName": false }
    ],
    "awscdk/no-unused-props": "error",
    "awscdk/no-variable-construct-id": "error",
    "awscdk/pascal-case-construct-id": "error",
    "awscdk/prefer-grants-property": "warn",
    "awscdk/require-passing-this": ["error", { "allowNonThisAndDisallowScope": true }]
  }
}
```
