import { Type } from "typescript";

import { isExtendsFromTargetSuperClass } from "../../ts-type/checker/is-extends-target-super-class";

/**
 * Check if the type is App or extends App
 * @param type - The type to check
 * @returns True if the type is App or extends App, otherwise false
 */
export const isAppType = (type: Type): boolean => {
  return isExtendsFromTargetSuperClass(type, ["App"]);
};
