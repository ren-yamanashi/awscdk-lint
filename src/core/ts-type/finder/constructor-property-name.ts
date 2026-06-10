import { CorsaType, CorsaTypeCheckerShape, SignatureKind } from "corsa-oxlint";

/**
 * Parses type to get the property names of the class constructor.
 * @returns The property names of the class constructor.
 * @param type - The type to parse
 * @param checker - The type checker
 */
export const findConstructorPropertyNames = (
  type: CorsaType | undefined,
  checker: CorsaTypeCheckerShape,
): string[] => {
  if (!type) return [];
  const signatures = checker.getSignaturesOfType(type, SignatureKind.Construct)[0];
  if (!signatures?.parameterSymbols) return [];

  return signatures.parameterSymbols.map((symbol) => symbol.name);
};
