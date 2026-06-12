import { ClassicConfig } from "@typescript-eslint/utils/ts-eslint";

import { configs } from "./configs";
import { FlatConfig } from "./configs/flat-config";
import { rules } from "./rules";

export { configs, rules };

export interface EslintCdkPlugin {
  rules: typeof rules;
  configs: Readonly<{
    classicRecommended: {
      plugins: ["awscdk"];
      rules: ClassicConfig.RulesRecord;
    };
    classicStrict: {
      plugins: ["awscdk"];
      rules: ClassicConfig.RulesRecord;
    };
    recommended: FlatConfig;
    strict: FlatConfig;
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
