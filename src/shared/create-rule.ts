import { OxlintUtils } from "corsa-oxlint";

// NOTE: Use OxlintUtils.RuleCreator (not ESLintUtils.RuleCreator) so the produced rule
// definition is guaranteed compatible with the oxlint runtime.
export const createRule = OxlintUtils.RuleCreator(
  (name) => `https://eslint-plugin-awscdk.dev/rules/${name}`,
);
