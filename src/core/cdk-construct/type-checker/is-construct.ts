import type { TsgoType, TsgoTypeCheckerShape } from "corsa-oxlint";
import { Type } from "typescript";

import {
  isExtendsFromTargetSuperClass,
  isExtendsFromTargetSuperClassOxlint,
} from "../../ts-type/checker/is-extends-target-super-class";

const CDK_BASE_CLASSES = ["Construct", "Stack", "Resource"] as const;
const IGNORED_CLASSES = ["App", "Stage", "CfnOutput"] as const;

/**
 * Check if the type extends Construct
 * @param type - The type to check
 * @param ignoredClasses - Classes that inherit from Construct Class but do not want to be treated as Construct Class
 * @returns True if the type extends Construct, otherwise false
 */
export const isConstructType = (
  type: Type,
  ignoredClasses: readonly string[] = ["App", "Stage", "CfnOutput", "Stack"] as const,
): boolean => {
  if (ignoredClasses.includes(type.symbol?.name ?? "")) return false;
  return isExtendsFromTargetSuperClass(type, ["Construct"], isConstructType);
};

/**
 * Check if the type extends a CDK Construct/Stack/Resource (oxlint version)
 * @param type - The type to check
 * @param checker - The tsgo type checker
 * @returns True if the type extends Construct, Stack, or Resource, otherwise false
 */
export const isConstructTypeOxlint = (type: TsgoType, checker: TsgoTypeCheckerShape): boolean => {
  return isExtendsFromTargetSuperClassOxlint(type, checker, CDK_BASE_CLASSES, IGNORED_CLASSES);
};
