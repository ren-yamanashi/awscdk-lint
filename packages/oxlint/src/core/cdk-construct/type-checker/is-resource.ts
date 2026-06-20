import type { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

import { isExtendsFromTargetSuperClass } from "../../ts-type/checker/is-extends-target-super-class";

/**
 * Check if the type extends Resource
 * @param type - The type to check
 * @param checker - The corsa-oxlint type checker
 * @param ignoredClasses - Classes that inherit from Resource but should not be treated as such
 * @returns True if the type extends Resource, otherwise false
 */
export const isResourceType = (
  type: CorsaType | undefined,
  checker: CorsaTypeCheckerShape,
  ignoredClasses: readonly string[] = [],
): boolean => {
  return isExtendsFromTargetSuperClass(type, checker, ["Resource"], ignoredClasses);
};
