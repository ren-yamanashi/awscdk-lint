import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

type PropertyLike = TSESTree.PropertyDefinition | TSESTree.TSPropertySignature;

/**
 * Find the statically known name of a property
 * @param property A property signature or property definition node
 * @returns The name for an Identifier key and the stringified value for a string or numeric
 * Literal key, or null for properties whose name cannot be resolved statically (computed keys,
 * private identifiers, template literals, etc.)
 */
export const findStaticPropertyName = (property: PropertyLike): string | null => {
  // NOTE: a computed key is an expression, so its source text is not the property name
  if (property.computed) return null;

  const key = property.key;
  if (key.type === AST_NODE_TYPES.Identifier) return key.name;
  if (
    key.type === AST_NODE_TYPES.Literal &&
    (typeof key.value === "string" || typeof key.value === "number")
  ) {
    return String(key.value);
  }
  return null;
};
