export type OxlintConfig = {
  jsPlugins: ["oxlint-plugin-awscdk"];
  rules: Record<string, unknown>;
};

const createOxlintConfig = (rules: Record<string, unknown>): OxlintConfig => ({
  jsPlugins: ["oxlint-plugin-awscdk"],
  rules,
});

export const configs: Readonly<{
  recommended: OxlintConfig;
  strict: OxlintConfig;
}> = {
  recommended: createOxlintConfig({
    "awscdk/no-mutable-property-of-props-interface": "warn",
    "awscdk/no-mutable-public-property-of-construct": "warn",
  }),
  strict: createOxlintConfig({
    "awscdk/no-import-private": "error",
    "awscdk/no-mutable-property-of-props-interface": "error",
    "awscdk/no-mutable-public-property-of-construct": "error",
    "awscdk/props-name-convention": "error",
    "awscdk/require-jsdoc": "error",
    "awscdk/require-props-default-doc": "error",
  }),
};
