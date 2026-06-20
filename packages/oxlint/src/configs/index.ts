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
    "awscdk/no-construct-stack-suffix": "error",
    "awscdk/no-mutable-property-of-props-interface": "warn",
    "awscdk/no-mutable-public-property-of-construct": "warn",
    "awscdk/pascal-case-construct-id": "error",
  }),
  strict: createOxlintConfig({
    "awscdk/no-construct-stack-suffix": "error",
    "awscdk/no-import-private": "error",
    "awscdk/no-mutable-property-of-props-interface": "error",
    "awscdk/no-mutable-public-property-of-construct": "error",
    "awscdk/pascal-case-construct-id": "error",
    "awscdk/props-name-convention": "error",
    "awscdk/require-jsdoc": "error",
    "awscdk/require-props-default-doc": "error",
  }),
};
