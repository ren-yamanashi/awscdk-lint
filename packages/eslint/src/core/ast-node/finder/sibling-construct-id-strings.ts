import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

import { findChildNodes } from "./child-nodes";
import { findConstructIdString } from "./construct-id-string";

const FUNCTION_TYPES = [
  AST_NODE_TYPES.FunctionExpression,
  AST_NODE_TYPES.FunctionDeclaration,
  AST_NODE_TYPES.ArrowFunctionExpression,
] as const;

/**
 * Collect the static construct IDs (string literals and expression-less template
 * literals) of the other constructs created in the same body as a given node.
 *
 * NOTE: The enclosing function body approximates the construct scope. The first
 * argument, which carries the real scope, is not tracked.
 */
export const findSiblingConstructIdStrings = (node: TSESTree.NewExpression): string[] => {
  return collectConstructIdStrings(findScopeRoot(node), node);
};

const isFunctionNode = (node: TSESTree.Node): boolean => {
  return FUNCTION_TYPES.some((type) => type === node.type);
};

/**
 * Find the node that delimits the constructs created next to a given node:
 * the nearest enclosing function body, or the whole program when the node is
 * written at the top level of the file.
 */
const findScopeRoot = (node: TSESTree.Node): TSESTree.Node => {
  const parent = node.parent;
  if (!parent) return node;
  if (isFunctionNode(parent)) return parent;
  return findScopeRoot(parent);
};

/**
 * Collect the static ID of every `NewExpression` below a node, skipping the
 * target itself and never descending into a nested function body because those
 * constructs belong to another scope root.
 */
const collectConstructIdStrings = (
  node: TSESTree.Node,
  target: TSESTree.NewExpression,
): string[] => {
  const descendantIds = findChildNodes(node).flatMap((child) => {
    if (isFunctionNode(child)) return [];
    return collectConstructIdStrings(child, target);
  });

  const ownId = (() => {
    if (node === target) return null;
    if (node.type !== AST_NODE_TYPES.NewExpression || node.arguments.length < 2) return null;
    // NOTE: Treat the second argument as ID
    return findConstructIdString(node.arguments[1]);
  })();

  return ownId === null ? descendantIds : [ownId, ...descendantIds];
};
