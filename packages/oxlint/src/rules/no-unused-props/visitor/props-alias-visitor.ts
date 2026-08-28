import type { ESTree } from "corsa-oxlint";

import { AST_NODE_TYPES } from "corsa-oxlint";

import { IPropsUsageTracker } from "../props-usage-tracker";
import { INodeVisitor } from "./interface/node-visitor";
import { isTrackedFormForBareIdentifier } from "./is-tracked-form";

/**
 * Tracks props usage through variable aliases.
 *
 * `const alias = props` registers `alias`, and the same tracked-form / whole-escape rules
 * used for `props` itself are then applied to occurrences of `alias`.
 */
export class PropsAliasVisitor implements INodeVisitor {
  private readonly aliases = new Set<string>();

  constructor(
    private readonly tracker: IPropsUsageTracker,
    private readonly propsParamName: string,
  ) {}

  visitMemberExpression(node: ESTree.MemberExpression): void {
    this.tracker.markAsUsedForMemberExpression(node, this.propsParamName);
    if (node.object.type === AST_NODE_TYPES.Identifier && this.aliases.has(node.object.name)) {
      this.tracker.markAsUsedForMemberExpression(node, node.object.name);
    }
  }

  visitVariableDeclarator(node: ESTree.VariableDeclarator): void {
    if (node.init?.type !== AST_NODE_TYPES.Identifier) return;
    if (this.aliases.has(node.init.name)) {
      this.tracker.markAsUsedForVariableDeclarator(node, node.init.name);
    }
  }

  visitIdentifier(node: ESTree.Identifier): void {
    if (node.name === this.propsParamName) {
      this.registerAliasIfDeclaration(node);
      return;
    }
    if (!this.aliases.has(node.name)) return;
    if (isTrackedFormForBareIdentifier(node)) return;
    this.tracker.markAllAsUsed();
  }

  private registerAliasIfDeclaration(node: ESTree.Identifier): void {
    const parent = node.parent;
    if (
      parent?.type === AST_NODE_TYPES.VariableDeclarator &&
      parent.init === node &&
      parent.id.type === AST_NODE_TYPES.Identifier
    ) {
      this.aliases.add(parent.id.name);
    }
  }
}
