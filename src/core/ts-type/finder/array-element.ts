import { Type } from "typescript";

import { isArrayType } from "../checker/is-array";


/**
 * Find the element type of an array type (e.g. for s3.Bucket[], returns s3.Bucket)
 * @param type - The type to check
 * @returns The element type if the type is an array, undefined otherwise
 */
export const findArrayElementType = (type: Type): Type | undefined => {
  if (!isArrayType(type)) return undefined;

  // Get type arguments for Array<T>
  if ("typeArguments" in type && Array.isArray(type.typeArguments)) {
    return (type.typeArguments as Type[])[0];
  }

  return undefined;
};
