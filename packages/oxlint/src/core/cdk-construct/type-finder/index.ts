import { type CorsaType, type CorsaTypeCheckerShape, SignatureKind } from "corsa-oxlint";

import { isResourceWithReadonlyInterface } from "../type-checker/is-resource-with-readonly-interface";

/**
 * Recursively find the CorsaType to obtain type of CDK Construct class
 */
export const findTypeOfCdkConstruct = (
  type: CorsaType | undefined,
  checker: CorsaTypeCheckerShape,
): CorsaType | undefined => {
  return findTypeOfCdkConstructRecursively(type, checker, new Set<string>());
};

/**
 * Walk the type and the types it is composed of, visiting each type once.
 *
 * NOTE: a recursive type alias (e.g. `type Nested = string | Nested[]`) refers back to itself,
 * so a type seen before yields nothing. corsa returns a new object per query, so the set holds `id`s.
 */
const findTypeOfCdkConstructRecursively = (
  type: CorsaType | undefined,
  checker: CorsaTypeCheckerShape,
  visited: Set<string>,
): CorsaType | undefined => {
  if (!type || visited.has(type.id)) return undefined;
  visited.add(type.id);

  // NOTE: a constructor type (`typeof Bucket`) exposes no instance, so no read-only interface replaces it
  if (checker.getSignaturesOfType(type, SignatureKind.Construct).length) return undefined;

  if (isResourceWithReadonlyInterface(type, checker)) return type;
  return (
    findFromUnionOrIntersection(type, checker, visited) ??
    findFromTypeArguments(type, checker, visited)
  );
};

/**
 * Find Construct type from a union or intersection type
 * (e.g. s3.Bucket | string, s3.Bucket & { customProp: string })
 */
const findFromUnionOrIntersection = (
  type: CorsaType,
  checker: CorsaTypeCheckerShape,
  visited: Set<string>,
): CorsaType | undefined => {
  if (!checker.isUnionType(type) && !checker.isIntersectionType(type)) return undefined;

  for (const member of checker.getTypesOfType(type)) {
    const foundType = findTypeOfCdkConstructRecursively(member, checker, visited);
    if (foundType) return foundType;
  }
};

/**
 * Find Construct type from a generics/array type
 * (e.g. s3.Bucket[], Array<s3.Bucket>, Promise<s3.Bucket[]>)
 */
const findFromTypeArguments = (
  type: CorsaType,
  checker: CorsaTypeCheckerShape,
  visited: Set<string>,
): CorsaType | undefined => {
  for (const arg of checker.getTypeArguments(type)) {
    const foundType = findTypeOfCdkConstructRecursively(arg, checker, visited);
    if (foundType) return foundType;
  }
};
