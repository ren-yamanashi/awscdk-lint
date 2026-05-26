import type { ESTree } from "@oxlint/plugins";

/**
 * Find the enclosing ClassDeclaration from a given node
 * @param node The node provided by the oxlint visitor
 * @returns The enclosing ClassDeclaration or undefined if not found
 */
export const findEnclosingClass = (node: ESTree.Node): ESTree.Class | undefined => {
  const parent = node.parent;
  if (!parent) return undefined;
  if (parent.type === "ClassDeclaration") return parent;
  return findEnclosingClass(parent);
};
