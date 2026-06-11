import { AST_NODE_TYPES, ESTree } from "corsa-oxlint";

import { findConstructor } from "./constructor";

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

export const findPublicPropertiesInClass = (
  node: ESTree.ClassDeclaration | ESTree.ClassExpression,
): PublicProperty[] => {
  const constructorProperties = findPropertiesInConstructor(node);
  const classElementProperties = findPropertiesInClassElement(node);
  return [...constructorProperties, ...classElementProperties];
};

const findPropertiesInConstructor = (node: ESTree.ClassDeclaration | ESTree.ClassExpression) => {
  const constructor = findConstructor(node);
  if (!constructor) return [];
  return constructor.value.params.flatMap((property) => findPublicProperty(property) ?? []);
};

const findPropertiesInClassElement = (
  node: ESTree.ClassDeclaration | ESTree.ClassExpression,
): PublicProperty[] => {
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
        // FIXME: not use `as` assertion
        node: property as ESTree.TSParameterProperty,
      };
    }
    // NOTE: get from class element
    case AST_NODE_TYPES.PropertyDefinition: {
      if (property.key.type !== AST_NODE_TYPES.Identifier) return;
      if (["private", "protected"].includes(property.accessibility ?? "")) return;
      if (!property.typeAnnotation) return;
      return {
        name: property.key.name,
        // FIXME: not use `as` assertion
        node: property as ESTree.PropertyDefinition,
      };
    }
  }
};
