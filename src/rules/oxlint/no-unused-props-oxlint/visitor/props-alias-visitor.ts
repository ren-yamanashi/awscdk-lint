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
    private readonly propsParamName: string,
  ) {}

  visitMemberExpression(node: any): void {
    this.tracker.markAsUsedForMemberExpression(node, this.propsParamName);
    /**
     * NOTE: Check if the object is an alias of props
     * ```ts
     * const myProps = props;
     * console.log(myProps.bucketName); // <- detect this access
     * ```
     */
    if (
      node.object.type === "Identifier" &&
      this.aliases.has(node.object.name) &&
      node.property.type === "Identifier"
    ) {
      this.tracker.markAsUsed(node.property.name);
    }
  }

  visitIdentifier(node: any): void {
    if (node.name !== this.propsParamName) return;

    const parent = node.parent;
    if (!parent) return;

    // NOTE: const myProps = props - track 'myProps' as an alias of props
    if (
      parent.type === "VariableDeclarator" &&
      parent.init === node &&
      parent.id.type === "Identifier"
    ) {
      this.aliases.add(parent.id.name);
    }
  }
}
