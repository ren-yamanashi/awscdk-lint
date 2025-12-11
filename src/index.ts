import { FlatConfig } from "@typescript-eslint/utils/ts-eslint";

import { configs } from "./configs";
import { rules } from "./rules";

export { configs, rules };

export interface EslintCdkPlugin {
  rules: typeof rules;
  configs: Readonly<{
    recommended: FlatConfig.Config;
    strict: FlatConfig.Config;
  }>;
}

const eslintCdkPlugin: EslintCdkPlugin = {
  rules,
  configs: {
    recommended: configs.recommended,
    strict: configs.strict,
  },
};

export default eslintCdkPlugin;
