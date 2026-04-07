import { IPropsUsageTracker } from "../props-usage-tracker";
import { INodeVisitor } from "./interface/node-visitor";

/**
 * Visitor that tracks props usage through instance variables.
 *
 * When props is assigned to an instance variable (e.g., `this.myProps = props`),
 * this visitor tracks property access on that instance variable throughout the class.
 *
 * Handles two patterns:
 * 1. Property access: `this.myProps.bucketName` - marks specific property as used
 * 2. Whole object usage: `console.log(this.myProps)` - marks all properties as used
 *
 * @example
 * ```typescript
 * class MyConstruct extends Construct {
 *   private myProps: MyConstructProps;
 *
 *   constructor(scope: Construct, id: string, props: MyConstructProps) {
 *     super(scope, id);
 *     this.myProps = props;
 *   }
 *
 *   someMethod() {
 *     console.log(this.myProps.bucketName);  // <- 'bucketName' is marked as used
 *   }
 * }
 * ```
 */
export class InstanceVariableUsageVisitor implements INodeVisitor {
  constructor(
    private readonly tracker: IPropsUsageTracker,
    private readonly instanceVarName: string,
  ) {}

  visitMemberExpression(node: any): void {
    // ===========================================================================
    // Pattern 1: Property access - this.instanceVarName.propertyName
    // ===========================================================================
    if (
      node.type === "MemberExpression" &&
      node.object.type === "MemberExpression" &&
      node.object.object.type === "ThisExpression" &&
      node.object.property.type === "Identifier" &&
      node.object.property.name === this.instanceVarName &&
      node.property.type === "Identifier"
    ) {
      this.tracker.markAsUsed(node.property.name);
      return;
    }

    // ===========================================================================
    // Pattern 2: Whole object usage - this.instanceVarName used as a value
    // ===========================================================================
    if (
      node.type === "MemberExpression" &&
      node.object.type === "ThisExpression" &&
      node.property.type === "Identifier" &&
      node.property.name === this.instanceVarName
    ) {
      const parent = node.parent;

      // NOTE: Exclusion A - Skip if this is part of a property access (this.myProps.xxx)
      if (parent?.type === "MemberExpression" && parent.object === node) {
        return;
      }

      // NOTE: Exclusion B - Skip if this is the left side of an assignment (this.myProps = ...)
      if (parent?.type === "AssignmentExpression" && parent.left === node) {
        return;
      }

      // NOTE: If we reach here, `this.myProps` is used as a whole value
      this.tracker.markAllAsUsed();
      return;
    }
  }
}
