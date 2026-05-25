import type { ESTree } from "@oxlint/plugins";

import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

import { findConstructor, findConstructorOxlint } from "./constructor";

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
      if (property.parameter.type !== AST_NODE_TYPES.Identifier) {
        return;
      }
      if (["private", "protected"].includes(property.accessibility ?? "")) {
        return;
      }
      if (!property.parameter.typeAnnotation) return;
      return {
        name: property.parameter.name,
        node: property,
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
      if (!property.typeAnnotation) return;
      return {
        name: property.key.name,
        node: property,
      };
    }
  }
};

export type PublicPropertyOxlint = {
  name: string;
  node: ESTree.TSParameterProperty | ESTree.PropertyDefinition;
};

/**
 * Finds public properties in a class (oxlint version using `@oxlint/plugins` types)
 * @param node The class node provided by the oxlint visitor
 * @returns The public properties (constructor parameter properties and class fields)
 */
export const findPublicPropertiesInClassOxlint = (node: ESTree.Class): PublicPropertyOxlint[] => {
  const constructor = findConstructorOxlint(node);
  const constructorProperties =
    constructor?.value.params.flatMap((property) => findPublicPropertyOxlint(property) ?? []) ?? [];
  const classElementProperties = node.body.body.flatMap(
    (property) => findPublicPropertyOxlint(property) ?? [],
  );
  return [...constructorProperties, ...classElementProperties];
};

const findPublicPropertyOxlint = (
  property: ESTree.ParamPattern | ESTree.ClassElement,
): PublicPropertyOxlint | undefined => {
  switch (property.type) {
    // NOTE: get from constructor
    case "TSParameterProperty": {
      if (property.parameter.type !== "Identifier") return;
      if (["private", "protected"].includes(property.accessibility ?? "")) return;
      return {
        name: property.parameter.name,
        node: property,
      };
    }
    // NOTE: get from class element
    case "PropertyDefinition": {
      if (property.key.type !== "Identifier") return;
      if (["private", "protected"].includes(property.accessibility ?? "")) return;
      if (!property.typeAnnotation) return;
      return {
        name: property.key.name,
        node: property,
      };
    }
  }
};
