import type { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

import { SignatureKind } from "corsa-oxlint";

/**
 * Parses type to get the property names of the class constructor.
 * @returns The property names of the class constructor.
 */
export const findConstructorPropertyNames = (
  type: CorsaType | undefined,
  checker: CorsaTypeCheckerShape,
): string[] => {
  if (!type) return [];
  const signature = checker.getSignaturesOfType(type, SignatureKind.Construct)[0];
  if (!signature?.parameterSymbols) return [];

  return signature.parameterSymbols.map((symbol) => symbol.name);
};
