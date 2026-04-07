import { ESLintUtils } from "@typescript-eslint/utils";
import { OxlintUtils } from "corsa-oxlint";

export const createRule = ESLintUtils.RuleCreator(
  (name) => `https://eslint-plugin-awscdk.dev/rules/${name}`,
);

export const createRuleOxlint = OxlintUtils.RuleCreator(
  (name) => `https://eslint-plugin-awscdk.dev/rules/${name}`,
);
