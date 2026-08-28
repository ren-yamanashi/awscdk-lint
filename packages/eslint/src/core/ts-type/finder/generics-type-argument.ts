import { Type } from "typescript";

/**
 * Extracts all type arguments from a generics type reference
 * (e.g. Array<s3.Bucket> -> [s3.Bucket], Record<string, s3.Bucket> -> [string, s3.Bucket]).
 * Mirrors the oxlint plugin's checker.getTypeArguments walk so both linters detect
 * Construct types in any position (fixes #537).
 */
export const findGenericsTypeArgument = (type: Type): readonly Type[] => {
  // Check for type alias (e.g. Readonly<T>, Partial<T>)
  if (
    "aliasSymbol" in type &&
    type.aliasSymbol &&
    "aliasTypeArguments" in type &&
    type.aliasTypeArguments?.length
  ) {
    return [...type.aliasTypeArguments];
  }

  // Check for typeArguments (generics/TypeReference like Array<T>, Record<K, V>, tuples)
  if ("typeArguments" in type && Array.isArray(type.typeArguments) && type.typeArguments.length) {
    return [...(type.typeArguments as readonly Type[])];
  }

  if (
    "target" in type &&
    type.target &&
    "typeArguments" in type &&
    Array.isArray(type.typeArguments) &&
    type.typeArguments.length
  ) {
    return [...(type.typeArguments as readonly Type[])];
  }

  // Mapped types like Readonly<T> / Partial<T> lose typeArguments after
  // resolution; modifiersType exposes the wrapped type.
  if ("modifiersType" in type && type.modifiersType) {
    return [type.modifiersType as Type];
  }

  return [];
};
