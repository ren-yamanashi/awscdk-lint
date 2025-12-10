import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

import { INodeVisitor } from "./interface/node-visitor";

type MethodCallInfo = {
  methodName: string;
  propsArgIndices: number[];
};

/**
 * Visitor that collects method calls where props is passed as an argument.
 *
 * This visitor detects patterns like:
 * - `this.someMethod(props)`
 * - `this.someMethod(a, props, b)` (props at any position)
 *
 * AST structure for `this.someMethod(props)`:
 *   CallExpression
 *   ├── callee: MemberExpression
 *   │   ├── object: ThisExpression
 *   │   └── property: Identifier (name: "someMethod")
 *   └── arguments: [Identifier (name: "props")]
 *
 * The collected information is used by analyzePrivateMethodsCalledFromConstructor
 * to analyze the method bodies and track props usage within them.
 */
export class MethodCallCollectorVisitor implements INodeVisitor {
  private readonly _result: MethodCallInfo[] = [];

  constructor(private readonly propsParamName: string) {}

  visitCallExpression(node: TSESTree.CallExpression): void {
    // NOTE: Check for this.methodName(...) pattern
    if (
      node.callee.type !== AST_NODE_TYPES.MemberExpression ||
      node.callee.object.type !== AST_NODE_TYPES.ThisExpression ||
      node.callee.property.type !== AST_NODE_TYPES.Identifier
    ) {
      return;
    }

    const methodName = node.callee.property.name;
    const propsArgIndices = node.arguments.reduce<number[]>(
      (acc, arg, index) =>
        arg.type === AST_NODE_TYPES.Identifier &&
        arg.name === this.propsParamName
          ? [...acc, index]
          : acc,
      []
    );

    if (propsArgIndices.length) {
      this._result.push({ methodName, propsArgIndices });
    }
  }

  get result(): MethodCallInfo[] {
    return this._result;
  }
}
