import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

import { IPropsUsageTracker } from "./props-usage-tracker";
import {
  DirectPropsUsageVisitor,
  InstanceVariableUsageVisitor,
  MethodCallCollectorVisitor,
  PropsAliasVisitor,
  traverseNodes,
} from "./visitor";

export interface IPropsUsageAnalyzer {
  analyze(
    constructor: TSESTree.MethodDefinition,
    propsParamName: string,
    options?: AnalyzeOptions,
  ): void;
}

export interface AnalyzeOptions {
  /**
   * When true, `this.<propsParamName>` is treated as a props instance variable in addition to
   * regular usage tracking. This is used for parameter property forms where the constructor
   * parameter `props` is also auto-assigned to `this.props` by TypeScript.
   */
  treatAsInstanceVariable?: boolean;
}

type InstanceVarBinding = {
  name: string;
  isPrivateField: boolean;
};

export class PropsUsageAnalyzer implements IPropsUsageAnalyzer {
  private readonly tracker: IPropsUsageTracker;

  constructor(tracker: IPropsUsageTracker) {
    this.tracker = tracker;
  }

  analyze(
    constructor: TSESTree.MethodDefinition,
    propsParamName: string,
    options: AnalyzeOptions = {},
  ): void {
    const constructorBody = constructor.value.body;
    const classNode = constructor.parent;
    if (!constructorBody) return;

    this.analyzeBlockForBinding(constructorBody, propsParamName);
    this.checkUsageForInstanceVariable(classNode, constructorBody, propsParamName);
    this.analyzeTransitiveMethodCalls(constructorBody, classNode, propsParamName, new Set());
    if (options.treatAsInstanceVariable) {
      const visitor = new InstanceVariableUsageVisitor(this.tracker, propsParamName);
      traverseNodes(classNode, visitor);
    }
  }

  /**
   * Runs the direct-usage and alias visitors over a block (constructor body or a method body
   * reached transitively via `this.method(props)`).
   */
  private analyzeBlockForBinding(block: TSESTree.BlockStatement, paramName: string): void {
    const directVisitor = new DirectPropsUsageVisitor(this.tracker, paramName);
    traverseNodes(block, directVisitor);

    const aliasVisitor = new PropsAliasVisitor(this.tracker, paramName);
    traverseNodes(block, aliasVisitor);
  }

  /**
   * Tracks `this.<field> = props` bindings and scans the whole class for reads of that field.
   * Handles both `Identifier` (`this.myProps`) and `PrivateIdentifier` (`this.#myProps`).
   */
  private checkUsageForInstanceVariable(
    classBody: TSESTree.ClassBody,
    constructorBody: TSESTree.BlockStatement,
    propsParamName: string,
  ): void {
    const binding = this.findPropsInstanceVariable(constructorBody, propsParamName);
    if (!binding) return;

    const visitor = new InstanceVariableUsageVisitor(
      this.tracker,
      binding.name,
      binding.isPrivateField,
    );
    traverseNodes(classBody, visitor);
  }

  /**
   * Follows `this.method(props)` chains from the constructor into method bodies (and further
   * into any methods those bodies call). A visited set keyed by MethodDefinition node prevents
   * infinite loops on recursive methods.
   */
  private analyzeTransitiveMethodCalls(
    body: TSESTree.BlockStatement,
    classBody: TSESTree.ClassBody,
    paramName: string,
    visited: Set<TSESTree.MethodDefinition>,
  ): void {
    const methodCalls = this.collectMethodCallsWithProps(body, paramName);

    for (const { methodName, propsArgIndices } of methodCalls) {
      const methodDef = this.findMethodDefinition(classBody, methodName);
      if (!methodDef?.value.body) continue;
      if (visited.has(methodDef)) continue;
      visited.add(methodDef);

      for (const argIndex of propsArgIndices) {
        const param = methodDef.value.params[argIndex];
        if (param?.type !== AST_NODE_TYPES.Identifier) continue;
        this.analyzeBlockForBinding(methodDef.value.body, param.name);
        this.analyzeTransitiveMethodCalls(methodDef.value.body, classBody, param.name, visited);
      }
    }
  }

  private collectMethodCallsWithProps(
    body: TSESTree.BlockStatement,
    propsParamName: string,
  ): { methodName: string; propsArgIndices: number[] }[] {
    const visitor = new MethodCallCollectorVisitor(propsParamName);
    traverseNodes(body, visitor);
    return visitor.result;
  }

  /**
   * Detects `this.<name> = props` or `this.#<name> = props` in the constructor's top-level
   * statements. Returns the field's name and whether it is a `#`-prefixed private field.
   */
  private findPropsInstanceVariable(
    body: TSESTree.BlockStatement,
    propsParamName: string,
  ): InstanceVarBinding | null {
    for (const statement of body.body) {
      if (statement.type !== AST_NODE_TYPES.ExpressionStatement) continue;
      const expression = statement.expression;
      if (expression.type !== AST_NODE_TYPES.AssignmentExpression) continue;
      if (
        expression.right.type !== AST_NODE_TYPES.Identifier ||
        expression.right.name !== propsParamName
      ) {
        continue;
      }
      const left = expression.left;
      if (left.type !== AST_NODE_TYPES.MemberExpression) continue;
      if (left.object.type !== AST_NODE_TYPES.ThisExpression) continue;
      if (left.property.type === AST_NODE_TYPES.Identifier) {
        return { name: left.property.name, isPrivateField: false };
      }
      if (left.property.type === AST_NODE_TYPES.PrivateIdentifier) {
        return { name: left.property.name, isPrivateField: true };
      }
    }
    return null;
  }

  private findMethodDefinition(
    classBody: TSESTree.ClassBody,
    methodName: string,
  ): TSESTree.MethodDefinition | null {
    for (const member of classBody.body) {
      if (
        member.type === AST_NODE_TYPES.MethodDefinition &&
        member.key.type === AST_NODE_TYPES.Identifier &&
        member.key.name === methodName
      ) {
        return member;
      }
    }
    return null;
  }
}
