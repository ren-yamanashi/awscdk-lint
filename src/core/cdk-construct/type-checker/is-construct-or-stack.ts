import type { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

import { isExtendsFromTargetSuperClass } from "../../ts-type/checker/is-extends-target-super-class";

const TARGET_CLASSES = ["Construct", "Stack"] as const;
const IGNORED_CLASSES = ["App", "Stage", "CfnOutput"] as const;

/**
 * Check if the type extends Construct or Stack
 * @param type - The type to check
 * @param checker - The tsgo type checker
 * @returns True if the type extends Construct or Stack, otherwise false
 */
export const isConstructOrStackType = (
  type: CorsaType,
  checker: CorsaTypeCheckerShape,
): boolean => {
  return isExtendsFromTargetSuperClass(type, checker, TARGET_CLASSES, IGNORED_CLASSES);
};
