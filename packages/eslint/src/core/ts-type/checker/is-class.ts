import { SymbolFlags, Type } from "typescript";

import { getSymbol } from "./private/get-symbol";

export const isClassType = (type: Type): boolean => {
  return getSymbol(type)?.flags === SymbolFlags.Class;
};
