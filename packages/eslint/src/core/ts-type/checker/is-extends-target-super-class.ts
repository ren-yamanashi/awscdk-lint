import { Type } from "typescript";

/**
 * Check if the type extends target super class
 * @param type - The type to check
 * @param targetSuperClasses - The target super classes
 * @param ignoredClasses - Class names that stop the walk, matched at every level of the base chain
 * @returns True if the type extends target super class, otherwise false
 */
export const isExtendsFromTargetSuperClass = (
  type: Type,
  targetSuperClasses: readonly string[],
  ignoredClasses: readonly string[] = [],
): boolean => {
  if (!type.symbol) return false;

  // NOTE: An ignored class is not a match, and neither is anything reached through it
  if (ignoredClasses.includes(type.symbol.name)) return false;

  // NOTE: Check if the current type ends in target super class
  if (targetSuperClasses.some((suffix) => type.symbol.name === suffix)) {
    return true;
  }

  // NOTE: Check the base type
  const baseTypes = type.getBaseTypes() ?? [];
  return baseTypes.some((baseType) =>
    isExtendsFromTargetSuperClass(baseType, targetSuperClasses, ignoredClasses),
  );
};
