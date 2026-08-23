import { definePlugin } from "corsa-oxlint";

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
  rules: definePlugin({
    meta: { name: "awscdk" },
    resolveFrom: import.meta.url,
    rules,
    configs,
  }).rules as typeof rules,
  configs,
};

export default oxlintCdkPlugin;
