import { SymbolFlags, Type } from "typescript";

import { getSymbol } from "./private/get-symbol";

/**
 * Checks whether the type is declared by a class
 *
 * NOTE: `SymbolFlags` is a bit field, so it must be tested with a mask.
 * A class that is declaration-merged with an interface of the same name
 * (as the generated CDK `*-augmentations.generated.d.ts` files do) carries
 * `Interface` and `Transient` in addition to `Class`.
 */
export const isClassType = (type: Type): boolean => {
  return ((getSymbol(type)?.flags ?? 0) & SymbolFlags.Class) !== 0;
};
