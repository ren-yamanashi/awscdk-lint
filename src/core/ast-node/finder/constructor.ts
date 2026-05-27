import type { ESTree } from "@oxlint/plugins";

/**
 * Finds the constructor method in a class declaration
 * @param node node The class declaration
 * @returns The constructor method definition or undefined if not found
 */
export const findConstructor = (node: ESTree.Class): ESTree.MethodDefinition | undefined => {
  return node.body.body.find(
    (member): member is ESTree.MethodDefinition =>
      member.type === "MethodDefinition" && member.kind === "constructor",
  );
};
