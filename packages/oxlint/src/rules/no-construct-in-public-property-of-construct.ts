import type { CorsaTypeCheckerShape, ParserServices, RuleContext } from "corsa-oxlint";

import { ESLintUtils } from "corsa-oxlint";

import {
  findPublicPropertiesInClass,
  PublicProperty,
} from "../core/ast-node/finder/public-property";
import { isConstructType } from "../core/cdk-construct/type-checker/is-construct";
import { findTypeOfCdkConstruct } from "../core/cdk-construct/type-finder";
import { findTypeAtLocation } from "../core/ts-type/finder/type-at-location";
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
        const type = findTypeAtLocation(node, parserServices);
        if (!isConstructType(type, checker)) return;
        const publicProperties = findPublicPropertiesInClass(node);
        for (const publicProperty of publicProperties) {
          validatePublicProperty(publicProperty, context, parserServices, checker);
        }
      },
    };
  },
});

const validatePublicProperty = (
  publicProperty: PublicProperty,
  context: RuleContext,
  parserServices: ParserServices,
  checker: CorsaTypeCheckerShape,
) => {
  // Only inspect properties that have an explicit type annotation.
  // Inferring the type from an initializer is out of scope for this rule.
  if (!publicProperty.typeAnnotation) return;

  // NOTE: The declared type is read from the declaration's identifier rather than from the
  // property node, because the identifier resolves consistently for every declaration form
  // (`!`, `?`, initializer) in both type checkers.
  const type = findTypeAtLocation(publicProperty.node.key, parserServices);
  const constructType = findTypeOfCdkConstruct(type, checker);
  if (constructType) {
    const typeName = checker.getSymbolOfType(constructType)?.name ?? "";
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
