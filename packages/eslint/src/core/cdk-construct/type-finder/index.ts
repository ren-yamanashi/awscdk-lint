import { Type } from "typescript";

import { findArrayElementType } from "../../../core/ts-type/finder/array-element";
import { findGenericsTypeArgument } from "../../../core/ts-type/finder/generics-type-argument";
import { isClassType } from "../../ts-type/checker/is-class";
import { isResourceWithReadonlyInterface } from "../type-checker/is-resource-with-readonly-interface";

/**
 * Recursively find the ts.Type to obtain type of CDK Construct class
 */
export const findTypeOfCdkConstruct = (type: Type): Type | undefined => {
  return findTypeOfCdkConstructRecursively(type, new Set<Type>());
};

/**
 * Walk the type and the types it is composed of, visiting each type once.
 *
 * NOTE: a recursive type alias (e.g. `type Nested = string | Nested[]`) refers back to itself,
 * so a type seen before yields nothing. The checker returns the same `Type` object for the same type.
 */
const findTypeOfCdkConstructRecursively = (type: Type, visited: Set<Type>): Type | undefined => {
  if (visited.has(type)) return undefined;
  visited.add(type);

  // NOTE: a constructor type (`typeof Bucket`) exposes no instance, so no read-only interface replaces it
  if (type.getConstructSignatures().length) return undefined;

  if (isClassType(type) && isResourceWithReadonlyInterface(type)) {
    return type;
  }
  return (
    findFromArray(type, visited) ??
    findFromGenerics(type, visited) ??
    findFromUnion(type, visited) ??
    findFromIntersection(type, visited)
  );
};

/**
 * Find Construct type from an array type (e.g. s3.Bucket[])
 */
const findFromArray = (type: Type, visited: Set<Type>): Type | undefined => {
  const arrElementType = findArrayElementType(type);
  if (!arrElementType) return undefined;

  return findTypeOfCdkConstructRecursively(arrElementType, visited);
};

/**
 * Find Construct type from a generics type
 * (e.g. Array<s3.Bucket>, Record<string, s3.Bucket>, [string, s3.Bucket], Promise<s3.Bucket[]>).
 * Walks every type argument so that Constructs at non-zero positions are also detected.
 */
const findFromGenerics = (type: Type, visited: Set<Type>): Type | undefined => {
  for (const argument of findGenericsTypeArgument(type)) {
    const foundType = findTypeOfCdkConstructRecursively(argument, visited);
    if (foundType) return foundType;
  }
  return undefined;
};

/**
 * Find Construct type from a union type (e.g. s3.Bucket | string)
 */
const findFromUnion = (type: Type, visited: Set<Type>): Type | undefined => {
  if (!type.isUnion()) return undefined;

  for (const unionType of type.types) {
    const foundType = findTypeOfCdkConstructRecursively(unionType, visited);
    if (foundType) return foundType;
  }
};

/**
 * Find Construct type from an intersection type (e.g. s3.Bucket & { customProp: string })
 */
const findFromIntersection = (type: Type, visited: Set<Type>): Type | undefined => {
  if (!type.isIntersection()) return undefined;

  for (const intersectionType of type.types) {
    const foundType = findTypeOfCdkConstructRecursively(intersectionType, visited);
    if (foundType) return foundType;
  }
};
