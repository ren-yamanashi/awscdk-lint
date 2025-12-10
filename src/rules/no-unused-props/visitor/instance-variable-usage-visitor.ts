import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

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
    private readonly instanceVarName: string
  ) {}

  visitMemberExpression(node: TSESTree.MemberExpression): void {
    // ===========================================================================
    // Pattern 1: Property access - this.instanceVarName.propertyName
    // ===========================================================================
    // Matches code like: `console.log(this.myProps.bucketName)` or `return this.myProps.enableVersioning`
    //
    // AST structure:
    //   MemberExpression (node)
    //   ├── object: MemberExpression (this.myProps)
    //   │   ├── object: ThisExpression
    //   │   └── property: Identifier (name: "myProps" === instanceVarName)
    //   └── property: Identifier (name: "bucketName" - the property being accessed)
    //
    // When this pattern matches, we mark the accessed property (e.g., "bucketName") as used.
    if (
      node.type === AST_NODE_TYPES.MemberExpression &&
      node.object.type === AST_NODE_TYPES.MemberExpression &&
      node.object.object.type === AST_NODE_TYPES.ThisExpression &&
      node.object.property.type === AST_NODE_TYPES.Identifier &&
      node.object.property.name === this.instanceVarName &&
      node.property.type === AST_NODE_TYPES.Identifier
    ) {
      this.tracker.markAsUsed(node.property.name);
      return;
    }

    // ===========================================================================
    // Pattern 2: Whole object usage - this.instanceVarName used as a value
    // ===========================================================================
    // Matches code like: `console.log(this.myProps)` or `return this.myProps`
    //
    // AST structure:
    //   MemberExpression (node)
    //   ├── object: ThisExpression
    //   └── property: Identifier (name: "myProps" === instanceVarName)
    //
    // However, we need to exclude certain cases where `this.myProps` appears
    // but isn't actually being "used as a value":
    //
    // Exclusion A: Property access (handled by Pattern 1 above)
    //   Code: `this.myProps.bucketName`
    //   The `this.myProps` part has parent MemberExpression where it's the object
    //
    // Exclusion B: Assignment left-hand side
    //   Code: `this.myProps = props`
    //   The `this.myProps` is being assigned to, not used as a value
    if (
      node.type === AST_NODE_TYPES.MemberExpression &&
      node.object.type === AST_NODE_TYPES.ThisExpression &&
      node.property.type === AST_NODE_TYPES.Identifier &&
      node.property.name === this.instanceVarName
    ) {
      const parent = node.parent;

      // NOTE: Exclusion A - Skip if this is part of a property access (this.myProps.xxx)
      // The parent MemberExpression's object being this node means we're accessing a property
      if (
        parent?.type === AST_NODE_TYPES.MemberExpression &&
        parent.object === node
      ) {
        return;
      }

      // NOTE: Exclusion B - Skip if this is the left side of an assignment (this.myProps = ...)
      if (
        parent?.type === AST_NODE_TYPES.AssignmentExpression &&
        parent.left === node
      ) {
        return;
      }

      // NOTE: If we reach here, `this.myProps` is used as a whole value
      // Examples: console.log(this.myProps), return this.myProps, [this.myProps], etc.
      // Since we can't know which properties will be accessed at runtime, mark all as used
      this.tracker.markAllAsUsed();
      return;
    }
  }
}
