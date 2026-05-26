import type { ESTree } from "@oxlint/plugins";

export interface INodeVisitor {
  visitMemberExpression?(node: ESTree.MemberExpression): void;
  visitVariableDeclarator?(node: ESTree.VariableDeclarator): void;
  visitAssignmentExpression?(node: ESTree.AssignmentExpression): void;
  visitIdentifier?(node: Extract<ESTree.Node, { type: "Identifier" }>): void;
  visitCallExpression?(node: ESTree.CallExpression): void;
}
