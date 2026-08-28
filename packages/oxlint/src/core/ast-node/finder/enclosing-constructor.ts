import type { ESTree } from "corsa-oxlint";

import { AST_NODE_TYPES } from "corsa-oxlint";

type EnclosingFunction =
  | ESTree.FunctionExpression
  | ESTree.FunctionDeclaration
  | ESTree.ArrowFunctionExpression;

const FUNCTION_TYPES = [
  AST_NODE_TYPES.FunctionExpression,
  AST_NODE_TYPES.FunctionDeclaration,
  AST_NODE_TYPES.ArrowFunctionExpression,
] as const;

/**
 * Find the nearest enclosing function/method for a node.
 * Returns the first ancestor that introduces a new function scope.
 */
const findEnclosingFunction = (node: ESTree.Node): EnclosingFunction | undefined => {
  const parent = node.parent;
  if (!parent) return undefined;
  // NOTE: Corsa's wide node union does not narrow via Array.includes,
  // so use .some with equality to keep type inference happy.
  if (FUNCTION_TYPES.some((t) => t === parent.type)) {
    return parent as EnclosingFunction;
  }
  return findEnclosingFunction(parent);
};

/**
 * Return true when the node is inside a class constructor body,
 * without crossing any other function/method boundary first.
 */
export const isInsideConstructor = (node: ESTree.Node): boolean => {
  const fn = findEnclosingFunction(node);
  if (!fn) return false;
  const owner = fn.parent;
  return (
    fn.type === AST_NODE_TYPES.FunctionExpression &&
    owner?.type === AST_NODE_TYPES.MethodDefinition &&
    owner.kind === "constructor"
  );
};
