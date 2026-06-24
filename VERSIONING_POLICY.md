## Semantic Versioning Policy

`awscdk-lint` ships two packages (`eslint-plugin-awscdk` and `oxlint-plugin-awscdk`) from a single monorepo. Each package is versioned independently — releases are managed by [release-please](https://github.com/googleapis/release-please) and tags are published as `<package-name>@<version>`. Both packages follow the same semantic versioning policy described below.

To clarify when a minor or major version bump occurs, we've defined the following semantic versioning policy:

### Patch Release (intended to not break your lint build)

- A bug fix in a rule that results in fewer linting errors
- A bug fix to the core functionality
- Improvements to documentation
- Non-user-facing changes such as refactoring code, adding/modifying tests, and increasing test coverage
- Re-releasing after a failed release

### Minor Release (might break your lint build)

- A bug fix in a rule that results in more linting errors
- A new rule is added (disabled by default)
- A new option to an existing rule that does not result in more linting errors by default
- An existing rule is deprecated

### Major Release (likely to break your lint build)

A Major Release indicates that there are breaking changes. Users may need to update their configurations or code to use the new version. Examples of breaking changes include:

- The `recommended` config is updated, potentially resulting in new linting errors.
- A new rule is added and enabled by default in a shared config like `recommended`.
- Existing rules or functionality are removed (e.g., after a deprecation period).
- The public API of the plugin changes in an incompatible way.
- Changes that require a new minimum version of Node.js, ESLint, or Oxlint.

### Version Pinning Recommendations

We recommend using one of the following approaches in your `package.json`:

- Use tilde (`~`) to allow only patch releases:
  - `"eslint-plugin-awscdk": "~1.1.0"`
  - `"oxlint-plugin-awscdk": "~1.1.0"`
- Use caret (`^`) if you're comfortable with minor updates:
  - `"eslint-plugin-awscdk": "^1.1.0"`
  - `"oxlint-plugin-awscdk": "^1.1.0"`

Note that minor updates may report more linting errors than the previous release, so using tilde is recommended for more stable builds.
