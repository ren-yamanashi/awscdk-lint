import type { ESTree } from "@oxlint/plugins";

import { AST_NODE_TYPES } from "corsa-oxlint";

/**
 * Retrieves the property names from an array of properties.
 *
 * @param properties An array of properties to extract names from.
 * @returns An array of property names.
 */
export const findPropertyNames = (properties: ESTree.ObjectPattern["properties"]): string[] => {
  return properties.reduce<string[]>(
    (acc, prop) =>
      prop.type === AST_NODE_TYPES.Property && prop.key.type === AST_NODE_TYPES.Identifier
        ? [...acc, prop.key.name]
        : acc,
    [],
  );
};
