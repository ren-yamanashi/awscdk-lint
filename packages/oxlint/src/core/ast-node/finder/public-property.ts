import type { ESTree } from "corsa-oxlint";

import { AST_NODE_TYPES } from "corsa-oxlint";

type Class = ESTree.ClassDeclaration | ESTree.ClassExpression;

export type PublicProperty = {
  /**
   * Name of the public property
   */
  name: string;
  /**
   * AST node representing the public property
   */
  node: ESTree.PropertyDefinition;
  /**
   * Type annotation attached to the property, if any.
   * Absent when the property has no explicit annotation (e.g. `public foo = 0;`).
   */
  typeAnnotation?: ESTree.TSTypeAnnotation | null;
};

/**
 * Collects the public properties declared as class elements.
 *
 * NOTE: constructor parameter properties are intentionally out of scope for the public-property
 * rules, so they are not collected here.
 */
export const findPublicPropertiesInClass = (node: Class): PublicProperty[] => {
  return node.body.body.flatMap((property) => findPublicProperty(property) ?? []);
};

const findPublicProperty = (property: ESTree.ClassElement): PublicProperty | undefined => {
  if (property.type !== AST_NODE_TYPES.PropertyDefinition) return;
  if (property.key.type !== AST_NODE_TYPES.Identifier) return;
  if (["private", "protected"].includes(property.accessibility ?? "")) return;
  return {
    name: property.key.name,
    node: property,
    typeAnnotation: property.typeAnnotation,
  };
};
