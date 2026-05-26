import type { TsgoType, TsgoTypeCheckerShape } from "corsa-oxlint";

import { isConstructType } from "../type-checker/is-construct";
import { isResourceType } from "../type-checker/is-resource";

/**
 * Recursively find the TsgoType to obtain type of CDK Construct class.
 * Handles direct types and type arguments (Array<T>, Promise<T>, etc.)
 */
export const findTypeOfCdkConstruct = (
  type: TsgoType,
  checker: TsgoTypeCheckerShape,
): TsgoType | undefined => {
  // NOTE: Must extend Resource (not just Construct) to match the ESLint version's isResourceWithReadonlyInterface
  if (isConstructType(type, checker) && isResourceType(type, checker)) return type;

  // NOTE: Check type arguments (for Array<T>, Promise<T>, etc.)
  const typeArgs = checker.getTypeArguments(type);
  for (const arg of typeArgs) {
    const found = findTypeOfCdkConstruct(arg, checker);
    if (found) return found;
  }

  return undefined;
};
