import { IPropsUsageTracker } from "../props-usage-tracker";
import { INodeVisitor } from "./interface/node-visitor";

/**
 * Visitor that tracks direct usage of the props parameter.
 *
 * This visitor detects various patterns where props is accessed directly:
 * - `props.bucketName` - Property access
 * - `const { bucketName } = props` - Destructuring assignment
 * - `this.bucketName = props.bucketName` - Assignment expression
 * - `console.log(props)` - Whole object usage (marks all properties as used)
 *
 * @example
 * ```typescript
 * constructor(scope: Construct, id: string, props: MyConstructProps) {
 *   super(scope, id);
 *   const name = props.bucketName;           // <- Detected by visitMemberExpression
 *   const { enableVersioning } = props;      // <- Detected by visitVariableDeclarator
 *   this.name = props.bucketName;            // <- Detected by visitAssignmentExpression
 *   console.log(props);                      // <- Detected by visitIdentifier (marks all)
 * }
 * ```
 */
export class DirectPropsUsageVisitor implements INodeVisitor {
  constructor(
    private readonly tracker: IPropsUsageTracker,
    private readonly propsParamName: string,
  ) {}

  visitMemberExpression(node: any): void {
    this.tracker.markAsUsedForMemberExpression(node, this.propsParamName);
  }

  visitVariableDeclarator(node: any): void {
    this.tracker.markAsUsedForVariableDeclarator(node, this.propsParamName);
  }

  visitAssignmentExpression(node: any): void {
    this.tracker.markAsUsedForAssignmentExpression(node, this.propsParamName);
  }

  visitIdentifier(node: any): void {
    // NOTE: Check if props object is used as a whole (e.g., console.log(props))
    if (node.name !== this.propsParamName) return;

    const parent = node.parent;
    if (!parent) return;

    switch (parent.type) {
      // NOTE: Pattern 1: External function call
      case "CallExpression": {
        if (!parent.arguments.includes(node)) return;
        if (
          parent.callee.type === "MemberExpression" &&
          parent.callee.object.type === "ThisExpression"
        ) {
          return;
        }
        this.tracker.markAllAsUsed();
        return;
      }

      // NOTE: Pattern 2: Return statement
      case "ReturnStatement": {
        // NOTE: return props - props as a whole
        if (parent.argument === node) {
          this.tracker.markAllAsUsed();
        }
        return;
      }

      // NOTE: Pattern 3: Array element
      case "ArrayExpression": {
        // NOTE: [props] - props as a whole
        if (parent.elements.includes(node)) {
          this.tracker.markAllAsUsed();
        }
        return;
      }

      // NOTE: Pattern 4: Object property value
      case "Property": {
        // NOTE: { key: props } - props as a whole
        if (parent.value === node) {
          this.tracker.markAllAsUsed();
        }
        return;
      }
      default: {
        return;
      }
    }
  }
}
