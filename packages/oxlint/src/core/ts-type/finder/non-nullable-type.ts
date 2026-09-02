import type { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

const NULLISH_TYPE_NAMES = ["undefined", "null"];

/**
 * Find the non-nullable form of a type (e.g. `Topic | undefined` -> `Topic`).
 * A union that still holds more than one member after `undefined` / `null` are removed is
 * returned unchanged, because no single member describes the value on its own.
 * @param type - The type to strip `undefined` / `null` from
 * @param checker - The corsa-oxlint type checker
 * @returns The type without its `undefined` / `null` members
 */
export const findNonNullableType = (type: CorsaType, checker: CorsaTypeCheckerShape) => {
  if (!checker.isUnionType(type)) return type;

  const nonNullishTypes = checker
    .getTypesOfType(type)
    .filter((member) => !NULLISH_TYPE_NAMES.includes(checker.typeToString(member)));

  return nonNullishTypes.length === 1 ? nonNullishTypes[0] : type;
};
