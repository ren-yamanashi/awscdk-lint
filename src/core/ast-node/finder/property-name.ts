import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

/**
 * Retrieves the property names from an array of properties.
 *
 * @param properties An array of properties to extract names from.
 * @returns An array of property names.
 */
export const findPropertyNames = (
  properties: (TSESTree.Property | TSESTree.RestElement)[]
): string[] => {
  return properties.reduce<string[]>(
    (acc, prop) =>
      prop.type === AST_NODE_TYPES.Property &&
      prop.key.type === AST_NODE_TYPES.Identifier
        ? [...acc, prop.key.name]
        : acc,
    []
  );
};
