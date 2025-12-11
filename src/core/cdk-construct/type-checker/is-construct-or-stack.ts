import { Type } from "typescript";

import { isExtendsFromTargetSuperClass } from "../../ts-type/checker/is-extends-target-super-class";

/**
 * Check if the type extends Construct or Stack
 * @param type - The type to check
 * @param ignoredClasses - Classes that inherit from Construct Class or Stack Class but do not want to be treated as Construct Class or Stack Class
 * @returns True if the type extends Construct or Stack, otherwise false
 */
export const isConstructOrStackType = (
  type: Type,
  ignoredClasses: readonly string[] = ["App", "Stage", "CfnOutput"] as const
): boolean => {
  if (ignoredClasses.includes(type.symbol?.name ?? "")) return false;
  return isExtendsFromTargetSuperClass(
    type,
    ["Construct", "Stack"],
    isConstructOrStackType
  );
};
