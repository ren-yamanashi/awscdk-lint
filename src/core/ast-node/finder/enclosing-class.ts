import { AST_NODE_TYPES, ESTree } from "corsa-oxlint";

/**
 * Find the enclosing ClassDeclaration from a given node
 * @param node The node to start searching from
 * @returns The enclosing ClassDeclaration or undefined if not found
 */
export const findEnclosingClass = (node: ESTree.Node): ESTree.ClassDeclaration | undefined => {
  if (!node.parent) return undefined;
  if (node.parent.type === AST_NODE_TYPES.ClassDeclaration) {
    // FIXME: not use `as` assertion
    return node.parent as ESTree.ClassDeclaration;
  }
  return findEnclosingClass(node.parent);
};
