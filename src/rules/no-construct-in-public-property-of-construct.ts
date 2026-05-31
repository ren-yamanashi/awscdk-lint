import type { Context } from "@oxlint/plugins";
import type { CorsaTypeCheckerShape } from "corsa-oxlint";

import {
  findPublicPropertiesInClass,
  PublicProperty,
} from "../core/ast-node/finder/public-property";
import { isConstructOrStackType } from "../core/cdk-construct/type-checker/is-construct-or-stack";
import { findTypeOfCdkConstruct } from "../core/cdk-construct/type-finder";
import { createRule } from "../shared/create-rule";
import { getParserServices } from "../shared/parser-services";

/**
 * Disallow Construct types in public property of Construct
 * @param context - The rule context provided by ESLint
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
    const parserServices = getParserServices(context);
    const checker = parserServices.program.getTypeChecker();
    return {
      ClassDeclaration(node) {
        const type = parserServices.getTypeAtLocation(node);
        if (!isConstructOrStackType(type, checker)) return;
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
  // NOTE: corsa's getTypeAtLocation needs the binding identifier (not the whole property node)
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
