import type { TsgoType, TsgoTypeCheckerShape } from "corsa-oxlint";

import { Type } from "typescript";

import { safeCall } from "../../../shared/safe-call";
import { normalizeTypeName } from "../../../shared/type-name";

/**
 * Check if the type extends target super class
 * @param type - The type to check
 * @param targetSuperClasses - The target super classes
 * @returns True if the type extends target super class, otherwise false
 */
export const isExtendsFromTargetSuperClass = (
  type: Type,
  targetSuperClasses: string[],
  typeCheckFunction: (type: Type) => boolean,
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

/**
 * Check if the type extends target super class (oxlint version using TsgoTypeCheckerShape)
 * @param type - The type to check
 * @param checker - The tsgo type checker
 * @param targetSuperClasses - The target super classes
 * @param ignoredClasses - Classes to ignore
 * @returns True if the type extends target super class, otherwise false
 */
export const isExtendsFromTargetSuperClassOxlint = (
  type: TsgoType,
  checker: TsgoTypeCheckerShape,
  targetSuperClasses: readonly string[],
  ignoredClasses: readonly string[],
  visited = new Set<string>(),
): boolean => {
  const rawTypeName = checker.typeToString(type) ?? "";
  if (!rawTypeName || visited.has(rawTypeName)) return false;
  visited.add(rawTypeName);

  const typeName = normalizeTypeName(rawTypeName);
  if (ignoredClasses.includes(typeName)) return false;
  if (targetSuperClasses.includes(typeName)) return true;

  // NOTE: For "typeof ClassName" types, resolve instance type via construct signatures
  if (rawTypeName.startsWith("typeof ")) {
    const signatures = checker.getSignaturesOfType(type, 1);
    for (const sig of signatures) {
      const returnType = checker.getReturnTypeOfSignature(sig);
      if (
        returnType &&
        isExtendsFromTargetSuperClassOxlint(
          returnType,
          checker,
          targetSuperClasses,
          ignoredClasses,
          visited,
        )
      ) {
        return true;
      }
    }
  }

  // NOTE: Check the base type
  const baseTypes = safeCall(() => checker.getBaseTypes(type), []);
  return baseTypes.some((base) =>
    isExtendsFromTargetSuperClassOxlint(
      base,
      checker,
      targetSuperClasses,
      ignoredClasses,
      visited,
    ),
  );
};
