import { Type } from "typescript";

/**
 * Check if the type extends target super class
 * @param type - The type to check
 * @param targetSuperClasses - The target super classes
 * @returns True if the type extends target super class, otherwise false
 */
export const isExtendsFromTargetSuperClass = (
  type: Type,
  targetSuperClasses: string[],
  typeCheckFunction: (type: Type) => boolean
): boolean => {
  if (!type.symbol) return false;

  // NOTE: Check if the current type ends in target super class
  if (targetSuperClasses.some((suffix) => type.symbol.name === suffix)) {
    return true;
  }

  // NOTE: Check the base type
  const baseTypes = type.getBaseTypes() ?? [];
  return baseTypes.some((baseType) => typeCheckFunction(baseType));
};
