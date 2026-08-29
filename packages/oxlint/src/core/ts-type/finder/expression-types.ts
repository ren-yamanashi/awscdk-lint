import type { CorsaType, CorsaTypeCheckerShape, ESTree, ParserServices } from "corsa-oxlint";

import { AST_NODE_TYPES, SignatureKind } from "corsa-oxlint";

/**
 * Find the candidate types of an expression.
 *
 * `parserServices.getTypeAtLocation()` resolves a `CallExpression` to the type of the node its
 * range starts at (the callee, or the receiver of a method call) rather than to the type of the
 * call result, so a call is resolved from the call signatures of its callee instead.
 *
 * An overload set contributes every candidate return type, because the signature a call selects
 * is not exposed. Callers must therefore require their condition to hold for all returned types.
 * @param node - The expression to resolve
 * @param parserServices - The corsa-oxlint parser services
 * @param checker - The corsa-oxlint type checker
 * @returns The candidate types, or an empty array when the expression cannot be resolved
 */
export const findExpressionTypes = (
  node: ESTree.Node,
  parserServices: ParserServices,
  checker: CorsaTypeCheckerShape,
): CorsaType[] => {
  // A computed member expression resolves to the type of the object it indexes rather than to
  // the indexed member, so its type cannot be trusted. This also covers a computed member used
  // as a callee, whose call signatures would otherwise describe the wrong value.
  if (node.type === AST_NODE_TYPES.MemberExpression && node.computed) return [];

  if (node.type !== AST_NODE_TYPES.CallExpression) {
    const type = parserServices.getTypeAtLocation(node);
    return type ? [type] : [];
  }

  const returnTypes = findExpressionTypes(node.callee, parserServices, checker).map((calleeType) =>
    findCallReturnTypes(calleeType, checker),
  );
  return returnTypes.every((types) => types.length > 0) ? returnTypes.flat() : [];
};

/**
 * Find the return types of every call signature of a callee type.
 * A signature whose return type cannot be resolved drops the whole lookup, so that a partially
 * resolved overload set is never mistaken for a complete one.
 */
const findCallReturnTypes = (
  calleeType: CorsaType,
  checker: CorsaTypeCheckerShape,
): CorsaType[] => {
  const signatures = checker.getSignaturesOfType(calleeType, SignatureKind.Call);
  const returnTypes = signatures.flatMap((signature) => {
    const returnType = checker.getReturnTypeOfSignature(signature);
    return returnType ? [returnType] : [];
  });
  return returnTypes.length === signatures.length ? returnTypes : [];
};
