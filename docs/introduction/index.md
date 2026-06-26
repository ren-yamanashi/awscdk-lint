---
title: awscdk-lint - Introduction
titleTemplate: ":title"
---

# Introduction

`awscdk-lint` provides **Oxlint** and **ESLint** plugins for the [AWS Cloud Development Kit (AWS CDK)](https://aws.amazon.com/cdk/).

The same set of CDK rules is offered through two packages:

- [`oxlint-plugin-awscdk`](https://www.npmjs.com/package/oxlint-plugin-awscdk) — for projects using Oxlint
- [`eslint-plugin-awscdk`](https://www.npmjs.com/package/eslint-plugin-awscdk) — for projects using ESLint

Pick whichever linter your project already uses. The rules detect the same issues:

- Syntax errors
- Violations of AWS CDK best practices

Integrating either linter with your editor is also convenient for checking code in real-time.

- [VSCode Oxc (Oxlint) Extension](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode)
- [VSCode ESLint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Zed Oxc (Oxlint) Extension](https://zed.dev/extensions/oxc)

## 🚥 Versioning policy

Please see [Versioning Policy](https://github.com/ren-yamanashi/awscdk-lint/blob/main/VERSIONING_POLICY.md).

## 📰 Changelog

We are using [GitHub Releases](https://github.com/ren-yamanashi/awscdk-lint/releases).

## 🔒 License

See the [LICENSE](https://github.com/ren-yamanashi/awscdk-lint/blob/main/LICENSE) file for license rights and limitations (MIT).
