import type { ESTree } from "corsa-oxlint";

import { AST_NODE_TYPES } from "corsa-oxlint";

import { asEstreeNode } from "../as-estree-node";

/**
 * Find the enclosing ClassDeclaration from a given node
 * @param node The node to start searching from
 * @returns The enclosing ClassDeclaration or undefined if not found
 */
export const findEnclosingClass = (node: ESTree.Node): ESTree.ClassDeclaration | undefined => {
  if (!node.parent) return undefined;
  const parent = asEstreeNode(node.parent);
  if (parent.type === AST_NODE_TYPES.ClassDeclaration) return parent;
  return findEnclosingClass(parent);
};
