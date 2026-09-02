import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

/**
 * Check whether a variable of a given name is declared by a VariableDeclaration in one of
 * the block statements enclosing a node, searching up to a given ancestor (inclusive).
 * @param name The variable name to look for
 * @param node The node to start searching from
 * @param ancestor The node at which the search stops
 * @returns true if an enclosing block declares the variable
 */
export const isDeclaredInEnclosingBlocks = (
  name: string,
  node: TSESTree.Node,
  ancestor: TSESTree.Node,
): boolean => {
  if (declaresVariableName(node, name)) return true;
  if (node === ancestor || !node.parent) return false;
  return isDeclaredInEnclosingBlocks(name, node.parent, ancestor);
};

/**
 * Check whether a block statement declares a variable with the given name
 */
const declaresVariableName = (node: TSESTree.Node, name: string): boolean => {
  if (node.type !== AST_NODE_TYPES.BlockStatement) return false;

  return node.body.some(
    (statement) =>
      statement.type === AST_NODE_TYPES.VariableDeclaration &&
      statement.declarations.some(
        (declarator) =>
          declarator.id.type === AST_NODE_TYPES.Identifier && declarator.id.name === name,
      ),
  );
};
