import type { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

import { isExtendsFromTargetSuperClass } from "../../ts-type/checker/is-extends-target-super-class";

/**
 * Check if the type extends Construct or Stack
 * @param type - The type to check
 * @param checker - The corsa-oxlint type checker
 * @param ignoredClasses - Classes that inherit from Construct/Stack but should not be treated as such
 * @returns True if the type extends Construct or Stack, otherwise false
 */
export const isConstructOrStackType = (
  type: CorsaType | undefined,
  checker: CorsaTypeCheckerShape,
  ignoredClasses: readonly string[] = ["App", "Stage", "CfnOutput"] as const,
): boolean => {
  return isExtendsFromTargetSuperClass(type, checker, ["Construct", "Stack"], ignoredClasses);
};
