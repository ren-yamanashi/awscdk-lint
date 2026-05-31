import type { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

import { isResourceWithReadonlyInterface } from "../type-checker/is-resource-with-readonly-interface";

/**
 * Recursively find the CorsaType to obtain type of CDK Construct class.
 * Handles direct types and type arguments (Array<T>, Promise<T>, etc.)
 */
export const findTypeOfCdkConstruct = (
  type: CorsaType,
  checker: CorsaTypeCheckerShape,
): CorsaType | undefined => {
  if (isResourceWithReadonlyInterface(type, checker)) return type;

  if (checker.isUnionType(type) || checker.isIntersectionType(type)) {
    for (const member of checker.getTypesOfType(type)) {
      const found = findTypeOfCdkConstruct(member, checker);
      if (found) return found;
    }
  }

  const typeArgs = checker.getTypeArguments(type);
  for (const arg of typeArgs) {
    const found = findTypeOfCdkConstruct(arg, checker);
    if (found) return found;
  }

  return undefined;
};
