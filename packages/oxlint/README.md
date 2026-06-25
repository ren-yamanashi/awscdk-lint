<p align="center">
  <img width="160px" height="160px" src="https://raw.githubusercontent.com/ren-yamanashi/eslint-plugin-awscdk/main/assets/logo.png" alt="oxlint-plugin-awscdk logo">
</p>

<h1 align="center">oxlint-plugin-awscdk</h1>
<p align="center">Oxlint plugin for AWS CDK — part of <a href="https://awscdk-lint.dev/">awscdk-lint</a></p>
<p align="center">
  <a href="https://www.npmjs.com/package/oxlint-plugin-awscdk">
    <img src="https://img.shields.io/npm/v/oxlint-plugin-awscdk.svg" alt="NPM">
  </a>
</p>

> [!WARNING]
> **Experimental.** `oxlint-plugin-awscdk` is in an early, experimental stage. The public API, rule set, preset contents, and config shape may change without notice prior to the first stable (`1.0.0`) release. It also depends on [`corsa-oxlint`](https://www.npmjs.com/package/corsa-oxlint), which has not yet reached a stable release.

## 📔 Documentation

https://awscdk-lint.dev/getting-started/oxlint/

## 📦 Installation

```bash
# npm
npm install -D oxlint oxlint-plugin-awscdk

# yarn
yarn add -D oxlint oxlint-plugin-awscdk

# pnpm
pnpm install -D oxlint oxlint-plugin-awscdk
```

## 🚀 Usage

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
