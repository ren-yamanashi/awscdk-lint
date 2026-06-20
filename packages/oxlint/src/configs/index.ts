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
  recommended: createOxlintConfig({}),
  strict: createOxlintConfig({
    "awscdk/no-import-private": "error",
  }),
};
