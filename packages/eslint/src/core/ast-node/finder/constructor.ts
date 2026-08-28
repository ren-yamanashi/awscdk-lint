import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

/**
 * Finds the constructor implementation in a class declaration
 *
 * When a class has overload signatures on its constructor, the class body contains
 * multiple constructor members. Only the implementation signature has a body
 * (its `value` is a `FunctionExpression`, not `TSEmptyBodyFunctionExpression`).
 * Callers of this finder always want to inspect the implementation, so overload
 * signatures are skipped.
 *
 * @param node The class declaration
 * @returns The constructor implementation or undefined if not found
 */
export const findConstructor = (
  node: TSESTree.ClassDeclaration,
): TSESTree.MethodDefinition | undefined => {
  return node.body.body.find(
    (member): member is TSESTree.MethodDefinition =>
      member.type === AST_NODE_TYPES.MethodDefinition &&
      member.kind === "constructor" &&
      member.value.type !== AST_NODE_TYPES.TSEmptyBodyFunctionExpression,
  );
};
