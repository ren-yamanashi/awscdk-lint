import { Type } from "typescript";

import { isExtendsFromTargetSuperClass } from "../../ts-type/checker/is-extends-target-super-class";

/**
 * Check if the type extends Resource
 * @param type - The type to check
 * @param ignoredClasses - Classes that inherit from Resource Class but do not want to be treated as Resource Class
 * @returns True if the type extends Resource, otherwise false
 */
export const isResourceType = (
  type: Type,
  ignoredClasses: readonly string[] = [] // App, Stage, CfnOutput, Stack are not extended Resource, so no need to ignore them
): boolean => {
  if (ignoredClasses.includes(type.symbol?.name ?? "")) return false;
  return isExtendsFromTargetSuperClass(type, ["Resource"], isResourceType);
};
