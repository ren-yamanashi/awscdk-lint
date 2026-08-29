import { AST_NODE_TYPES, ESLintUtils, TSESTree } from "@typescript-eslint/utils";

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
    const parserServices = ESLintUtils.getParserServices(context);
    return {
      TSInterfaceDeclaration(node) {
        for (const property of node.body.body) {
          if (property.type !== AST_NODE_TYPES.TSPropertySignature) continue;

          // NOTE: computed keys cannot be resolved statically, so they are skipped
          const propertyName = findStaticPropertyName(property.key);
          if (propertyName === null) continue;

          const type = parserServices.getTypeAtLocation(property);
          const result = findTypeOfCdkConstruct(type);

          if (result) {
            context.report({
              node: property,
              messageId: "invalidInterfaceProperty",
              data: {
                propertyName,
                typeName: result.symbol.name,
              },
            });
          }
        }
      },
    };
  },
});

/**
 * Find the static name of a property key
 * @param key - The key of a property signature
 * @returns The property name, or null for keys that cannot be resolved statically
 */
const findStaticPropertyName = (key: TSESTree.TSPropertySignature["key"]): string | null => {
  if (key.type === AST_NODE_TYPES.Identifier) return key.name;
  if (
    key.type === AST_NODE_TYPES.Literal &&
    (typeof key.value === "string" || typeof key.value === "number")
  ) {
    return String(key.value);
  }
  return null;
};
