import type { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

import { isExtendsFromTargetSuperClass } from "../../ts-type/checker/is-extends-target-super-class";

const DEFAULT_IGNORED_CLASSES = ["App", "Stage", "CfnOutput", "Stack"] as const;

/**
 * Check if the type extends Construct, ignoring the given classes themselves but not their subclasses
 * @param type - The type to check
 * @param checker - The corsa-oxlint type checker
 * @param ignoredClasses - Classes that inherit from Construct but should not be treated as Construct
 * @returns True if the type extends Construct, otherwise false
 */
export const isConstructType = (
  type: CorsaType | undefined,
  checker: CorsaTypeCheckerShape,
  ignoredClasses: readonly string[] = DEFAULT_IGNORED_CLASSES,
): boolean => {
  if (!type) return false;
  if (ignoredClasses.includes(checker.getSymbolOfType(type)?.name ?? "")) return false;
  return isExtendsFromTargetSuperClass(type, checker, ["Construct"]);
};

/**
 * Check if the type extends Construct, ignoring the given classes together with every class derived from them.
 * Used where instantiating an ignored class is idiomatic (e.g. `new SampleStack(app, "Sample")`),
 * so its subclasses must stay out of scope as well.
 * @param type - The type to check
 * @param checker - The corsa-oxlint type checker
 * @param ignoredClasses - Classes whose whole inheritance subtree is not treated as Construct
 * @returns True if the type extends Construct outside the ignored subtrees, otherwise false
 */
export const isConstructTypeIgnoringSubclasses = (
  type: CorsaType | undefined,
  checker: CorsaTypeCheckerShape,
  ignoredClasses: readonly string[] = DEFAULT_IGNORED_CLASSES,
): boolean => {
  return isExtendsFromTargetSuperClass(type, checker, ["Construct"], ignoredClasses);
};
