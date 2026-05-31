import type { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

import { isExtendsFromTargetSuperClass } from "../../ts-type/checker/is-extends-target-super-class";

/**
 * Check if the type extends Construct or Stack
 * @param type - The type to check
 * @returns True if the type extends Construct or Stack, otherwise false
 */
export const isConstructOrStackType = (
  type: CorsaType | undefined,
  checker: CorsaTypeCheckerShape,
): boolean => {
  return isExtendsFromTargetSuperClass(
    type,
    checker,
    ["Construct", "Stack"],
    ["App", "Stage", "CfnOutput"],
  );
};
