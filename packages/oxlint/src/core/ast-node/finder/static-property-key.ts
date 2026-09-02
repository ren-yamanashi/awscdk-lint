import type { ESTree } from "corsa-oxlint";

import { AST_NODE_TYPES } from "corsa-oxlint";

/**
 * Find the statically known name of a property key
 * @param key The key node of a property signature, property definition or property
 * @returns The name for an Identifier key and the stringified value for a string or numeric
 * Literal key, or null for keys that cannot be resolved statically (computed keys, template
 * literals, etc.)
 */
export const findStaticPropertyName = (key: ESTree.Node): string | null => {
  if (key.type === AST_NODE_TYPES.Identifier) return key.name;
  if (
    key.type === AST_NODE_TYPES.Literal &&
    (typeof key.value === "string" || typeof key.value === "number")
  ) {
    return String(key.value);
  }
  return null;
};
