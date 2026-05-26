import type { ESTree } from "@oxlint/plugins";

/**
 * find child nodes from an ESTree.Node
 */
export const findChildNodes = (node: ESTree.Node): ESTree.Node[] => {
  return Object.entries(node).reduce<ESTree.Node[]>((acc, [key, value]) => {
    if (["parent", "range", "loc"].includes(key)) return acc; // Keys to skip to avoid circular references and unnecessary properties
    if (isESTreeNode(value)) return [...acc, value];
    if (Array.isArray(value)) return [...acc, ...value.filter(isESTreeNode)];
    return acc;
  }, []);
};

/**
 * Type guard to check if a value is an ESTree.Node
 */
const isESTreeNode = (value: unknown): value is ESTree.Node => {
  return (
    value !== null &&
    typeof value === "object" &&
    "type" in value &&
    typeof (value as { type: unknown }).type === "string"
  );
};
