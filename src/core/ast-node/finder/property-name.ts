import type { ESTree } from "@oxlint/plugins";

/**
 * Retrieves the property names from an array of properties.
 *
 * @param properties An array of properties to extract names from.
 * @returns An array of property names.
 */
export const findPropertyNames = (properties: ESTree.ObjectPattern["properties"]): string[] => {
  return properties.reduce<string[]>(
    (acc, prop) =>
      prop.type === "Property" && prop.key.type === "Identifier" ? [...acc, prop.key.name] : acc,
    [],
  );
};
