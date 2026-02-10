import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  clean: true,
  format: ["esm", "cjs"],
  dts: true,
  inlineOnly: false,
  outputOptions: { exports: "named" },
  treeshake: true,
  fixedExtension: true,
});
