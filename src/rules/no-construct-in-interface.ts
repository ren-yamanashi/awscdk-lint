import { getParserServices } from "corsa-oxlint";

import { findTypeOfCdkConstruct } from "../core/cdk-construct/type-finder";
import { createRule } from "../shared/create-rule";

/**
 * Enforces the use of interface types instead of CDK Construct types in interface properties
 * @param context - The rule context provided by ESLint
 * @returns An object containing the AST visitor functions
 */
export const noConstructInInterface = createRule({
  name: "no-construct-in-interface",
  meta: {
    type: "problem",
    docs: {
      description: "Disallow CDK Construct types in interface properties",
    },
    messages: {
      invalidInterfaceProperty:
        "Interface property '{{ propertyName }}' should not use CDK Construct type '{{ typeName }}'. Consider using an interface or type alias instead.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const services = getParserServices(context);
    const checker = services.program.getTypeChecker();
    return {
      TSInterfaceDeclaration(node) {
        for (const property of node.body.body) {
          if (property.type !== "TSPropertySignature" || property.key.type !== "Identifier") {
            continue;
          }

          const type = checker.getTypeAtLocation(property);
          const result = type && findTypeOfCdkConstruct(type, checker);

          if (result) {
            context.report({
              node: property,
              messageId: "invalidInterfaceProperty",
              data: {
                propertyName: property.key.name,
                typeName: checker.typeToString(result),
              },
            });
          }
        }
      },
    };
  },
});
