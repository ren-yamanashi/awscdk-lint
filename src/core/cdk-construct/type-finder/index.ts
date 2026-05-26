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

  // NOTE: Decompose union / intersection types (e.g. `Bucket | undefined`, `Bucket & {...}`)
  if (checker.isUnionType(type) || checker.isIntersectionType(type)) {
    for (const member of checker.getTypesOfType(type)) {
      const found = findTypeOfCdkConstruct(member, checker);
      if (found) return found;
    }
  }

  // NOTE: Check type arguments (for Array<T>, Promise<T>, Readonly<T>, etc.)
  const typeArgs = checker.getTypeArguments(type);
  for (const arg of typeArgs) {
    const found = findTypeOfCdkConstruct(arg, checker);
    if (found) return found;
  }

  return undefined;
};
