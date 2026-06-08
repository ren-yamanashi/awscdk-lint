## Versioning Policy

eslint-plugin-awscdk does **not** strictly follow [Semantic Versioning](https://semver.org/). Any rule change can add or remove reported errors in downstream codebases, which under strict semver would require a major bump.

### Major releases

A major bump marks a deliberate shift in the package's scope, capabilities, or supported environment. Adding individual rules within the existing scope is a minor bump, not a major one; rule additions become major only when they expand the scope itself. A major release does not imply breaking changes. Typical reasons:

- A new capability is added (e.g., supporting oxlint in addition to ESLint).
- A previously supported runtime (Node.js / ESLint / oxlint) version is dropped.
- The package's public API is restructured.

Released majors are distributed under the following npm dist-tags:

| dist-tag | Meaning |
| --- | --- |
| `latest` | Current stable major. Installed by `npm install -D eslint-plugin-awscdk`. |
| `next` | In-development next major (alpha / prerelease). Opt in with `npm install -D eslint-plugin-awscdk@next`. |

Prereleases are published under the `next` tag using a semver prerelease suffix (e.g. `5.0.0-alpha.0`). APIs and rule sets may change between prereleases; the line is promoted to `latest` once stable.

### Minor releases

A minor bump covers rule additions, removals, and non-bug-fix changes (e.g., new options). Typical reasons:

- A new rule is added.
- A new option is added to an existing rule.
- A rule or option is removed.

### Patch releases

A patch bump is safe to adopt without review. Typical reasons:

- A bug fix in a rule.
- A bug fix to core functionality.
- Documentation, refactoring, tests, and other non-user-facing changes.
- Re-releasing after a failed publish.

### Version pinning recommendations

Because a minor bump can introduce new lint errors, choose a range based on how much churn you want to absorb:

- **Tilde** (patch-only) — most stable build: `"eslint-plugin-awscdk": "~X.Y.Z"`
- **Caret** (minor + patch) — opt in to new rules over time: `"eslint-plugin-awscdk": "^X.Y.Z"`
- **Exact** — recommended for `@next` / alpha versions: `"eslint-plugin-awscdk": "X.Y.Z-alpha.N"`
