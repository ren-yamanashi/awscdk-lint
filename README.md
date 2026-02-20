<p align="center">
  <img width="160px" height="160px" src="https://raw.githubusercontent.com/ren-yamanashi/eslint-cdk-plugin/main/assets/logo.png" alt="ESLint plugin for AWS CDK logo">
</p>

<h1 align="center">eslint-cdk-plugin</h1>
<p align="center">ESLint plugin for AWS CDK</p>
<p align="center">
  <a href="https://www.npmjs.com/package/eslint-cdk-plugin">
    <img src="https://img.shields.io/npm/v/eslint-cdk-plugin.svg" alt="NPM">
  </a>
</p>

## 📔 Documentation

Please refer to the [website](https://eslint-cdk-plugin.dev/).

## ⚠️ Package Name Migration Notice

_**Important**: This package was previously published as `eslint-cdk-plugin`. Starting from v4.0.0, it has been renamed to `eslint-plugin-awscdk` to follow ESLint's official naming convention._

### Migration Steps

#### 1. Update `eslint-cdk-plugin` to latest version

```bash
# npm
npm install -D eslint-cdk-plugin@latest

# yarn
yarn add -D eslint-cdk-plugin@latest

# pnpm
pnpm install -D eslint-cdk-plugin@latest
```

#### 2. execute migration command

```bash
npx migrate-cdk-plugin
```

The old package name will continue to receive updates until for a while , after which it will be deprecated.

## 📦 Installation

```bash
# npm
npm install -D eslint-cdk-plugin

# yarn
yarn add -D eslint-cdk-plugin

# pnpm
pnpm install -D eslint-cdk-plugin
```

## 🚀 Usage

Note: This plugin uses typescript type information and must be used in conjunction with [typescript-eslint](https://typescript-eslint.io/getting-started).

### When using recommended config

```js
// eslint.config.mjs
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import cdkPlugin from "eslint-cdk-plugin";

export default defineConfig([
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["lib/**/*.ts", "bin/*.ts"],
    // ✅ Add plugins
    extends: [cdkPlugin.configs.recommended],
  },
]);
```

### When using custom config

```js
// eslint.config.mjs
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import cdkPlugin from "eslint-cdk-plugin";

export default defineConfig([
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["lib/**/*.ts", "bin/*.ts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        project: "./tsconfig.json",
      },
    },
    // ✅ Add plugins
    plugins: {
      cdk: cdkPlugin,
    },
    // ✅ Add rules (use custom rules)
    rules: {
      "cdk/no-construct-in-interface": "error",
      "cdk/no-construct-stack-suffix": "error",
      "cdk/no-parent-name-construct-id-match": "error",
    },
  },
]);
```

## ❗ Issue

If you have any questions or suggestions, please open an [issue](https://github.com/ren-yamanashi/eslint-cdk-plugin/issues).

## 💪 Contribution

Contributions are welcome! Please see [Contribution Guide](https://github.com/ren-yamanashi/eslint-cdk-plugin/blob/main/CONTRIBUTING.md) for more details.

## ⚓ Versioning Policy

Please see [Versioning Policy](https://github.com/ren-yamanashi/eslint-cdk-plugin/blob/main/VERSIONING_POLICY.md).

## ©️ License

[MIT](http://opensource.org/licenses/MIT)
