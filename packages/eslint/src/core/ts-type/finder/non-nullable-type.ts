import { Type, TypeChecker } from "typescript";

/**
 * Find the non-nullable form of a type (e.g. `Topic | undefined` -> `Topic`)
 * @param type - The type to strip `undefined` / `null` / `void` from
 * @param checker - The TypeScript type checker
 * @returns The type without its `undefined` / `null` / `void` members
 */
export const findNonNullableType = (type: Type, checker: TypeChecker): Type => {
  return checker.getNonNullableType(type);
};
