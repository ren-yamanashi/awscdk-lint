export interface INodeVisitor {
  visitMemberExpression?(node: any): void;
  visitVariableDeclarator?(node: any): void;
  visitAssignmentExpression?(node: any): void;
  visitIdentifier?(node: any): void;
  visitCallExpression?(node: any): void;
}
