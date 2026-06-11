import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { ESTree } from "corsa-oxlint";

/**
 * Find the enclosing ClassDeclaration from a given node
 * @param node The node to start searching from
 * @returns The enclosing ClassDeclaration or undefined if not found
 */
export const findEnclosingClass = (node: ESTree.Node): ESTree.ClassDeclaration | undefined => {
  if (!node.parent) return undefined;
  if (node.parent.type === AST_NODE_TYPES.ClassDeclaration) {
    return node.parent as ESTree.ClassDeclaration;
  }
  return findEnclosingClass(node.parent);
};
