import type { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

// NOTE: SignatureKind.Construct (Call = 0, Construct = 1)
const CONSTRUCT_SIGNATURE_KIND = 1;

/**
 * Parses type to get the property names of the class constructor.
 * @returns The property names of the class constructor.
 */
export const findConstructorPropertyNames = (
  type: CorsaType | undefined,
  checker: CorsaTypeCheckerShape,
): string[] => {
  if (!type) return [];
  const signature = checker.getSignaturesOfType(type, CONSTRUCT_SIGNATURE_KIND)[0];
  if (!signature) return [];

  return signature.parameters.reduce<string[]>((acc, id) => {
    const symbol = checker.getSymbolById(id);
    return symbol ? [...acc, symbol.name] : acc;
  }, []);
};
