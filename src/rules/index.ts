import type { TSESLint } from "@typescript-eslint/utils";
import type { Rule } from "eslint";

import { constructConstructorProperty } from "./construct-constructor-property";
import { migrateDisableComments } from "./migrate-disable-comments";
import { noConstructInInterface } from "./no-construct-in-interface";
import { noConstructInInterfaceOxlint } from "./no-construct-in-interface-oxlint";
import { noConstructInPublicPropertyOfConstruct } from "./no-construct-in-public-property-of-construct";
import { noConstructStackSuffix } from "./no-construct-stack-suffix";
import { noConstructStackSuffixOxlint } from "./no-construct-stack-suffix-oxlint";
import { noImportPrivate } from "./no-import-private";
import { noMutablePropertyOfPropsInterface } from "./no-mutable-property-of-props-interface";
import { noMutablePublicPropertyOfConstruct } from "./no-mutable-public-property-of-construct";
import { noParentNameConstructIdMatch } from "./no-parent-name-construct-id-match";
import { noUnusedProps } from "./no-unused-props";
import { noVariableConstructId } from "./no-variable-construct-id";
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
  "migrate-disable-comments": migrateDisableComments,
  "no-construct-in-interface": noConstructInInterface,
  "no-construct-in-interface-oxlint": noConstructInInterfaceOxlint,
  "no-construct-in-public-property-of-construct": noConstructInPublicPropertyOfConstruct,
  "no-construct-stack-suffix": noConstructStackSuffix,
  "no-construct-stack-suffix-oxlint": noConstructStackSuffixOxlint,
  "no-import-private": noImportPrivate,
  "no-mutable-property-of-props-interface": noMutablePropertyOfPropsInterface,
  "no-mutable-public-property-of-construct": noMutablePublicPropertyOfConstruct,
  "no-parent-name-construct-id-match": noParentNameConstructIdMatch,
  "no-unused-props": noUnusedProps,
  "no-variable-construct-id": noVariableConstructId,
  "pascal-case-construct-id": pascalCaseConstructId,
  "prefer-grants-property": preferGrantsProperty,
  "prevent-construct-id-collision": preventConstructIdCollision,
  "props-name-convention": propsNameConvention,
  "require-jsdoc": requireJSDoc,
  "require-passing-this": requirePassingThis,
  "require-props-default-doc": requirePropsDefaultDoc,
};
