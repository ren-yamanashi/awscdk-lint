import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

import { findChildNodes } from "../../../core/ast-node/finder/child-nodes";

import { INodeVisitor } from "./interface/node-visitor";

export const traverseNodes = (
  node: TSESTree.Node,
  visitor: INodeVisitor
): void => {
  switch (node.type) {
    case AST_NODE_TYPES.MemberExpression: {
      visitor.visitMemberExpression?.(node);
      break;
    }
    case AST_NODE_TYPES.VariableDeclarator: {
      visitor.visitVariableDeclarator?.(node);
      break;
    }
    case AST_NODE_TYPES.AssignmentExpression: {
      visitor.visitAssignmentExpression?.(node);
      break;
    }
    case AST_NODE_TYPES.Identifier: {
      visitor.visitIdentifier?.(node);
      break;
    }
    case AST_NODE_TYPES.CallExpression: {
      visitor.visitCallExpression?.(node);
      break;
    }
  }

  // NOTE: Recursively visit child nodes
  for (const child of findChildNodes(node)) {
    traverseNodes(child, visitor);
  }
};
