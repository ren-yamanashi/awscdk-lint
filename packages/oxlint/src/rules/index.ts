import type { Rule } from "corsa-oxlint";

import { noImportPrivate } from "./no-import-private";
import { noMutablePropertyOfPropsInterface } from "./no-mutable-property-of-props-interface";
import { noMutablePublicPropertyOfConstruct } from "./no-mutable-public-property-of-construct";
import { propsNameConvention } from "./props-name-convention";
import { requireJSDoc } from "./require-jsdoc";
import { requirePropsDefaultDoc } from "./require-props-default-doc";

export const rules: Record<string, Rule> = {
  "no-import-private": noImportPrivate,
  "no-mutable-property-of-props-interface": noMutablePropertyOfPropsInterface,
  "no-mutable-public-property-of-construct": noMutablePublicPropertyOfConstruct,
  "props-name-convention": propsNameConvention,
  "require-jsdoc": requireJSDoc,
  "require-props-default-doc": requirePropsDefaultDoc,
};
