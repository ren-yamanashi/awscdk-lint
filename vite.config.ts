import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    semi: true,
    printWidth: 100,
    trailingComma: "all",
    sortImports: {
      newlinesBetween: true,
      groups: [
        "type-import",
        ["value-builtin", "value-external"],
        "type-internal",
        "value-internal",
        ["type-parent", "type-sibling", "type-index"],
        ["value-parent", "value-sibling", "value-index"],
        "unknown",
      ],
    },
  },
  lint: {
    env: {
      builtin: true,
    },
    ignorePatterns: ["*.js", "dist", "node_modules", "package.json", "docs", "examples"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  test: {
    projects: ["packages/*"],
  },
  run: {
    tasks: {
      "test:integration": {
        cache: false,
        command: "bash scripts/integration-test.sh",
      },
    },
  },
});
