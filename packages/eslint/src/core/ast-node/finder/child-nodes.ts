import { TSESTree } from "@typescript-eslint/utils";

/**
 * find child nodes from a TSESTree.Node
 */
export const findChildNodes = (node: TSESTree.Node): TSESTree.Node[] => {
  return Object.entries(node).reduce<TSESTree.Node[]>((acc, [key, value]) => {
    if (["parent", "range", "loc"].includes(key)) return acc; // Keys to skip to avoid circular references and unnecessary properties
    if (isESTreeNode(value)) return [...acc, value];
    if (Array.isArray(value)) return [...acc, ...value.filter(isESTreeNode)];
    return acc;
  }, []);
};

/**
 * Type guard to check if a value is a TSESTree.Node
 */
const isESTreeNode = (value: unknown): value is TSESTree.Node => {
  return (
    value !== null &&
    typeof value === "object" &&
    "type" in value &&
    typeof (value as { type: unknown }).type === "string"
  );
};
