import type { TSESLint } from "@typescript-eslint/utils";
import type { Rule } from "eslint";

import { constructConstructorProperty } from "./construct-constructor-property";
import { migrateDisableComments } from "./migrate-disable-comments";
import { noConstructInInterface } from "./no-construct-in-interface";
import { noConstructInPublicPropertyOfConstruct } from "./no-construct-in-public-property-of-construct";
import { noConstructStackSuffix } from "./no-construct-stack-suffix";
import { noImportPrivate } from "./no-import-private";
import { noMutablePropertyOfPropsInterface } from "./no-mutable-property-of-props-interface";
import { noMutablePublicPropertyOfConstruct } from "./no-mutable-public-property-of-construct";
import { noParentNameConstructIdMatch } from "./no-parent-name-construct-id-match";
import { noUnusedProps } from "./no-unused-props";
import { noVariableConstructId } from "./no-variable-construct-id";
import { constructConstructorPropertyOxlint } from "./oxlint/construct-constructor-property";
import { migrateDisableCommentsOxlint } from "./oxlint/migrate-disable-comments";
import { noConstructInInterfaceOxlint } from "./oxlint/no-construct-in-interface";
import { noConstructInPublicPropertyOfConstructOxlint } from "./oxlint/no-construct-in-public-property-of-construct";
import { noConstructStackSuffixOxlint } from "./oxlint/no-construct-stack-suffix";
import { noMutablePropertyOfPropsInterfaceOxlint } from "./oxlint/no-mutable-property-of-props-interface";
import { noMutablePublicPropertyOfConstructOxlint } from "./oxlint/no-mutable-public-property-of-construct";
import { noParentNameConstructIdMatchOxlint } from "./oxlint/no-parent-name-construct-id-match";
import { noUnusedPropsOxlint } from "./oxlint/no-unused-props";
import { noVariableConstructIdOxlint } from "./oxlint/no-variable-construct-id";
import { pascalCaseConstructIdOxlint } from "./oxlint/pascal-case-construct-id";
import { preferGrantsPropertyOxlint } from "./oxlint/prefer-grants-property";
import { preventConstructIdCollisionOxlint } from "./oxlint/prevent-construct-id-collision";
import { propsNameConventionOxlint } from "./oxlint/props-name-convention";
import { requireJSDocOxlint } from "./oxlint/require-jsdoc";
import { requirePassingThisOxlint } from "./oxlint/require-passing-this";
import { requirePropsDefaultDocOxlint } from "./oxlint/require-props-default-doc";
import { pascalCaseConstructId } from "./pascal-case-construct-id";
import { preferGrantsProperty } from "./prefer-grants-property";
import { preventConstructIdCollision } from "./prevent-construct-id-collision";
import { propsNameConvention } from "./props-name-convention";
import { requireJSDoc } from "./require-jsdoc";
import { requirePassingThis } from "./require-passing-this";
import { requirePropsDefaultDoc } from "./require-props-default-doc";

type RuleModule = TSESLint.RuleModule<string, readonly unknown[]> | Rule.RuleModule;

export const rules: Record<string, RuleModule> = {
  "construct-constructor-property": constructConstructorProperty,
  "construct-constructor-property-oxlint": constructConstructorPropertyOxlint,
  "migrate-disable-comments": migrateDisableComments,
  "migrate-disable-comments-oxlint": migrateDisableCommentsOxlint,
  "no-construct-in-interface": noConstructInInterface,
  "no-construct-in-interface-oxlint": noConstructInInterfaceOxlint,
  "no-construct-in-public-property-of-construct": noConstructInPublicPropertyOfConstruct,
  "no-construct-in-public-property-of-construct-oxlint":
    noConstructInPublicPropertyOfConstructOxlint,
  "no-construct-stack-suffix": noConstructStackSuffix,
  "no-construct-stack-suffix-oxlint": noConstructStackSuffixOxlint,
  "no-import-private": noImportPrivate,
  "no-mutable-property-of-props-interface": noMutablePropertyOfPropsInterface,
  "no-mutable-property-of-props-interface-oxlint": noMutablePropertyOfPropsInterfaceOxlint,
  "no-mutable-public-property-of-construct": noMutablePublicPropertyOfConstruct,
  "no-mutable-public-property-of-construct-oxlint": noMutablePublicPropertyOfConstructOxlint,
  "no-parent-name-construct-id-match": noParentNameConstructIdMatch,
  "no-parent-name-construct-id-match-oxlint": noParentNameConstructIdMatchOxlint,
  "no-unused-props": noUnusedProps,
  "no-unused-props-oxlint": noUnusedPropsOxlint,
  "no-variable-construct-id": noVariableConstructId,
  "no-variable-construct-id-oxlint": noVariableConstructIdOxlint,
  "pascal-case-construct-id": pascalCaseConstructId,
  "pascal-case-construct-id-oxlint": pascalCaseConstructIdOxlint,
  "prefer-grants-property": preferGrantsProperty,
  "prefer-grants-property-oxlint": preferGrantsPropertyOxlint,
  "prevent-construct-id-collision": preventConstructIdCollision,
  "prevent-construct-id-collision-oxlint": preventConstructIdCollisionOxlint,
  "props-name-convention": propsNameConvention,
  "props-name-convention-oxlint": propsNameConventionOxlint,
  "require-jsdoc": requireJSDoc,
  "require-jsdoc-oxlint": requireJSDocOxlint,
  "require-passing-this": requirePassingThis,
  "require-passing-this-oxlint": requirePassingThisOxlint,
  "require-props-default-doc": requirePropsDefaultDoc,
  "require-props-default-doc-oxlint": requirePropsDefaultDocOxlint,
};
