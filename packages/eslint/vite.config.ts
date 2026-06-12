import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    globals: true,
    include: ["src/__tests__/**/*.test.ts"],
  },
  pack: {
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
});
