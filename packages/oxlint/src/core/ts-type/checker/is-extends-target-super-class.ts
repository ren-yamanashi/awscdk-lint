import type { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

import { safeGetSymbolOfType } from "./safe-get-symbol-of-type";

/**
 * Check if the type extends one of the target super classes (recursively walking the base type chain).
 * @param type - The type to check
 * @param checker - The corsa-oxlint type checker
 * @param targetSuperClasses - Super class names to match
 * @param ignoredClasses - Class names to treat as non-match even if they would match
 * @returns True if the type extends any of the target super classes
 */
export const isExtendsFromTargetSuperClass = (
  type: CorsaType | undefined,
  checker: CorsaTypeCheckerShape,
  targetSuperClasses: readonly string[],
  ignoredClasses: readonly string[],
): boolean => {
  if (!type || !type.id) return false;
  const name = safeGetSymbolOfType(type, checker)?.name ?? "";

  if (ignoredClasses.includes(name)) return false;
  if (targetSuperClasses.includes(name)) return true;

  const baseTypes = checker.getBaseTypes(type);
  return baseTypes.some((base) =>
    isExtendsFromTargetSuperClass(base, checker, targetSuperClasses, ignoredClasses),
  );
};
