import type { ESTree } from "corsa-oxlint";

import { AST_NODE_TYPES, ESLintUtils } from "corsa-oxlint";

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

          // NOTE: computed keys cannot be resolved statically, so they are skipped
          const propertyName = findStaticPropertyName(property.key);
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

/**
 * Find the static name of a property key
 * @param key - The key of a property signature
 * @returns The property name, or null for keys that cannot be resolved statically
 */
const findStaticPropertyName = (key: ESTree.TSPropertySignature["key"]): string | null => {
  if (key.type === AST_NODE_TYPES.Identifier) return key.name;
  if (
    key.type === AST_NODE_TYPES.Literal &&
    (typeof key.value === "string" || typeof key.value === "number")
  ) {
    return String(key.value);
  }
  return null;
};
