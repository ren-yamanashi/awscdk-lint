import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

import { findConstructor } from "./constructor";
import { findConstructorParamIdentifier } from "./constructor-param-identifier";

export type PublicProperty = {
  /**
   * Name of the public property
   */
  name: string;
  /**
   * AST node representing the public property
   */
  node:
    | TSESTree.PropertyDefinitionComputedName
    | TSESTree.PropertyDefinitionNonComputedName
    | TSESTree.TSParameterProperty;
  /**
   * Type annotation attached to the property, if any.
   * Absent when the property has no explicit annotation (e.g. `public foo = 0;`).
   */
  typeAnnotation?: TSESTree.TSTypeAnnotation;
};

export const findPublicPropertiesInClass = (node: TSESTree.ClassDeclaration): PublicProperty[] => {
  const constructorProperties = findPropertiesInConstructor(node);
  const classElementProperties = findPropertiesInClassElement(node);
  return [...constructorProperties, ...classElementProperties];
};

const findPropertiesInConstructor = (node: TSESTree.ClassDeclaration) => {
  const constructor = findConstructor(node);
  if (!constructor) return [];
  return constructor.value.params.flatMap((property) => findPublicProperty(property) ?? []);
};

const findPropertiesInClassElement = (node: TSESTree.ClassDeclaration): PublicProperty[] => {
  return node.body.body.flatMap((property) => findPublicProperty(property) ?? []);
};

const findPublicProperty = (
  property: TSESTree.Parameter | TSESTree.ClassElement,
): PublicProperty | undefined => {
  switch (property.type) {
    // NOTE: get from constructor
    case AST_NODE_TYPES.TSParameterProperty: {
      // NOTE: a default value wraps the binding in an AssignmentPattern, so unwrap it first
      const identifier = findConstructorParamIdentifier(property);
      if (!identifier) {
        return;
      }
      if (["private", "protected"].includes(property.accessibility ?? "")) {
        return;
      }
      return {
        name: identifier.name,
        node: property,
        typeAnnotation: identifier.typeAnnotation,
      };
    }
    // NOTE: get from class element
    case AST_NODE_TYPES.PropertyDefinition: {
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
    }
  }
};
