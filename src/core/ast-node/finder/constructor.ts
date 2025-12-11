import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

/**
 * Finds the constructor method in a class declaration
 * @param node The class declaration
 * @returns The constructor method definition or undefined if not found
 */
export const findConstructor = (
  node: TSESTree.ClassDeclaration
): TSESTree.MethodDefinition | undefined => {
  return node.body.body.find(
    (member): member is TSESTree.MethodDefinition =>
      member.type === AST_NODE_TYPES.MethodDefinition &&
      member.kind === "constructor"
  );
};
