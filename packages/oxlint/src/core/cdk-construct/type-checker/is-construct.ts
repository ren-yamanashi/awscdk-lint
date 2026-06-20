import type { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

import { isExtendsFromTargetSuperClass } from "../../ts-type/checker/is-extends-target-super-class";

/**
 * Check if the type extends Construct
 * @param type - The type to check
 * @param checker - The corsa-oxlint type checker
 * @param ignoredClasses - Classes that inherit from Construct but should not be treated as Construct
 * @returns True if the type extends Construct, otherwise false
 */
export const isConstructType = (
  type: CorsaType | undefined,
  checker: CorsaTypeCheckerShape,
  ignoredClasses: readonly string[] = ["App", "Stage", "CfnOutput", "Stack"] as const,
): boolean => {
  return isExtendsFromTargetSuperClass(type, checker, ["Construct"], ignoredClasses);
};
