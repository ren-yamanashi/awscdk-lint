import type { ESTree } from "@oxlint/plugins";

import { findChildNodes } from "../../../core/ast-node/finder/child-nodes";
import { INodeVisitor } from "./interface/node-visitor";

export const traverseNodes = (node: ESTree.Node, visitor: INodeVisitor): void => {
  switch (node.type) {
    case "MemberExpression": {
      visitor.visitMemberExpression?.(node);
      break;
    }
    case "VariableDeclarator": {
      visitor.visitVariableDeclarator?.(node);
      break;
    }
    case "AssignmentExpression": {
      visitor.visitAssignmentExpression?.(node);
      break;
    }
    case "Identifier": {
      visitor.visitIdentifier?.(node);
      break;
    }
    case "CallExpression": {
      visitor.visitCallExpression?.(node);
      break;
    }
  }

  // NOTE: Recursively visit child nodes
  for (const child of findChildNodes(node)) {
    traverseNodes(child, visitor);
  }
};
