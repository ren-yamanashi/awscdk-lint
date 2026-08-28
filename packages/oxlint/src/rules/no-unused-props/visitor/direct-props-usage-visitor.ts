import type { ESTree } from "corsa-oxlint";

import { IPropsUsageTracker } from "../props-usage-tracker";
import { INodeVisitor } from "./interface/node-visitor";
import { isTrackedFormForBareIdentifier } from "./is-tracked-form";

/**
 * Visitor that tracks direct usage of the props parameter.
 *
 * The per-property tracked forms are:
 * - `props.x` / `props?.x` / `props["x"]`      (MemberExpression)
 * - `const { x } = props`                       (VariableDeclarator, destructuring)
 * - `const alias = props`                       (VariableDeclarator, alias — handled by PropsAliasVisitor)
 * - `this.x = props` / `this.#x = props`        (AssignmentExpression — handled by analyzer)
 * - `this.method(props)`                        (CallExpression — handled by analyzer)
 *
 * Any other occurrence of a bare `props` identifier is treated as a whole-object escape:
 * all properties are marked as used.
 */
export class DirectPropsUsageVisitor implements INodeVisitor {
  constructor(
    private readonly tracker: IPropsUsageTracker,
    private readonly propsParamName: string,
  ) {}

  visitMemberExpression(node: ESTree.MemberExpression): void {
    this.tracker.markAsUsedForMemberExpression(node, this.propsParamName);
  }

  visitVariableDeclarator(node: ESTree.VariableDeclarator): void {
    this.tracker.markAsUsedForVariableDeclarator(node, this.propsParamName);
  }

  visitAssignmentExpression(node: ESTree.AssignmentExpression): void {
    this.tracker.markAsUsedForAssignmentExpression(node, this.propsParamName);
  }

  visitIdentifier(node: ESTree.Identifier): void {
    if (node.name !== this.propsParamName) return;
    if (isTrackedFormForBareIdentifier(node)) return;
    this.tracker.markAllAsUsed();
  }
}
