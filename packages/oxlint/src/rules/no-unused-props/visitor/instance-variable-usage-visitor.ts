import type { ESTree } from "corsa-oxlint";

import { AST_NODE_TYPES } from "corsa-oxlint";

import { IPropsUsageTracker } from "../props-usage-tracker";
import { INodeVisitor } from "./interface/node-visitor";

/**
 * Tracks props usage through an instance field (`this.myProps` or `this.#myProps`) that
 * mirrors the props parameter.
 */
export class InstanceVariableUsageVisitor implements INodeVisitor {
  constructor(
    private readonly tracker: IPropsUsageTracker,
    private readonly instanceVarName: string,
    private readonly isPrivateField: boolean = false,
  ) {}

  visitMemberExpression(node: ESTree.MemberExpression): void {
    if (
      node.object.type === AST_NODE_TYPES.MemberExpression &&
      this.isMatchingThisMember(node.object)
    ) {
      this.markProperty(node);
      return;
    }

    if (this.isMatchingThisMember(node)) {
      const parent = node.parent;
      if (parent?.type === AST_NODE_TYPES.MemberExpression && parent.object === node) return;
      if (parent?.type === AST_NODE_TYPES.AssignmentExpression && parent.left === node) return;
      this.tracker.markAllAsUsed();
    }
  }

  private isMatchingThisMember(node: ESTree.MemberExpression): boolean {
    if (node.object.type !== AST_NODE_TYPES.ThisExpression) return false;
    const property = node.property;
    if (this.isPrivateField) {
      return (
        property.type === AST_NODE_TYPES.PrivateIdentifier && property.name === this.instanceVarName
      );
    }
    return property.type === AST_NODE_TYPES.Identifier && property.name === this.instanceVarName;
  }

  private markProperty(node: ESTree.MemberExpression): void {
    const property = node.property;
    if (!node.computed && property.type === AST_NODE_TYPES.Identifier) {
      this.tracker.markAsUsed(property.name);
      return;
    }
    if (
      node.computed &&
      property.type === AST_NODE_TYPES.Literal &&
      typeof property.value === "string"
    ) {
      this.tracker.markAsUsed(property.value);
      return;
    }
    this.tracker.markAllAsUsed();
  }
}
