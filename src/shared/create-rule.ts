import { OxlintUtils } from "corsa-oxlint";

export const createRule = OxlintUtils.RuleCreator(
  (name) => `https://eslint-plugin-awscdk.dev/rules/${name}`,
);
