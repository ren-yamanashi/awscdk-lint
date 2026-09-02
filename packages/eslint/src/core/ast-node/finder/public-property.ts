import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

export type PublicProperty = {
  /**
   * Name of the public property
   */
  name: string;
  /**
   * AST node representing the public property
   */
  node: TSESTree.PropertyDefinitionComputedName | TSESTree.PropertyDefinitionNonComputedName;
  /**
   * Type annotation attached to the property, if any.
   * Absent when the property has no explicit annotation (e.g. `public foo = 0;`).
   */
  typeAnnotation?: TSESTree.TSTypeAnnotation;
};

/**
 * Collects the public properties declared as class elements.
 *
 * NOTE: constructor parameter properties are intentionally out of scope for the public-property
 * rules, so they are not collected here.
 */
export const findPublicPropertiesInClass = (node: TSESTree.ClassDeclaration): PublicProperty[] => {
  return node.body.body.flatMap((property) => findPublicProperty(property) ?? []);
};

const findPublicProperty = (property: TSESTree.ClassElement): PublicProperty | undefined => {
  if (property.type !== AST_NODE_TYPES.PropertyDefinition) {
    return;
  }
  if (property.key.type !== AST_NODE_TYPES.Identifier) {
    return;
  }
  if (["private", "protected"].includes(property.accessibility ?? "")) {
    return;
  }
  return {
    name: property.key.name,
    node: property,
    typeAnnotation: property.typeAnnotation,
  };
};
