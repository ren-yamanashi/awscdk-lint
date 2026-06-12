import { Type } from "typescript";

import { getSymbol } from "./private/get-symbol";

export const isArrayType = (type: Type): boolean => {
  const symbol = getSymbol(type);
  if (symbol?.name === "Array") return true;

  if ("target" in type && type.target) {
    const targetSymbol = getSymbol(type.target as Type);
    return targetSymbol?.name === "Array";
  }

  return false;
};
