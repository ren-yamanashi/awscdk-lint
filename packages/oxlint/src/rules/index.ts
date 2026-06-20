import type { Rule } from "corsa-oxlint";

import { noConstructStackSuffix } from "./no-construct-stack-suffix";
import { noImportPrivate } from "./no-import-private";
import { noMutablePropertyOfPropsInterface } from "./no-mutable-property-of-props-interface";
import { noMutablePublicPropertyOfConstruct } from "./no-mutable-public-property-of-construct";
import { pascalCaseConstructId } from "./pascal-case-construct-id";
import { propsNameConvention } from "./props-name-convention";
import { requireJSDoc } from "./require-jsdoc";
import { requirePropsDefaultDoc } from "./require-props-default-doc";

export const rules: Record<string, Rule> = {
  "no-construct-stack-suffix": noConstructStackSuffix,
  "no-import-private": noImportPrivate,
  "no-mutable-property-of-props-interface": noMutablePropertyOfPropsInterface,
  "no-mutable-public-property-of-construct": noMutablePublicPropertyOfConstruct,
  "pascal-case-construct-id": pascalCaseConstructId,
  "props-name-convention": propsNameConvention,
  "require-jsdoc": requireJSDoc,
  "require-props-default-doc": requirePropsDefaultDoc,
};
