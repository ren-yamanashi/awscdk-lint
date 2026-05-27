import type { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

import { safeCall } from "../../../shared/safe-call";
import { normalizeTypeName } from "../../../shared/type-name";

/**
 * Check if the type extends target super class
 * @param type - The type to check
 * @param checker - The tsgo type checker
 * @param targetSuperClasses - The target super classes
 * @param ignoredClasses - Classes to ignore
 * @returns True if the type extends target super class, otherwise false
 */
export const isExtendsFromTargetSuperClass = (
  type: CorsaType,
  checker: CorsaTypeCheckerShape,
  targetSuperClasses: readonly string[],
  ignoredClasses: readonly string[],
  visited = new Set<string>(),
): boolean => {
  const rawTypeName = checker.typeToString(type);
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
        isExtendsFromTargetSuperClass(
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

  // NOTE: getBaseTypes still panics on some generic type references (e.g.
  // `Wrapper<Bucket>`, `Promise<Array<Bucket>>`), so guard it with safeCall.
  const baseTypes = safeCall(() => checker.getBaseTypes(type), []);
  return baseTypes.some((base) =>
    isExtendsFromTargetSuperClass(base, checker, targetSuperClasses, ignoredClasses, visited),
  );
};
