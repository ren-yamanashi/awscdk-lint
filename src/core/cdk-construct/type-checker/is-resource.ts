import type { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

import { isExtendsFromTargetSuperClass } from "../../ts-type/checker/is-extends-target-super-class";

/**
 * Check if the type extends Resource
 * @param type - The type to check
 * @returns True if the type extends Resource, otherwise false
 */
export const isResourceType = (
  type: CorsaType | undefined,
  checker: CorsaTypeCheckerShape,
): boolean => {
  return isExtendsFromTargetSuperClass(type, checker, ["Resource"], []);
};
