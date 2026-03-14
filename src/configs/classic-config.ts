import { ClassicConfig } from "@typescript-eslint/utils/ts-eslint";

const createClassicConfig = (
  rules: ClassicConfig.RulesRecord,
): {
  plugins: ["awscdk"];
  rules: ClassicConfig.RulesRecord;
} => {
  return {
    plugins: ["awscdk"],
    rules,
  };
};

export const recommended = createClassicConfig({
  "awscdk/construct-constructor-property": "error",
  "awscdk/migrate-disable-comments": "error",
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
});

export const strict = createClassicConfig({
  "awscdk/construct-constructor-property": "error",
  "awscdk/migrate-disable-comments": "error",
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
});
