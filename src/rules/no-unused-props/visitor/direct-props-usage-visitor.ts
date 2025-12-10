import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

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
    private readonly propsParamName: string
  ) {}

  visitMemberExpression(node: TSESTree.MemberExpression): void {
    this.tracker.markAsUsedForMemberExpression(node, this.propsParamName);
  }

  visitVariableDeclarator(node: TSESTree.VariableDeclarator): void {
    this.tracker.markAsUsedForVariableDeclarator(node, this.propsParamName);
  }

  visitAssignmentExpression(node: TSESTree.AssignmentExpression): void {
    this.tracker.markAsUsedForAssignmentExpression(node, this.propsParamName);
  }

  visitIdentifier(node: TSESTree.Identifier): void {
    /**
     * Handles cases where the props identifier is used as a whole value.
     *
     * This method detects when `props` (or the configured propsParamName) is used
     * in contexts where all properties should be marked as used, because we cannot
     * statically determine which properties will be accessed at runtime.
     *
     * Handled patterns:
     *
     * 1. **External function call** (`someFunction(props)` or `console.log(props)`):
     *    - Marks ALL properties as used
     *    - Excludes `this.method(props)` which is handled by analyzePrivateMethodsCalledFromConstructor
     *
     *    AST structure:
     *      CallExpression
     *      ├── callee: Identifier (someFunction) or MemberExpression (console.log)
     *      └── arguments: [Identifier (name: "props")]
     *
     * 2. **Return statement** (`return props`):
     *    - Marks ALL properties as used
     *
     *    AST structure:
     *      ReturnStatement
     *      └── argument: Identifier (name: "props")
     *
     * 3. **Array element** (`[props]` or `[a, props, b]`):
     *    - Marks ALL properties as used
     *
     *    AST structure:
     *      ArrayExpression
     *      └── elements: [..., Identifier (name: "props"), ...]
     *
     * 4. **Object property value** (`{ key: props }`):
     *    - Marks ALL properties as used
     *
     *    AST structure:
     *      Property
     *      ├── key: Identifier (name: "key")
     *      └── value: Identifier (name: "props")
     *
     * The following cases are intentionally excluded (handled elsewhere):
     * - `props.xxx` (MemberExpression) - handled by visitMemberExpression
     * - `const { xxx } = props` (VariableDeclarator with ObjectPattern) - handled by visitVariableDeclarator
     * - `this.xxx = props.xxx` (AssignmentExpression) - handled by visitAssignmentExpression
     * - `this.method(props)` (CallExpression with ThisExpression callee) - handled by analyzePrivateMethodsCalledFromConstructor
     * - `const a = props` (alias registration) - handled by PropsAliasVisitor
     */

    // NOTE: Check if props object is used as a whole (e.g., console.log(props))
    if (node.name !== this.propsParamName) return;

    const parent = node.parent;
    if (!parent) return;

    switch (parent.type) {
      // NOTE: Pattern 1: External function call
      case AST_NODE_TYPES.CallExpression: {
        if (!parent.arguments.includes(node)) return;
        if (
          parent.callee.type === AST_NODE_TYPES.MemberExpression &&
          parent.callee.object.type === AST_NODE_TYPES.ThisExpression
        ) {
          return;
        }
        this.tracker.markAllAsUsed();
        return;
      }

      // NOTE: Pattern 2: Return statement
      case AST_NODE_TYPES.ReturnStatement: {
        // NOTE: return props - props as a whole
        if (parent.argument === node) {
          this.tracker.markAllAsUsed();
        }
        return;
      }

      // NOTE: Pattern 3: Array element
      case AST_NODE_TYPES.ArrayExpression: {
        // NOTE: [props] - props as a whole
        if (parent.elements.includes(node)) {
          this.tracker.markAllAsUsed();
        }
        return;
      }

      // NOTE: Pattern 4: Object property value
      case AST_NODE_TYPES.Property: {
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
