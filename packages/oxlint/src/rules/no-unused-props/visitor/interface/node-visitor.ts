import type { ESTree } from "corsa-oxlint";

export interface INodeVisitor {
  visitMemberExpression?(node: ESTree.MemberExpression): void;
  visitVariableDeclarator?(node: ESTree.VariableDeclarator): void;
  visitAssignmentExpression?(node: ESTree.AssignmentExpression): void;
  visitIdentifier?(node: ESTree.BindingIdentifier): void;
  visitCallExpression?(node: ESTree.CallExpression): void;
}
