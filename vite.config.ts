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
    overrides: [
      {
        files: ["src/rules/oxlint/**/*.ts", "src/shared/safe-call.ts", "src/shared/type-name.ts"],
        rules: {
          "@typescript-eslint/no-explicit-any": "off",
        },
      },
    ],
  },
  test: {
    globals: true,
    root: "./src",
    include: ["./__tests__/**/*.test.ts"],
  },
  pack: {
    entry: ["src/index.ts"],
    outDir: "dist",
    clean: true,
    format: ["esm", "cjs"],
    dts: true,
    banner: {
      js: 'import { fileURLToPath as __vp_fileURLToPath } from "node:url"; import { dirname as __vp_dirname } from "node:path"; const __filename = __vp_fileURLToPath(import.meta.url); const __dirname = __vp_dirname(__filename);',
    },
    outputOptions: {
      exports: "named",
    },
    treeshake: true,
    fixedExtension: true,
    deps: {
      onlyBundle: false,
    },
  },
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
