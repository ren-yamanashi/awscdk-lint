import { constructConstructorProperty } from "./construct-constructor-property";
import { noConstructInInterface } from "./no-construct-in-interface";
import { noConstructInPublicPropertyOfConstruct } from "./no-construct-in-public-property-of-construct";
import { noConstructStackSuffix } from "./no-construct-stack-suffix";
import { noImportPrivate } from "./no-import-private";
import { noMutablePropertyOfPropsInterface } from "./no-mutable-property-of-props-interface";
import { noMutablePublicPropertyOfConstruct } from "./no-mutable-public-property-of-construct";
import { noParentNameConstructIdMatch } from "./no-parent-name-construct-id-match";
import { noUnusedProps } from "./no-unused-props";
import { noVariableConstructId } from "./no-variable-construct-id";
import { pascalCaseConstructId } from "./pascal-case-construct-id";
import { propsNameConvention } from "./props-name-convention";
import { requireJSDoc } from "./require-jsdoc";
import { requirePassingThis } from "./require-passing-this";
import { requirePropsDefaultDoc } from "./require-props-default-doc";

export const rules = {
  "construct-constructor-property": constructConstructorProperty,
  "no-construct-in-interface": noConstructInInterface,
  "no-construct-in-public-property-of-construct":
    noConstructInPublicPropertyOfConstruct,
  "no-construct-stack-suffix": noConstructStackSuffix,
  "no-import-private": noImportPrivate,
  "no-mutable-property-of-props-interface": noMutablePropertyOfPropsInterface,
  "no-mutable-public-property-of-construct": noMutablePublicPropertyOfConstruct,
  "no-parent-name-construct-id-match": noParentNameConstructIdMatch,
  "no-unused-props": noUnusedProps,
  "no-variable-construct-id": noVariableConstructId,
  "pascal-case-construct-id": pascalCaseConstructId,
  "props-name-convention": propsNameConvention,
  "require-jsdoc": requireJSDoc,
  "require-passing-this": requirePassingThis,
  "require-props-default-doc": requirePropsDefaultDoc,
};
