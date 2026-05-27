import type { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

import { isExtendsFromTargetSuperClass } from "../../ts-type/checker/is-extends-target-super-class";

/**
 * Check if the type extends Construct
 * @param type - The type to check
 * @param checker - The tsgo type checker
 * @returns True if the type extends Construct, otherwise false
 */
export const isConstructType = (type: CorsaType, checker: CorsaTypeCheckerShape): boolean => {
  return isExtendsFromTargetSuperClass(
    type,
    checker,
    ["Construct"],
    ["App", "Stage", "CfnOutput", "Stack"],
  );
};
