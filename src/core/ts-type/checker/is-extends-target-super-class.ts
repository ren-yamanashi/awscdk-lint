import { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

/**
 * Check if the type extends target super class
 * @param type - The type to check
 * @param checker - The type checker
 * @param targetSuperClasses - The target super classes
 * @param ignoredClasses - Classes that inherit from target super class but do not want to be treated as target super class
 * @returns True if the type extends target super class, otherwise false
 */
export const isExtendsFromTargetSuperClass = (args: {
  type: CorsaType | undefined;
  checker: CorsaTypeCheckerShape;
  targetSuperClasses: string[];
  ignoredClasses: readonly string[];
}): boolean => {
  const { type, checker, targetSuperClasses, ignoredClasses } = args;

  if (!type) return false;
  const name = checker.getSymbolOfType(type)?.name ?? "";

  if (ignoredClasses.includes(name)) return false;
  if (targetSuperClasses.includes(name)) return true;

  // NOTE: Check the base type
  const baseTypes = checker.getBaseTypes(type);
  return baseTypes.some((baseType) =>
    isExtendsFromTargetSuperClass({
      type: baseType,
      checker,
      targetSuperClasses,
      ignoredClasses,
    }),
  );
};
