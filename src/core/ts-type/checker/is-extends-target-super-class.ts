import type { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

/**
 * Check if the type extends target super class
 * @param type - The type to check
 * @param targetSuperClasses - The target super classes
 * @returns True if the type extends target super class, otherwise false
 */
export const isExtendsFromTargetSuperClass = (
  type: CorsaType | undefined,
  checker: CorsaTypeCheckerShape,
  targetSuperClasses: readonly string[],
  ignoredClasses: readonly string[],
): boolean => {
  if (!type) return false;
  const rawTypeName = checker.typeToString(type);

  if (ignoredClasses.includes(rawTypeName)) return false;
  if (targetSuperClasses.includes(rawTypeName)) return true;

  const baseTypes = checker.getBaseTypes(type);
  return baseTypes.some((base) =>
    isExtendsFromTargetSuperClass(base, checker, targetSuperClasses, ignoredClasses),
  );
};
