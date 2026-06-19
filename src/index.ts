import type { Linter } from "eslint";

import { configs } from "./configs";
import { FlatConfig } from "./configs/flat-config";
import { OxlintConfig } from "./configs/oxlint-config";
import { rules } from "./rules";

export { configs, rules };

export interface EslintCdkPlugin {
  rules: typeof rules;
  configs: Readonly<{
    classicRecommended: {
      plugins: ["awscdk"];
      rules: Linter.RulesRecord;
    };
    classicStrict: {
      plugins: ["awscdk"];
      rules: Linter.RulesRecord;
    };
    recommended: FlatConfig;
    strict: FlatConfig;
    oxlintRecommended: OxlintConfig;
    oxlintStrict: OxlintConfig;
  }>;
}

const eslintCdkPlugin: EslintCdkPlugin = {
  rules,
  configs: {
    classicRecommended: configs.classicRecommended,
    classicStrict: configs.classicStrict,
    recommended: configs.recommended,
    strict: configs.strict,
    oxlintRecommended: configs.oxlintRecommended,
    oxlintStrict: configs.oxlintStrict,
  },
};

export default eslintCdkPlugin;
