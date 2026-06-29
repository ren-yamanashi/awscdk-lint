import type { ParserServices, RuleContext } from "corsa-oxlint";

import { ESLintUtils } from "corsa-oxlint";

import {
  findPublicPropertiesInClass,
  PublicProperty,
} from "../core/ast-node/finder/public-property";
import { isConstructOrStackType } from "../core/cdk-construct/type-checker/is-construct-or-stack";
import { findTypeOfCdkConstruct } from "../core/cdk-construct/type-finder";
import { safeGetSymbolOfType } from "../core/ts-type/checker/safe-get-symbol-of-type";
import { createRule } from "../shared/create-rule";

/**
 * Disallow Construct types in public property of Construct
 */
export const noConstructInPublicPropertyOfConstruct = createRule({
  name: "no-construct-in-public-property-of-construct",
  meta: {
    type: "problem",
    docs: {
      description: "Disallow Construct types in public property of Construct",
      requiresTypeChecking: true,
    },
    messages: {
      invalidPublicPropertyOfConstruct:
        "Public property '{{ propertyName }}' of Construct should not use Construct type '{{ typeName }}'. Consider using an interface or type alias instead.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const parserServices = ESLintUtils.getParserServices(context);
    const checker = parserServices.program.getTypeChecker();
    return {
      ClassDeclaration(node) {
        const type = parserServices.getTypeAtLocation(node);
        if (!isConstructOrStackType(type, checker)) return;
        const publicProperties = findPublicPropertiesInClass(node);
        for (const publicProperty of publicProperties) {
          validatePublicProperty(publicProperty, context, parserServices);
        }
      },
    };
  },
});

const validatePublicProperty = (
  publicProperty: PublicProperty,
  context: RuleContext,
  parserServices: ParserServices,
) => {
  const type = parserServices.getTypeAtLocation(publicProperty.node);
  const checker = parserServices.program.getTypeChecker();
  const constructType = findTypeOfCdkConstruct(type, checker);
  if (constructType) {
    const typeName = safeGetSymbolOfType(constructType, checker)?.name ?? "";
    context.report({
      node: publicProperty.node,
      messageId: "invalidPublicPropertyOfConstruct",
      data: {
        propertyName: publicProperty.name,
        typeName,
      },
    });
  }
};
