---
title: awscdk-lint - Introduction
titleTemplate: ":title"
---

# Introduction

`awscdk-lint` は [AWS Cloud Development Kit (AWS CDK)](https://aws.amazon.com/cdk/) 向けの Lint プラグインを **Oxlint** と **ESLint** の両方に提供するプロジェクトです。

同じ CDK 向けルールセットを 2 つのパッケージで提供します。

- [`oxlint-plugin-awscdk`](https://www.npmjs.com/package/oxlint-plugin-awscdk) — Oxlint を使うプロジェクト向け
- [`eslint-plugin-awscdk`](https://www.npmjs.com/package/eslint-plugin-awscdk) — ESLint を使うプロジェクト向け

普段使用している linter に合わせて選択してください。どちらのルールも、以下のような問題を検出します。

- 構文エラー
- AWS CDK のベストプラクティス違反

また、それぞれの linter をエディタと統合することで、リアルタイムにコードをチェックできて便利です。

- [VSCode Oxc (Oxlint) 拡張機能](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode)
- [VSCode ESLint 拡張機能](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## 🚥 Versioning policy

[Versioning Policy](https://github.com/ren-yamanashi/eslint-plugin-awscdk/blob/main/VERSIONING_POLICY.md) をご覧ください。

## 📰 Changelog

[GitHub Releases](https://github.com/ren-yamanashi/eslint-plugin-awscdk/releases) を使用しています。

## 🔒 License

ライセンスの権利と制限 (MIT) については、[LICENSE](https://github.com/ren-yamanashi/eslint-plugin-awscdk/blob/main/LICENSE)ファイルを参照してください。
