import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

import { IPropsUsageTracker } from "../props-usage-tracker";

import { INodeVisitor } from "./interface/node-visitor";

/**
 * Visitor that tracks props usage through variable aliases.
 *
 * When props is assigned to another variable (alias), this visitor:
 * 1. Registers the alias when `const myProps = props` is detected
 * 2. Tracks property access on the alias like `myProps.bucketName`
 *
 * @example
 * ```typescript
 * constructor(scope: Construct, id: string, props: MyConstructProps) {
 *   super(scope, id);
 *   const myProps = props;              // <- Alias 'myProps' is registered
 *   console.log(myProps.bucketName);    // <- 'bucketName' is marked as used
 * }
 * ```
 */
export class PropsAliasVisitor implements INodeVisitor {
  private readonly aliases = new Set<string>();

  constructor(
    private readonly tracker: IPropsUsageTracker,
    private readonly propsParamName: string
  ) {}

  visitMemberExpression(node: TSESTree.MemberExpression): void {
    this.tracker.markAsUsedForMemberExpression(node, this.propsParamName);
    /**
     * NOTE: Check if the object is an alias of props
     * ```ts
     * const myProps = props;
     * console.log(myProps.bucketName); // <- detect this access
     * ```
     */
    if (
      node.object.type === AST_NODE_TYPES.Identifier &&
      this.aliases.has(node.object.name) &&
      node.property.type === AST_NODE_TYPES.Identifier
    ) {
      this.tracker.markAsUsed(node.property.name);
    }
  }

  visitIdentifier(node: TSESTree.Identifier): void {
    /**
     * Handles alias registration for props.
     *
     * This method detects when props is assigned to a simple variable,
     * which creates an alias that should be tracked for property access.
     *
     * Handled pattern:
     *
     * **Variable assignment** (`const myProps = props`):
     *    - Registers 'myProps' as an alias of props
     *    - Later access like `myProps.bucketName` will be detected by visitMemberExpression
     *
     *    AST structure:
     *      VariableDeclarator
     *      ├── id: Identifier (name: "myProps" - the alias to register)
     *      └── init: Identifier (name: "props")
     */
    if (node.name !== this.propsParamName) return;

    const parent = node.parent;
    if (!parent) return;

    // NOTE: const myProps = props - track 'myProps' as an alias of props
    if (
      parent.type === AST_NODE_TYPES.VariableDeclarator &&
      parent.init === node &&
      parent.id.type === AST_NODE_TYPES.Identifier
    ) {
      this.aliases.add(parent.id.name);
    }
  }
}
