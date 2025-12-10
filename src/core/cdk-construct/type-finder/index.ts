import { Type } from "typescript";

import { findArrayElementType } from "../../../core/ts-type/finder/array-element";
import { findGenericsTypeArgument } from "../../../core/ts-type/finder/generics-type-argument";
import { isClassType } from "../../ts-type/checker/is-class";
import { isResourceWithReadonlyInterface } from "../type-checker/is-resource-with-readonly-interface";

/**
 * Recursively find the ts.Type to obtain type of CDK Construct class
 */
export const findTypeOfCdkConstruct = (type: Type): Type | undefined => {
  if (isClassType(type) && isResourceWithReadonlyInterface(type)) {
    return type;
  }
  return (
    findFromArray(type) ??
    findFromGenerics(type) ??
    findFromUnion(type) ??
    findFromIntersection(type)
  );
};

/**
 * Find Construct type from an array type (e.g. s3.Bucket[])
 */
const findFromArray = (
  type: Type
): Type | undefined => {
  const arrElementType = findArrayElementType(type);
  if (!arrElementType) return undefined;

  return findTypeOfCdkConstruct(arrElementType);
};

/**
 * Find Construct type from a generics type (e.g. Array<s3.Bucket>, Promise<s3.Bucket[]>)
 */
const findFromGenerics = (
  type: Type
): Type | undefined => {
  const genericsArgument = findGenericsTypeArgument(type);
  if (!genericsArgument) return undefined;

  return findTypeOfCdkConstruct(genericsArgument);
};

/**
 * Find Construct type from a union type (e.g. s3.Bucket | string)
 */
const findFromUnion = (
  type: Type
): Type | undefined => {
  if (!type.isUnion()) return undefined;

  for (const unionType of type.types) {
    const foundType = findTypeOfCdkConstruct(unionType);
    if (foundType) return foundType;
  }
};

/**
 * Find Construct type from an intersection type (e.g. s3.Bucket & { customProp: string })
 */
const findFromIntersection = (
  type: Type
): Type | undefined => {
  if (!type.isIntersection()) return undefined;

  for (const intersectionType of type.types) {
    const foundType = findTypeOfCdkConstruct(intersectionType);
    if (foundType) return foundType;
  }
};
