import type { Context, ESTree } from "@oxlint/plugins";
import type { CorsaTypeCheckerShape } from "corsa-oxlint";

import { getParserServices } from "corsa-oxlint";

import type { PublicProperty } from "../core/ast-node/finder/public-property";

import { findPublicPropertiesInClass } from "../core/ast-node/finder/public-property";
import { isConstructOrStackType } from "../core/cdk-construct/type-checker/is-construct-or-stack";
import { findTypeOfCdkConstruct } from "../core/cdk-construct/type-finder";
import { createRule } from "../shared/create-rule";

/**
 * Disallow Construct types in public property of Construct
 * @param context - The rule context provided by the linter
 * @returns An object containing the AST visitor functions
 */
export const noConstructInPublicPropertyOfConstruct = createRule({
  name: "no-construct-in-public-property-of-construct",
  meta: {
    type: "problem",
    docs: {
      description: "Disallow Construct types in public property of Construct",
    },
    messages: {
      invalidPublicPropertyOfConstruct:
        "Public property '{{ propertyName }}' of Construct should not use Construct type '{{ typeName }}'. Consider using an interface or type alias instead.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const services = getParserServices(context);
    const checker = services.program.getTypeChecker();
    return {
      ClassDeclaration(node: ESTree.Class) {
        if (!node.id) return;
        const type = checker.getTypeAtLocation(node);
        if (!type || !isConstructOrStackType(type, checker)) return;
        const publicProperties = findPublicPropertiesInClass(node);
        for (const publicProperty of publicProperties) {
          validatePublicProperty(publicProperty, context, checker);
        }
      },
    };
  },
});

const validatePublicProperty = (
  publicProperty: PublicProperty,
  context: Context,
  checker: CorsaTypeCheckerShape,
) => {
  const keyNode =
    publicProperty.node.type === "TSParameterProperty"
      ? publicProperty.node.parameter
      : publicProperty.node.key;
  const type = checker.getTypeAtLocation(keyNode);
  if (!type) return;
  const constructType = findTypeOfCdkConstruct(type, checker);
  if (constructType) {
    context.report({
      node: publicProperty.node,
      messageId: "invalidPublicPropertyOfConstruct",
      data: {
        propertyName: publicProperty.name,
        typeName: checker.typeToString(constructType),
      },
    });
  }
};
