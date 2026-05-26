import type { TsgoType, TsgoTypeCheckerShape } from "corsa-oxlint";

import { isExtendsFromTargetSuperClass } from "../../ts-type/checker/is-extends-target-super-class";

const TARGET_CLASSES = ["Construct", "Stack"] as const;
const IGNORED_CLASSES = ["App", "Stage", "CfnOutput"] as const;

/**
 * Check if the type extends Construct or Stack
 * @param type - The type to check
 * @param checker - The tsgo type checker
 * @returns True if the type extends Construct or Stack, otherwise false
 */
export const isConstructOrStackType = (type: TsgoType, checker: TsgoTypeCheckerShape): boolean => {
  return isExtendsFromTargetSuperClass(type, checker, TARGET_CLASSES, IGNORED_CLASSES);
};
