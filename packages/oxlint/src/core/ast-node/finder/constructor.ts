import type { ESTree } from "corsa-oxlint";

import { AST_NODE_TYPES } from "corsa-oxlint";

/**
 * Finds the constructor method in a class declaration / expression
 * @param node The class declaration or expression
 * @returns The constructor method definition or undefined if not found
 */
export const findConstructor = (
  node: ESTree.ClassDeclaration | ESTree.ClassExpression,
): ESTree.MethodDefinition | undefined => {
  return node.body.body.find(
    (member): member is ESTree.MethodDefinition =>
      member.type === AST_NODE_TYPES.MethodDefinition && member.kind === "constructor",
  );
};
