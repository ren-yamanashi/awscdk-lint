import type { ESTree } from "corsa-oxlint";

import { AST_NODE_TYPES } from "corsa-oxlint";

/**
 * Finds the constructor implementation in a class declaration / expression.
 * Overload signatures (body-less `TSEmptyBodyFunctionExpression` values) are skipped.
 * @param node The class declaration or expression
 * @returns The constructor implementation or undefined if not found
 */
export const findConstructor = (
  node: ESTree.ClassDeclaration | ESTree.ClassExpression,
): ESTree.MethodDefinition | undefined => {
  return node.body.body.find(
    (member): member is ESTree.MethodDefinition =>
      member.type === AST_NODE_TYPES.MethodDefinition &&
      member.kind === "constructor" &&
      member.value.type !== AST_NODE_TYPES.TSEmptyBodyFunctionExpression,
  );
};
