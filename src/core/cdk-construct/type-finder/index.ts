import { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

import { isResourceWithReadonlyInterface } from "../type-checker/is-resource-with-readonly-interface";

/**
 * Recursively find the ts.Type to obtain type of CDK Construct class
 */
export const findTypeOfCdkConstruct = (
  type: CorsaType | undefined,
  checker: CorsaTypeCheckerShape,
): CorsaType | undefined => {
  if (!type) return undefined;
  if (isResourceWithReadonlyInterface(type, checker)) return type;
  return findFromUnionOrIntersection(type, checker) ?? findFromTypeArguments(type, checker);
};

/**
 * Find Construct type from a union or intersection type
 * @example s3.Bucket | string, s3.Bucket & { customProp: string }
 */
const findFromUnionOrIntersection = (
  type: CorsaType,
  checker: CorsaTypeCheckerShape,
): CorsaType | undefined => {
  if (!checker.isUnionType(type) && !checker.isIntersectionType(type)) return undefined;

  for (const member of checker.getTypesOfType(type)) {
    const foundType = findTypeOfCdkConstruct(member, checker);
    if (foundType) return foundType;
  }
};

/**
 * Find Construct type from a generics/array type
 * @example s3.Bucket[], Array<s3.Bucket>, Promise<s3.Bucket[]>
 */
const findFromTypeArguments = (
  type: CorsaType,
  checker: CorsaTypeCheckerShape,
): CorsaType | undefined => {
  for (const arg of checker.getTypeArguments(type)) {
    const foundType = findTypeOfCdkConstruct(arg, checker);
    if (foundType) return foundType;
  }
};
