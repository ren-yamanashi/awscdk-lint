import { definePlugin } from "corsa-oxlint";

import { version } from "../package.json";
import { configs, OxlintConfig } from "./configs";
import { rules } from "./rules";
import { resolveBundledTsgo } from "./shared/native-preview";

// Force plugin-bundled native-preview via CORSA_EXECUTABLE. corsa-oxlint honors
// the `resolveFrom` anchor below only as a fallback after the consumer rootDir,
// so a consumer that happens to have an incompatible `@typescript/native-preview`
// installed in its own node_modules would otherwise crash the plugin at runtime.
if (!process.env.CORSA_EXECUTABLE) {
  const bundledTsgo = resolveBundledTsgo();
  if (bundledTsgo) process.env.CORSA_EXECUTABLE = bundledTsgo;
}

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
