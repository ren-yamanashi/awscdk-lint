import type { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

/**
 * Check if the type extends one of the target super classes (recursively walking the base type chain).
 * @param type - The type to check
 * @param checker - The corsa-oxlint type checker
 * @param targetSuperClasses - Super class names to match
 * @param ignoredClasses - Class names that stop the walk, matched at every level of the base chain
 * @returns True if the type extends any of the target super classes
 */
export const isExtendsFromTargetSuperClass = (
  type: CorsaType | undefined,
  checker: CorsaTypeCheckerShape,
  targetSuperClasses: readonly string[],
  ignoredClasses: readonly string[] = [],
): boolean => {
  if (!type) return false;

  // NOTE: A union / intersection type is not a class of its own, so it never extends a super class.
  // Callers that want to look inside it use findTypeOfCdkConstruct instead.
  if (checker.isUnionType(type) || checker.isIntersectionType(type)) return false;

  const name = checker.getSymbolOfType(type)?.name ?? "";

  // NOTE: An ignored class is not a match, and neither is anything reached through it
  if (ignoredClasses.includes(name)) return false;
  if (targetSuperClasses.includes(name)) return true;

  const baseTypes = checker.getBaseTypes(type);
  return baseTypes.some((base) =>
    isExtendsFromTargetSuperClass(base, checker, targetSuperClasses, ignoredClasses),
  );
};
