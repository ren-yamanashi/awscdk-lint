import type { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

import { isExtendsFromTargetSuperClass } from "../../ts-type/checker/is-extends-target-super-class";

/**
 * Check if the type extends Construct
 * @param type - The type to check
 * @param ignoredClasses - Classes that inherit from Construct Class but do not want to be treated as Construct Class
 * @returns True if the type extends Construct, otherwise false
 */
export const isConstructType = (
  type: CorsaType | undefined,
  checker: CorsaTypeCheckerShape,
  ignoredClasses: readonly string[] = ["App", "Stage", "CfnOutput", "Stack"] as const,
): boolean => {
  return isExtendsFromTargetSuperClass(type, checker, ["Construct"], ignoredClasses);
};
