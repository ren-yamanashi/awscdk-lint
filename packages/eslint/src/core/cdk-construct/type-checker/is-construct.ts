import { Type } from "typescript";

import { isExtendsFromTargetSuperClass } from "../../ts-type/checker/is-extends-target-super-class";

const DEFAULT_IGNORED_CLASSES = ["App", "Stage", "CfnOutput", "Stack"] as const;

/**
 * Check if the type extends Construct, ignoring the given classes themselves but not their subclasses
 * @param type - The type to check
 * @param ignoredClasses - Classes that inherit from Construct Class but do not want to be treated as Construct Class
 * @returns True if the type extends Construct, otherwise false
 */
export const isConstructType = (
  type: Type,
  ignoredClasses: readonly string[] = DEFAULT_IGNORED_CLASSES,
): boolean => {
  if (ignoredClasses.includes(type.symbol?.name ?? "")) return false;
  return isExtendsFromTargetSuperClass(type, ["Construct"]);
};

/**
 * Check if the type extends Construct, ignoring the given classes together with every class derived from them.
 * Used where instantiating an ignored class is idiomatic (e.g. `new SampleStack(app, "Sample")`),
 * so its subclasses must stay out of scope as well.
 * @param type - The type to check
 * @param ignoredClasses - Classes whose whole inheritance subtree is not treated as Construct Class
 * @returns True if the type extends Construct outside the ignored subtrees, otherwise false
 */
export const isConstructTypeIgnoringSubclasses = (
  type: Type,
  ignoredClasses: readonly string[] = DEFAULT_IGNORED_CLASSES,
): boolean => {
  return isExtendsFromTargetSuperClass(type, ["Construct"], ignoredClasses);
};
