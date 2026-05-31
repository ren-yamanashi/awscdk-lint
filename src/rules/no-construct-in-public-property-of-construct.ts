import type { Context, ESTree } from "@oxlint/plugins";

import { AST_NODE_TYPES } from "corsa-oxlint";

import { findPublicPropertiesInClass } from "../core/ast-node/finder/public-property";
import { isConstructOrStackType } from "../core/cdk-construct/type-checker/is-construct-or-stack";
import { findTypeOfCdkConstruct } from "../core/cdk-construct/type-finder";
import { createRule } from "../shared/create-rule";
import { getParserServices } from "../shared/parser-services";

type ParserServicesWithTypeInformation = ReturnType<typeof getParserServices>;

type PublicProperty = {
  name: string;
  node: ESTree.TSParameterProperty | ESTree.PropertyDefinition;
};

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
          validatePublicProperty(publicProperty, context, parserServices);
        }
      },
    };
  },
});

const validatePublicProperty = (
  publicProperty: PublicProperty,
  context: Context,
  parserServices: ParserServicesWithTypeInformation,
) => {
  // NOTE: corsa's getTypeAtLocation needs the binding identifier (not the whole property node)
  const keyNode =
    publicProperty.node.type === AST_NODE_TYPES.TSParameterProperty
      ? publicProperty.node.parameter
      : publicProperty.node.key;
  const type = parserServices.getTypeAtLocation(keyNode);
  const checker = parserServices.program.getTypeChecker();
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
