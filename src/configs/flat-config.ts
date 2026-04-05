import tsParser from "@typescript-eslint/parser";
import { FlatConfig } from "@typescript-eslint/utils/ts-eslint";

import { name, version } from "../../package.json";
import { rules } from "../rules";

const cdk = {
  meta: { name, version },
  rules,
};

const createFlatConfig = (
  rules: FlatConfig.Rules,
): {
  languageOptions: FlatConfig.LanguageOptions;
  plugins: FlatConfig.Plugins;
  rules: FlatConfig.Rules;
} => {
  return {
    plugins: {
      cdk,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
      },
    },
    rules,
  };
};

export const recommended = createFlatConfig({
  "cdk/construct-constructor-property": "error",
  "cdk/no-construct-in-interface": "error",
  "cdk/no-construct-in-public-property-of-construct": "error",
  "cdk/no-construct-stack-suffix": "error",
  "cdk/no-mutable-property-of-props-interface": "warn",
  "cdk/no-mutable-public-property-of-construct": "warn",
  "cdk/no-parent-name-construct-id-match": ["error", { disallowContainingParentName: false }],
  "cdk/no-unused-props": "error",
  "cdk/no-variable-construct-id": "error",
  "cdk/pascal-case-construct-id": "error",
  "cdk/require-passing-this": ["error", { allowNonThisAndDisallowScope: true }],
});

export const strict = createFlatConfig({
  "cdk/construct-constructor-property": "error",
  "cdk/no-construct-in-interface": "error",
  "cdk/no-construct-in-public-property-of-construct": "error",
  "cdk/no-construct-stack-suffix": "error",
  "cdk/no-import-private": "error",
  "cdk/no-mutable-property-of-props-interface": "error",
  "cdk/no-mutable-public-property-of-construct": "error",
  "cdk/no-parent-name-construct-id-match": ["error", { disallowContainingParentName: true }],
  "cdk/no-unused-props": "error",
  "cdk/no-variable-construct-id": "error",
  "cdk/pascal-case-construct-id": "error",
  "cdk/props-name-convention": "error",
  "cdk/require-jsdoc": "error",
  "cdk/require-passing-this": "error",
  "cdk/require-props-default-doc": "error",
});
