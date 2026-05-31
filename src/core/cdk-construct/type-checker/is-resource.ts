import type { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

import { isExtendsFromTargetSuperClass } from "../../ts-type/checker/is-extends-target-super-class";

/**
 * Check if the type extends Resource
 * @param type - The type to check
 * @param ignoredClasses - Classes that inherit from Resource Class but do not want to be treated as Resource Class
 * @returns True if the type extends Resource, otherwise false
 */
export const isResourceType = (
  type: CorsaType | undefined,
  checker: CorsaTypeCheckerShape,
  ignoredClasses: readonly string[] = [], // App, Stage, CfnOutput, Stack are not extended Resource, so no need to ignore them
): boolean => {
  return isExtendsFromTargetSuperClass(type, checker, ["Resource"], ignoredClasses);
};
