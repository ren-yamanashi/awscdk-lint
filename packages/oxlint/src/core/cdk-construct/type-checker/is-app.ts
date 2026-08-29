import type { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

import { isExtendsFromTargetSuperClass } from "../../ts-type/checker/is-extends-target-super-class";

/**
 * Check if the type is App or extends App
 * @param type - The type to check
 * @param checker - The corsa-oxlint type checker
 * @returns True if the type is App or extends App, otherwise false
 */
export const isAppType = (type: CorsaType | undefined, checker: CorsaTypeCheckerShape): boolean => {
  return isExtendsFromTargetSuperClass(type, checker, ["App"]);
};
