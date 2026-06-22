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
      if (!property.parameter.typeAnnotation) return;
      return {
        name: property.parameter.name,
        node: property,
      };
    }
    case AST_NODE_TYPES.PropertyDefinition: {
      if (property.key.type !== AST_NODE_TYPES.Identifier) return;
      if (["private", "protected"].includes(property.accessibility ?? "")) return;
      if (!property.typeAnnotation) return;
      return {
        name: property.key.name,
        node: property,
      };
    }
  }
};
