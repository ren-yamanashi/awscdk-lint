import { Type } from "typescript";

import { isExtendsFromTargetSuperClass } from "../../ts-type/checker/is-extends-target-super-class";

/**
 * Check if the type extends Construct
 * @param type - The type to check
 * @param ignoredClasses - Classes that inherit from Construct Class but do not want to be treated as Construct Class
 * @returns True if the type extends Construct, otherwise false
 */
export const isConstructType = (
  type: Type,
  ignoredClasses: readonly string[] = [
    "App",
    "Stage",
    "CfnOutput",
    "Stack",
  ] as const
): boolean => {
  if (ignoredClasses.includes(type.symbol?.name ?? "")) return false;
  return isExtendsFromTargetSuperClass(type, ["Construct"], isConstructType);
};
