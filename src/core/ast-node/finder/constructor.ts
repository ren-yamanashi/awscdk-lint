import type { ESTree } from "@oxlint/plugins";

import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

/**
 * Finds the constructor method in a class declaration
 * @param node The class declaration
 * @returns The constructor method definition or undefined if not found
 */
export const findConstructor = (
  node: TSESTree.ClassDeclaration,
): TSESTree.MethodDefinition | undefined => {
  return node.body.body.find(
    (member): member is TSESTree.MethodDefinition =>
      member.type === AST_NODE_TYPES.MethodDefinition && member.kind === "constructor",
  );
};

/**
 * Finds the constructor method in a class declaration (oxlint version using `@oxlint/plugins` types)
 * @param node The class node provided by the oxlint visitor
 * @returns The constructor method definition or undefined if not found
 */
export const findConstructorOxlint = (node: ESTree.Class): ESTree.MethodDefinition | undefined => {
  return node.body.body.find(
    (member): member is ESTree.MethodDefinition =>
      member.type === "MethodDefinition" && member.kind === "constructor",
  );
};
