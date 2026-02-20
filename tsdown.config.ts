import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    outDir: "dist",
    clean: true,
    format: ["esm", "cjs"],
    dts: true,
    outputOptions: { exports: "named" },
    treeshake: true,
    fixedExtension: true,
    inlineOnly: false,
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
    inlineOnly: false,
  },
]);
