import { TSESTree } from "@typescript-eslint/utils";

export interface INodeVisitor {
  visitMemberExpression?(node: TSESTree.MemberExpression): void;
  visitVariableDeclarator?(node: TSESTree.VariableDeclarator): void;
  visitAssignmentExpression?(node: TSESTree.AssignmentExpression): void;
  visitIdentifier?(node: TSESTree.Identifier): void;
  visitCallExpression?(node: TSESTree.CallExpression): void;
}
