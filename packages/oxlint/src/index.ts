import { version } from "../package.json";
import { configs, OxlintConfig } from "./configs";
import { rules } from "./rules";

export { configs, rules };

export interface OxlintCdkPlugin {
  meta: { name: string; version: string };
  rules: typeof rules;
  configs: Readonly<{
    recommended: OxlintConfig;
    strict: OxlintConfig;
  }>;
}

const oxlintCdkPlugin: OxlintCdkPlugin = {
  meta: { name: "awscdk", version },
  rules,
  configs,
};

export default oxlintCdkPlugin;
