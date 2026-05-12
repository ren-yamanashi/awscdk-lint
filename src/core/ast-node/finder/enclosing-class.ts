import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

/**
 * Find the enclosing ClassDeclaration from a given node
 * @param node The node to start searching from
 * @returns The enclosing ClassDeclaration or undefined if not found
 */
export const findEnclosingClass = (node: TSESTree.Node): TSESTree.ClassDeclaration | undefined => {
  if (!node.parent) return undefined;
  if (node.parent.type === AST_NODE_TYPES.ClassDeclaration) return node.parent;
  return findEnclosingClass(node.parent);
};
