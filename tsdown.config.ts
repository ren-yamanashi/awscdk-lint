import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  clean: true,
  format: ["esm", "cjs"],
  dts: true,
  outputOptions: { exports: "named" },
  treeshake: true,
  fixedExtension: true,
});
