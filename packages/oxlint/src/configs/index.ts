import { resolveBundledTsgo } from "../shared/native-preview";

type RuleSeverity = "allow" | "off" | "warn" | "error" | "deny" | number;
type RuleEntry = RuleSeverity | [RuleSeverity, ...unknown[]];

type CorsaOxlintSettings = {
  corsa?: {
    executable?: string;
  };
};

export type OxlintConfig = {
  jsPlugins: ["oxlint-plugin-awscdk"];
  settings?: { corsaOxlint?: CorsaOxlintSettings };
  rules: Record<string, RuleEntry>;
};

// TODO: Drop once corsa-oxlint can resolve `@typescript/native-preview` from the calling plugin's module location.
// https://github.com/ubugeeei-prod/corsa-bind/issues/363
const bundledTsgo = resolveBundledTsgo();

const createOxlintConfig = (rules: Record<string, RuleEntry>): OxlintConfig => ({
  jsPlugins: ["oxlint-plugin-awscdk"],
  ...(bundledTsgo
    ? { settings: { corsaOxlint: { corsa: { executable: bundledTsgo } } } }
    : {}),
  rules,
});

export const configs: Readonly<{
  recommended: OxlintConfig;
  strict: OxlintConfig;
}> = {
  recommended: createOxlintConfig({
    "awscdk/construct-constructor-property": "error",
    "awscdk/no-construct-in-interface": "error",
    "awscdk/no-construct-in-public-property-of-construct": "error",
    "awscdk/no-construct-stack-suffix": "error",
    "awscdk/no-mutable-property-of-props-interface": "warn",
    "awscdk/no-mutable-public-property-of-construct": "warn",
    "awscdk/no-parent-name-construct-id-match": ["error", { disallowContainingParentName: false }],
    "awscdk/no-unused-props": "error",
    "awscdk/no-variable-construct-id": "error",
    "awscdk/pascal-case-construct-id": "error",
    "awscdk/prefer-grants-property": "warn",
    "awscdk/require-passing-this": ["error", { allowNonThisAndDisallowScope: true }],
  }),
  strict: createOxlintConfig({
    "awscdk/construct-constructor-property": "error",
    "awscdk/no-construct-in-interface": "error",
    "awscdk/no-construct-in-public-property-of-construct": "error",
    "awscdk/no-construct-stack-suffix": "error",
    "awscdk/no-import-private": "error",
    "awscdk/no-mutable-property-of-props-interface": "error",
    "awscdk/no-mutable-public-property-of-construct": "error",
    "awscdk/no-parent-name-construct-id-match": ["error", { disallowContainingParentName: true }],
    "awscdk/no-unused-props": "error",
    "awscdk/no-variable-construct-id": "error",
    "awscdk/pascal-case-construct-id": "error",
    "awscdk/prefer-grants-property": "error",
    "awscdk/prevent-construct-id-collision": "error",
    "awscdk/props-name-convention": "error",
    "awscdk/require-jsdoc": "error",
    "awscdk/require-passing-this": "error",
    "awscdk/require-props-default-doc": "error",
  }),
};
