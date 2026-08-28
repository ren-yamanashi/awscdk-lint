import type { ESTree } from "corsa-oxlint";

import { AST_NODE_TYPES } from "corsa-oxlint";

import { findConstructor } from "./constructor";

type Class = ESTree.ClassDeclaration | ESTree.ClassExpression;

export type PublicProperty = {
  /**
   * Name of the public property
   */
  name: string;
  /**
   * AST node representing the public property
   */
  node: ESTree.TSParameterProperty | ESTree.PropertyDefinition;
  /**
   * Type annotation attached to the property, if any.
   * Absent when the property has no explicit annotation (e.g. `public foo = 0;`).
   */
  typeAnnotation?: ESTree.TSTypeAnnotation | null;
};

export const findPublicPropertiesInClass = (node: Class): PublicProperty[] => {
  const constructorProperties = findPropertiesInConstructor(node);
  const classElementProperties = findPropertiesInClassElement(node);
  return [...constructorProperties, ...classElementProperties];
};

const findPropertiesInConstructor = (node: Class) => {
  const constructor = findConstructor(node);
  if (!constructor) return [];
  return constructor.value.params.flatMap((property) => findPublicProperty(property) ?? []);
};

const findPropertiesInClassElement = (node: Class): PublicProperty[] => {
  return node.body.body.flatMap((property) => findPublicProperty(property) ?? []);
};

const findPublicProperty = (property: ESTree.Node): PublicProperty | undefined => {
  switch (property.type) {
    // NOTE: get from constructor
    case AST_NODE_TYPES.TSParameterProperty: {
      if (property.parameter.type !== AST_NODE_TYPES.Identifier) return;
      if (["private", "protected"].includes(property.accessibility ?? "")) return;
      return {
        name: property.parameter.name,
        node: property,
        typeAnnotation: property.parameter.typeAnnotation,
      };
    }
    case AST_NODE_TYPES.PropertyDefinition: {
      if (property.key.type !== AST_NODE_TYPES.Identifier) return;
      if (["private", "protected"].includes(property.accessibility ?? "")) return;
      return {
        name: property.key.name,
        node: property,
        typeAnnotation: property.typeAnnotation,
      };
    }
  }
};
