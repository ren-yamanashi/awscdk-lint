import type { ESTree } from "corsa-oxlint";

import { AST_NODE_TYPES } from "corsa-oxlint";

const ITERATION_METHODS = new Set([
  "forEach",
  "map",
  "flatMap",
  "filter",
  "reduce",
  "reduceRight",
  "every",
  "some",
  "find",
  "findIndex",
  "findLast",
  "findLastIndex",
]);

/**
 * Find the body of the loop enclosing a given node.
 * Detects for, for...in, for...of, while, do...while statements,
 * and callbacks of iteration methods (forEach, map, etc.)
 * @param node The node to start searching from
 * @returns The enclosing loop body or null if the node is not inside a loop
 */
export const findEnclosingLoopBody = (node: ESTree.Node): ESTree.Node | null => {
  const parent = node.parent;
  if (!parent) return null;

  // NOTE: Detect loop statements
  if (
    parent.type === AST_NODE_TYPES.ForStatement ||
    parent.type === AST_NODE_TYPES.ForInStatement ||
    parent.type === AST_NODE_TYPES.ForOfStatement ||
    parent.type === AST_NODE_TYPES.WhileStatement ||
    parent.type === AST_NODE_TYPES.DoWhileStatement
  ) {
    return parent.body;
  }

  // NOTE: Detect iteration method callbacks (ArrowFunction/FunctionExpression)
  if (
    (parent.type === AST_NODE_TYPES.ArrowFunctionExpression ||
      parent.type === AST_NODE_TYPES.FunctionExpression) &&
    isIterationMethodCallback(parent)
  ) {
    return parent.body;
  }

  // NOTE: Stop at non-constructor method definitions
  if (parent.type === AST_NODE_TYPES.MethodDefinition && parent.kind !== "constructor") {
    return null;
  }

  return findEnclosingLoopBody(parent);
};

/**
 * Check whether an arrow function or function expression is a callback of an iteration method
 */
const isIterationMethodCallback = (
  node: ESTree.ArrowFunctionExpression | ESTree.FunctionExpression,
): boolean => {
  const parent = node.parent;
  if (parent?.type !== AST_NODE_TYPES.CallExpression) return false;

  const callee = parent.callee;
  if (callee.type !== AST_NODE_TYPES.MemberExpression) return false;

  if (callee.property.type !== AST_NODE_TYPES.Identifier) return false;

  return ITERATION_METHODS.has(callee.property.name);
};
