import type { ESTree } from "@oxlint/plugins";

import { findConstructor } from "./constructor";

export type PublicProperty = {
  name: string;
  node: ESTree.TSParameterProperty | ESTree.PropertyDefinition;
};

/**
 * Finds public properties in a class
 * @param node The class node provided by the oxlint visitor
 * @returns The public properties (constructor parameter properties and class fields)
 */
export const findPublicPropertiesInClass = (node: ESTree.Class): PublicProperty[] => {
  const constructor = findConstructor(node);
  const constructorProperties =
    constructor?.value.params.flatMap((property) => findPublicProperty(property) ?? []) ?? [];
  const classElementProperties = node.body.body.flatMap(
    (property) => findPublicProperty(property) ?? [],
  );
  return [...constructorProperties, ...classElementProperties];
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
