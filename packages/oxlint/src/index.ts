import { version } from "../package.json";
import { configs, OxlintConfig } from "./configs";
import { rules } from "./rules";
import { resolveBundledTsgo } from "./shared/native-preview";

// TODO: Drop once corsa-oxlint can resolve `@typescript/native-preview` from the calling plugin's module location.
// https://github.com/ubugeeei-prod/corsa-bind/issues/363
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
  rules,
  configs,
};

export default oxlintCdkPlugin;
