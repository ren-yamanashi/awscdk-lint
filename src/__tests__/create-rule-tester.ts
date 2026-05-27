import { RuleTester } from "corsa-oxlint/rule-tester";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// NOTE: Resolve the tsgo executable installed at the repo root.
// corsa-oxlint does not auto-detect it, so the path must be passed explicitly.
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const tsgoExecutable = resolve(repoRoot, "node_modules/.bin/tsgo");

type TestCases = Parameters<RuleTester["run"]>[2];

// NOTE: corsa-oxlint's RuleTester `Config` type does not declare `settings`, but
// its wrapper reads `settings.corsaOxlint` at runtime, so widen the type.
type TesterConfig = NonNullable<ConstructorParameters<typeof RuleTester>[0]>;
type TesterConfigWithSettings = TesterConfig & {
  settings?: { corsaOxlint?: { parserOptions?: { corsa?: { executable?: string } } } };
};

interface RuleTesterLike {
  run: (ruleName: string, rule: Record<string, unknown>, tests: TestCases) => void;
}

/**
 * Create a RuleTester configured with the tsgo executable so type-aware oxlint
 * rules can be tested. Fixtures should define types locally (e.g.
 * `class Construct {}`) because the temporary workspace cannot resolve
 * `aws-cdk-lib`.
 *
 * NOTE: The underlying RuleTester writes every test case to a single
 * `fixture.ts` in one shared workspace. tsgo reads type information from that
 * file on disk, so cases whose types differ would contaminate each other. To
 * isolate them, each case is run in its own `run()` call (a fresh workspace).
 */
export const createRuleTester = (): RuleTesterLike => {
  const config: TesterConfigWithSettings = {
    settings: {
      corsaOxlint: {
        parserOptions: { corsa: { executable: tsgoExecutable } },
      },
    },
  };
  const tester = new RuleTester(config);

  return {
    run(ruleName, rule, tests) {
      for (const test of tests.valid ?? []) {
        tester.run(ruleName, rule, { valid: [test], invalid: [] });
      }
      for (const test of tests.invalid ?? []) {
        tester.run(ruleName, rule, { valid: [], invalid: [test] });
      }
    },
  };
};
