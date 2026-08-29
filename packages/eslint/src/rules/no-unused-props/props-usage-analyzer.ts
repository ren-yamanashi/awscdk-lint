import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

import { IPropsUsageTracker } from "./props-usage-tracker";
import {
  DirectPropsUsageVisitor,
  InstanceVariableUsageVisitor,
  MethodCallCollectorVisitor,
  PropsAliasVisitor,
  traverseNodes,
} from "./visitor";
import { INodeVisitor } from "./visitor/interface/node-visitor";

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
   * Collects every `this.<field> = <paramName>` binding reachable inside `block` — including
   * nested (`if (c) { this.a = props }`) and multiple assignments — then scans the whole class
   * body for reads of each captured field. Both `Identifier` (`this.myProps`) and
   * `PrivateIdentifier` (`this.#myProps`) targets are supported.
   */
  private checkUsageForInstanceVariable(
    classBody: TSESTree.ClassBody,
    block: TSESTree.BlockStatement,
    paramName: string,
  ): void {
    const bindings = findPropsInstanceVariableBindings(block, paramName);
    for (const binding of bindings) {
      const visitor = new InstanceVariableUsageVisitor(
        this.tracker,
        binding.name,
        binding.isPrivateField,
      );
      traverseNodes(classBody, visitor);
    }
  }

  /**
   * Follows `this.method(props)` chains from the constructor into method bodies (and further
   * into any methods those bodies call). `visited` is keyed by `${methodName}:${argIndex}` so
   * the same method can still be analyzed for a different argument position, while recursion on
   * the exact same method + arg-position is short-circuited.
   *
   * If a call cannot be tracked (target method missing, body-less, or the param at the props
   * argument index is not a plain Identifier), the props object is treated as escaped and every
   * property is marked used — otherwise `isTrackedFormForBareIdentifier` would have suppressed
   * the escape mark without any per-property tracking taking its place.
   */
  private analyzeTransitiveMethodCalls(
    body: TSESTree.BlockStatement,
    classBody: TSESTree.ClassBody,
    paramName: string,
    visited: Set<string>,
  ): void {
    const methodCalls = this.collectMethodCallsWithProps(body, paramName);

    for (const { methodName, propsArgIndices } of methodCalls) {
      const methodDef = this.findMethodDefinition(classBody, methodName);
      for (const argIndex of propsArgIndices) {
        const visitedKey = `${methodName}:${argIndex}`;
        if (visited.has(visitedKey)) continue;
        visited.add(visitedKey);

        const param = methodDef?.value.body ? methodDef.value.params[argIndex] : undefined;
        if (!methodDef?.value.body || param?.type !== AST_NODE_TYPES.Identifier) {
          this.tracker.markAllAsUsed();
          continue;
        }
        this.analyzeBlockForBinding(methodDef.value.body, param.name);
        this.checkUsageForInstanceVariable(classBody, methodDef.value.body, param.name);
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
   * Resolves a class method by name, skipping overload signatures (body-less
   * `TSEmptyBodyFunctionExpression` values) so the implementation is returned.
   */
  private findMethodDefinition(
    classBody: TSESTree.ClassBody,
    methodName: string,
  ): TSESTree.MethodDefinition | null {
    for (const member of classBody.body) {
      if (
        member.type === AST_NODE_TYPES.MethodDefinition &&
        member.key.type === AST_NODE_TYPES.Identifier &&
        member.key.name === methodName &&
        member.value.type !== AST_NODE_TYPES.TSEmptyBodyFunctionExpression
      ) {
        return member;
      }
    }
    return null;
  }
}

/**
 * Traversal-based collector for `this.<name> = <paramName>` / `this.#<name> = <paramName>`
 * bindings inside a block. Returns every match (nested or repeated), preserving discovery
 * order and de-duplicating on (name, isPrivateField).
 */
const findPropsInstanceVariableBindings = (
  block: TSESTree.BlockStatement,
  paramName: string,
): InstanceVarBinding[] => {
  const bindings: InstanceVarBinding[] = [];
  const seen = new Set<string>();
  const visitor: INodeVisitor = {
    visitAssignmentExpression: (node) => {
      if (node.right.type !== AST_NODE_TYPES.Identifier || node.right.name !== paramName) return;
      const left = node.left;
      if (left.type !== AST_NODE_TYPES.MemberExpression) return;
      if (left.object.type !== AST_NODE_TYPES.ThisExpression) return;
      const isPrivateField = left.property.type === AST_NODE_TYPES.PrivateIdentifier;
      if (
        left.property.type !== AST_NODE_TYPES.Identifier &&
        left.property.type !== AST_NODE_TYPES.PrivateIdentifier
      ) {
        return;
      }
      const key = `${isPrivateField ? "#" : ""}${left.property.name}`;
      if (seen.has(key)) return;
      seen.add(key);
      bindings.push({ name: left.property.name, isPrivateField });
    },
  };
  traverseNodes(block, visitor);
  return bindings;
};
