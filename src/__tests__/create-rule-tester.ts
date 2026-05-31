import { RuleTester } from "corsa-oxlint";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// NOTE: pass the tsgo executable explicitly; corsa-oxlint does not auto-detect it.
const tsgoExecutable = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../node_modules/.bin/tsgo",
);

export const createRuleTester = (): RuleTester =>
  new RuleTester({
    settings: { corsaOxlint: { parserOptions: { corsa: { executable: tsgoExecutable } } } },
  });
