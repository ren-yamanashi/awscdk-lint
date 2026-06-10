import { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

import { isExtendsFromTargetSuperClass } from "../../ts-type/checker/is-extends-target-super-class";

/**
 * Check if the type extends Construct or Stack
 * @param type - The type to check
 * @param ignoredClasses - Classes that inherit from Construct Class or Stack Class but do not want to be treated as Construct Class or Stack Class
 * @returns True if the type extends Construct or Stack, otherwise false
 */
export const isConstructOrStackType = (
  type: CorsaType | undefined,
  checker: CorsaTypeCheckerShape,
  ignoredClasses: readonly string[] = ["App", "Stage", "CfnOutput"] as const,
): boolean => {
  return isExtendsFromTargetSuperClass({
    type,
    checker,
    targetSuperClasses: ["Construct", "Stack"],
    ignoredClasses,
  });
};
