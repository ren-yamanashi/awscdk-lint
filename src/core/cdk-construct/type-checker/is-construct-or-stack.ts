import type { TsgoType, TsgoTypeCheckerShape } from "corsa-oxlint";
import { Type } from "typescript";

import {
  isExtendsFromTargetSuperClass,
  isExtendsFromTargetSuperClassOxlint,
} from "../../ts-type/checker/is-extends-target-super-class";

const TARGET_CLASSES = ["Construct", "Stack"] as const;
const IGNORED_CLASSES = ["App", "Stage", "CfnOutput"] as const;

/**
 * Check if the type extends Construct or Stack
 * @param type - The type to check
 * @param ignoredClasses - Classes that inherit from Construct Class or Stack Class but do not want to be treated as Construct Class or Stack Class
 * @returns True if the type extends Construct or Stack, otherwise false
 */
export const isConstructOrStackType = (
  type: Type,
  ignoredClasses: readonly string[] = IGNORED_CLASSES,
): boolean => {
  if (ignoredClasses.includes(type.symbol?.name ?? "")) return false;
  return isExtendsFromTargetSuperClass(type, [...TARGET_CLASSES], isConstructOrStackType);
};

/**
 * Check if the type extends Construct or Stack (oxlint version)
 * @param type - The type to check
 * @param checker - The tsgo type checker
 * @returns True if the type extends Construct or Stack, otherwise false
 */
export const isConstructOrStackTypeOxlint = (
  type: TsgoType,
  checker: TsgoTypeCheckerShape,
): boolean => {
  return isExtendsFromTargetSuperClassOxlint(type, checker, TARGET_CLASSES, IGNORED_CLASSES);
};
