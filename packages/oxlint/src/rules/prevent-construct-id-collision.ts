import type { ESTree } from "corsa-oxlint";

import { AST_NODE_TYPES, ESLintUtils } from "corsa-oxlint";

import { isConstructType } from "../core/cdk-construct/type-checker/is-construct";
import { findConstructorPropertyNames } from "../core/ts-type/finder/constructor-property-name";
import { createRule } from "../shared/create-rule";

/**
 * Prevent Construct ID collisions inside loops.
 * Reports when a literal ID is used for a Construct instantiated inside a loop.
 */
export const preventConstructIdCollision = createRule({
  name: "prevent-construct-id-collision",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow using literal Construct IDs inside loops, which may cause ID collisions.",
      requiresTypeChecking: true,
    },
    messages: {
      preventConstructIdCollision:
        "Construct ID '{{ constructId }}' is a literal value inside a loop. This may cause ID collisions. Use a variable that changes per iteration instead.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const parserServices = ESLintUtils.getParserServices(context);
    const checker = parserServices.program.getTypeChecker();
    return {
      NewExpression(node) {
        const type = parserServices.getTypeAtLocation(node);

        if (!isConstructType(type, checker) || node.arguments.length < 2) return;

        const calleeType = parserServices.getTypeAtLocation(node.callee);
        const constructorPropertyNames = findConstructorPropertyNames(calleeType, checker);
        if (constructorPropertyNames[1] !== "id") return;

        validateConstructIdInLoop(node, context);
      },
    };
  },
});

/**
 * Validate whether a Construct ID is a literal inside a loop
 */
const validateConstructIdInLoop = (
  node: ESTree.NewExpression,
  context: Parameters<typeof preventConstructIdCollision.create>[0],
) => {
  if (!isInsideLoop(node)) return;

  const secondArg = node.arguments[1];

  // NOTE: String literals may cause ID collisions
  if (secondArg.type === AST_NODE_TYPES.Literal && typeof secondArg.value === "string") {
    context.report({
      node: secondArg,
      messageId: "preventConstructIdCollision",
      data: { constructId: secondArg.value },
    });
    return;
  }

  // NOTE: Template literals without expressions are also static values
  if (secondArg.type === AST_NODE_TYPES.TemplateLiteral && !secondArg.expressions.length) {
    const constructId = secondArg.quasis.map((q) => q.value.raw).join("");
    context.report({
      node: secondArg,
      messageId: "preventConstructIdCollision",
      data: { constructId },
    });
    return;
  }
};

/**
 * Check whether a node is inside a loop.
 * Detects for, for...in, for...of, while, do...while statements,
 * and callbacks of iteration methods (forEach, map, etc.)
 */
const isInsideLoop = (node: ESTree.Node): boolean => {
  let current = node.parent;
  while (current) {
    if (
      current.type === AST_NODE_TYPES.ForStatement ||
      current.type === AST_NODE_TYPES.ForInStatement ||
      current.type === AST_NODE_TYPES.ForOfStatement ||
      current.type === AST_NODE_TYPES.WhileStatement ||
      current.type === AST_NODE_TYPES.DoWhileStatement
    ) {
      return true;
    }

    if (
      (current.type === AST_NODE_TYPES.ArrowFunctionExpression ||
        current.type === AST_NODE_TYPES.FunctionExpression) &&
      isIterationMethodCallback(current)
    ) {
      return true;
    }

    if (current.type === AST_NODE_TYPES.MethodDefinition && current.kind !== "constructor") {
      return false;
    }

    current = current.parent;
  }
  return false;
};

const ITERATION_METHODS = new Set([
  "forEach",
  "map",
  "flatMap",
  "filter",
  "reduce",
  "reduceRight",
  "every",
  "some",
  "find",
  "findIndex",
  "findLast",
  "findLastIndex",
]);

/**
 * Check whether an arrow function or function expression is a callback of an iteration method
 */
const isIterationMethodCallback = (
  node: ESTree.ArrowFunctionExpression | ESTree.FunctionExpression,
): boolean => {
  const parent = node.parent;
  if (parent?.type !== AST_NODE_TYPES.CallExpression) return false;

  const callee = parent.callee;
  if (callee.type !== AST_NODE_TYPES.MemberExpression) return false;

  if (callee.property.type !== AST_NODE_TYPES.Identifier) return false;

  return ITERATION_METHODS.has(callee.property.name);
};
