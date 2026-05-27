import type { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

import { isExtendsFromTargetSuperClass } from "../../ts-type/checker/is-extends-target-super-class";

/**
 * Check if the type extends Resource
 * @param type - The type to check
 * @param checker - The tsgo type checker
 * @returns True if the type extends Resource, otherwise false
 */
export const isResourceType = (type: CorsaType, checker: CorsaTypeCheckerShape): boolean => {
  return isExtendsFromTargetSuperClass(type, checker, ["Resource"], []);
};
