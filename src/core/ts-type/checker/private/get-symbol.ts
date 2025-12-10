import { Symbol, Type } from "typescript";

export const getSymbol = (type: Type): Symbol | undefined => {
  return type.getSymbol?.() ?? type.symbol;
};
