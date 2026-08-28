import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

/**
 * Find the nearest enclosing function/method for a node.
 * Returns the first ancestor that introduces a new function scope.
 */
const findEnclosingFunction = (
  node: TSESTree.Node,
):
  | TSESTree.FunctionExpression
  | TSESTree.FunctionDeclaration
  | TSESTree.ArrowFunctionExpression
  | undefined => {
  const parent = node.parent;
  if (!parent) return undefined;
  if (
    parent.type === AST_NODE_TYPES.FunctionExpression ||
    parent.type === AST_NODE_TYPES.FunctionDeclaration ||
    parent.type === AST_NODE_TYPES.ArrowFunctionExpression
  ) {
    return parent;
  }
  return findEnclosingFunction(parent);
};

/**
 * Return true when the node is inside a class constructor or regular method body,
 * without crossing any other function boundary first.
 */
export const isInsideConstructorOrMethod = (node: TSESTree.Node): boolean => {
  const fn = findEnclosingFunction(node);
  if (!fn) return false;
  const owner = fn.parent;
  return (
    fn.type === AST_NODE_TYPES.FunctionExpression &&
    owner?.type === AST_NODE_TYPES.MethodDefinition &&
    (owner.kind === "constructor" || owner.kind === "method")
  );
};
