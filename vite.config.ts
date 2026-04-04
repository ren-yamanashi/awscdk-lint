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
    globals: true,
    root: "./",
    include: ["./src/__tests__/**/*.test.ts", "./scripts/**/__tests__/**/*.test.ts"],
  },
  pack: [
    {
      entry: ["src/index.ts"],
      outDir: "dist",
      clean: true,
      format: ["esm", "cjs"],
      dts: true,
      outputOptions: {
        exports: "named",
      },
      treeshake: true,
      fixedExtension: true,
      deps: {
        onlyBundle: false,
      },
    },
    {
      entry: ["scripts/migration/index.ts"],
      outDir: "bin",
      clean: true,
      format: ["esm"],
      dts: false,
      platform: "node",
      treeshake: true,
      fixedExtension: true,
      deps: {
        onlyBundle: false,
      },
    },
  ],
  staged: {
    "*": ["vp check --fix", "sh scripts/secretlint.sh"],
  },
  run: {
    tasks: {
      "test:integration": {
        cache: false,
        command: "sh scripts/integration-test.sh",
      },
    },
  },
});
