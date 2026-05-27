import type { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

// NOTE: SignatureKind.Construct (Call = 0, Construct = 1)
const CONSTRUCT_SIGNATURE_KIND = 1;

/**
 * Resolve the parameter names of a class's constructor.
 * @param type - The `typeof ClassName` type (e.g. from `getTypeAtLocation(node.callee)`)
 * @param checker - The tsgo type checker
 * @returns The constructor parameter names in order (e.g. `["scope", "id", "props"]`)
 */
export const findConstructorPropertyNames = (
  type: CorsaType,
  checker: CorsaTypeCheckerShape,
): string[] => {
  const signature = checker.getSignaturesOfType(type, CONSTRUCT_SIGNATURE_KIND)[0];
  if (!signature) return [];

  // MEMO: `getSymbolById` resolves the name only for parameters declared in the
  // linted source; for parameters from `.d.ts` declarations (e.g. aws-cdk-lib's
  // `Bucket`) it returns a symbol whose `name` is an empty string. Empty entries
  // are kept so positions stay aligned; callers should treat "" as "unresolved".
  return signature.parameters.reduce<string[]>((acc, id) => {
    const symbol = checker.getSymbolById(id);
    return symbol ? [...acc, symbol.name] : acc;
  }, []);
};
