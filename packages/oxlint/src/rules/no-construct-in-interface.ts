import { AST_NODE_TYPES, ESLintUtils } from "corsa-oxlint";

import { findStaticPropertyName } from "../core/ast-node/finder/static-property-key";
import { findTypeOfCdkConstruct } from "../core/cdk-construct/type-finder";
import { createRule } from "../shared/create-rule";

/**
 * Enforces the use of interface types instead of CDK Construct types in interface properties
 */
export const noConstructInInterface = createRule({
  name: "no-construct-in-interface",
  meta: {
    type: "problem",
    docs: {
      description: "Disallow CDK Construct types in interface properties",
      requiresTypeChecking: true,
    },
    messages: {
      invalidInterfaceProperty:
        "Interface property '{{ propertyName }}' should not use CDK Construct type '{{ typeName }}'. Consider using an interface or type alias instead.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const parserServices = ESLintUtils.getParserServices(context);
    const checker = parserServices.program.getTypeChecker();
    return {
      TSInterfaceDeclaration(node) {
        for (const property of node.body.body) {
          if (property.type !== AST_NODE_TYPES.TSPropertySignature) continue;

          // NOTE: properties whose name cannot be resolved statically (computed keys, etc.)
          // are out of scope for this rule
          const propertyName = findStaticPropertyName(property);
          if (propertyName === null) continue;

          const type = parserServices.getTypeAtLocation(property);
          const result = findTypeOfCdkConstruct(type, checker);

          if (result) {
            context.report({
              node: property,
              messageId: "invalidInterfaceProperty",
              data: {
                propertyName,
                typeName: checker.getSymbolOfType(result)?.name ?? "",
              },
            });
          }
        }
      },
    };
  },
});
