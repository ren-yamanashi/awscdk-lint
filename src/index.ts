import type { Linter } from "eslint";

import { configs } from "./configs";
import { EslintFlatConfig } from "./configs/eslint/flat-config";
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
    recommended: EslintFlatConfig;
    strict: EslintFlatConfig;
  }>;
}

const eslintCdkPlugin: EslintCdkPlugin = {
  rules,
  configs: {
    classicRecommended: configs.classicRecommended,
    classicStrict: configs.classicStrict,
    recommended: configs.recommended,
    strict: configs.strict,
  },
};

export default eslintCdkPlugin;
