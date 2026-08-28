import { SignatureKind, Type, TypeChecker } from "typescript";

/**
 * Parses type to get the property names of the class constructor.
 * Resolves via construct signatures so that inherited constructors are honored.
 * @returns The property names of the class constructor.
 */
export const findConstructorPropertyNames = (
  type: Type | undefined,
  checker: TypeChecker,
): string[] => {
  if (!type) return [];
  const signature = checker.getSignaturesOfType(type, SignatureKind.Construct)[0];
  if (!signature) return [];

  return signature.getParameters().map((symbol) => symbol.name);
};
