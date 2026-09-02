import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

import { findChildNodes } from "./child-nodes";
import { findConstructIdString } from "./construct-id-string";

const FUNCTION_TYPES = [
  AST_NODE_TYPES.FunctionExpression,
  AST_NODE_TYPES.FunctionDeclaration,
] as const;

const TRANSPARENT_PARENT_TYPES = [
  AST_NODE_TYPES.MethodDefinition,
  AST_NODE_TYPES.PropertyDefinition,
  AST_NODE_TYPES.CallExpression,
] as const;

/**
 * Collect the static IDs (string literals and expression-less template literals)
 * of the other `new` expressions written in the same scope as a given node.
 *
 * NOTE: The enclosing class body or function body approximates the construct
 * scope. The first argument, which carries the real scope, is not tracked, and
 * the callee type is not resolved either, so a `new` expression of an unrelated
 * class also reserves an ID.
 */
export const findSiblingConstructIdStrings = (node: TSESTree.NewExpression): string[] => {
  return collectConstructIdStrings(findScopeRoot(node), node);
};

/**
 * Check whether a node delimits the constructs created next to each other: a
 * class body, or a function that is not transparent.
 *
 * NOTE: Class member bodies, arrow functions, and function expressions passed
 * to or invoked by a call are transparent; function declarations and function
 * expressions in any other position are scope roots. A class member body is
 * transparent because everything a class creates hangs off the same `this`, so
 * a property initializer and the constructor body share one scope. A callback
 * (`items.forEach(function () { ... })`) and an IIFE are transparent because
 * they create their constructs in the scope they are written in.
 */
const isScopeRoot = (node: TSESTree.Node): boolean => {
  if (node.type === AST_NODE_TYPES.ClassBody) return true;
  if (!FUNCTION_TYPES.some((type) => type === node.type)) return false;

  const parent = node.parent;
  if (!parent) return true;
  return !TRANSPARENT_PARENT_TYPES.some((type) => type === parent.type);
};

/**
 * Find the node that delimits the constructs created next to a given node:
 * the nearest enclosing scope root, or the whole program when the node is
 * written at the top level of the file.
 */
const findScopeRoot = (node: TSESTree.Node): TSESTree.Node => {
  const parent = node.parent;
  if (!parent) return node;
  if (isScopeRoot(parent)) return parent;
  return findScopeRoot(parent);
};

/**
 * Collect the static ID of every `NewExpression` below a node, skipping the
 * target itself and never descending into a nested scope root because those
 * constructs belong to another scope.
 */
const collectConstructIdStrings = (
  node: TSESTree.Node,
  target: TSESTree.NewExpression,
): string[] => {
  const descendantIds = findChildNodes(node).flatMap((child) => {
    if (isScopeRoot(child)) return [];
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
