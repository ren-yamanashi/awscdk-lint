import type { ESTree } from "@oxlint/plugins";

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

export const findPublicPropertiesInClass = (node: ESTree.Class): PublicProperty[] => {
  const constructorProperties = findPropertiesInConstructor(node);
  const classElementProperties = findPropertiesInClassElement(node);
  return [...constructorProperties, ...classElementProperties];
};

const findPropertiesInConstructor = (node: ESTree.Class) => {
  const constructor = findConstructor(node);
  if (!constructor) return [];
  return constructor.value.params.flatMap((property) => findPublicProperty(property) ?? []);
};

const findPropertiesInClassElement = (node: ESTree.Class): PublicProperty[] => {
  return node.body.body.flatMap((property) => findPublicProperty(property) ?? []);
};

const findPublicProperty = (
  property: ESTree.ParamPattern | ESTree.ClassElement,
): PublicProperty | undefined => {
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
