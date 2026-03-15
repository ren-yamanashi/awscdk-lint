# Contributing to eslint-plugin-awscdk

Thank you for your interest in contributing to eslint-plugin-awscdk!  
This document provides guidelines and steps for contributing.

## Issues

See each issue templates

- [Bug Report](./.github/ISSUE_TEMPLATE/bug-report.yml)
- [Feature Request](./.github/ISSUE_TEMPLATE/feature-request.yml)
- [Documentation](./.github/ISSUE_TEMPLATE/documentation.yml)

## Pull Requests

### Development Setup

```bash
# Clone your fork
https://github.com/ren-yamanashi/eslint-plugin-awscdk.git


# When using pnpm
pnpm install --frozen-lockfile # Install dependencies
pnpm test                      # tests
pnpm check                     # lint, format, type-check
pnpm pack                      # build

# When using vite+
vp install -- frozen-lockfile  # Install dependencies
vp test --run                  # tests
vp check                       # lint, format, type-check
vp pack                        # build
```

### Project Structure

```text
src/
├── rules/           # Rule implementations (one file per rule)
├── __tests__/       # Unit tests for each rule
├── configs/         # Preset configurations (recommended, strict)
├── core/            # Core logic shared across rules
│   ├── cdk-construct/   # Core logic related to CDK constructs
│   ├── ts-type/         # TypeScript type utilities (class check, base type traversal, etc.)
│   └── ast-node/        # ESTree AST node utilities (find constructor, public properties, etc.)
├── shared/          # Shared utilities
└── index.ts         # Plugin entry point (exports rules and configs)

docs/                # VitePress documentation site (EN and JA)
examples/            # Integration test examples (flat-config and classic-config)
```

### Creating a New Rule

When adding a new rule, the following files need to be created or updated.

#### 1. Implement the rule and tests

- `src/rules/<rule-name>.ts` — Rule implementation (file name must match the rule name)
- `src/__tests__/<rule-name>.test.ts` — Unit tests

#### 2. Register the rule

- `src/rules/index.ts` — Import and add the rule to the `rules` record
- `src/configs/flat-config.ts` — Add the rule to the flat config preset (`recommended` and/or `strict`)
  - keep the rules in alphabetical order for readability
- `src/configs/classic-config.ts` — Add the rule to the classic config preset
  - keep the rules in alphabetical order for readability

**_flat-config and classic-config_**

This plugin supports two ESLint configuration formats. Both config files must define the same rule entries with the same severity and options.

|             | Flat config                      | Classic config                        |
| ----------- | -------------------------------- | ------------------------------------- |
| Config file | `eslint.config.mjs` (ESLint v9+) | `.eslintrc.*` (ESLint v8 and earlier) |
| Source      | `src/configs/flat-config.ts`     | `src/configs/classic-config.ts`       |

#### 3. Documentation (optional)

Documentation is handled by the maintainers, so it is not required in your PR. If you do add documentation, the following files are involved:

- `docs/rules/<rule-name>.md` — English rule documentation
- `docs/rules/index.md` — Add a `<RuleItem>` entry (keep alphabetical order)
- `docs/.vitepress/config.mts` — Add sidebar entries for both EN and JA (keep alphabetical order)

**_Note:_** Japanese documentation (`docs/ja/`) and Playground links are not required. The maintainers will handle them.

#### 4. Example files (optional)

**_Note:_** Example files under `examples/` are not required. The maintainers will add them.

## Questions?

Feel free to create an issue for any questions about contributing!

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
