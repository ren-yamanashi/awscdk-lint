import type { Context, ESTree } from "@oxlint/plugins";

import { getParserServices } from "corsa-oxlint";

import { isConstructType } from "../core/cdk-construct/type-checker/is-construct";
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
    },
    messages: {
      preventConstructIdCollision:
        "Construct ID '{{ constructId }}' is a literal value inside a loop. This may cause ID collisions. Use a variable that changes per iteration instead.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const services = getParserServices(context);
    const checker = services.program.getTypeChecker();
    return {
      NewExpression(node: ESTree.NewExpression) {
        // MEMO: tsgo returns `any` for `getTypeAtLocation` on a NewExpression, so
        // we resolve the instance type from the callee's `typeof ClassName` type.
        // Ideally we would derive it from the node directly so this also works
        // under standard TypeScript, where `getTypeAtLocation(node)` returns the
        // instance type.
        const type = checker.getTypeAtLocation(node.callee);

        if (!type || !isConstructType(type, checker) || node.arguments.length < 2) {
          return;
        }

        // FIXME: This should only validate when the construct's second constructor
        // parameter is named "id" (otherwise the 2nd argument is not an ID):
        //   const constructorParamNames = getConstructorParamNames(type, checker);
        //   if (constructorParamNames[1] !== "id") return;
        // But the type checker exposes constructor parameters only as opaque IDs
        // with no way to resolve their names, so for now we rely on the CDK
        // convention that the second parameter is always "id".

        validateConstructIdInLoop(node, context);
      },
    };
  },
});

/**
 * Validate whether a Construct ID is a literal inside a loop
 */
const validateConstructIdInLoop = (node: ESTree.NewExpression, context: Context) => {
  if (!isInsideLoop(node)) return;

  const secondArg = node.arguments[1];

  // NOTE: String literals may cause ID collisions
  if (secondArg.type === "Literal" && typeof secondArg.value === "string") {
    context.report({
      node: secondArg,
      messageId: "preventConstructIdCollision",
      data: { constructId: secondArg.value },
    });
    return;
  }

  // NOTE: Template literals without expressions are also static values
  if (secondArg.type === "TemplateLiteral" && !secondArg.expressions.length) {
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
    // NOTE: Detect loop statements
    if (
      current.type === "ForStatement" ||
      current.type === "ForInStatement" ||
      current.type === "ForOfStatement" ||
      current.type === "WhileStatement" ||
      current.type === "DoWhileStatement"
    ) {
      return true;
    }

    // NOTE: Detect iteration method callbacks (ArrowFunction/FunctionExpression)
    if (
      (current.type === "ArrowFunctionExpression" || current.type === "FunctionExpression") &&
      isIterationMethodCallback(current)
    ) {
      return true;
    }

    // NOTE: Stop at non-constructor method definitions
    if (current.type === "MethodDefinition" && current.kind !== "constructor") {
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
const isIterationMethodCallback = (node: ESTree.Node): boolean => {
  const parent = node.parent;
  if (parent?.type !== "CallExpression") return false;

  const callee = parent.callee;
  if (callee.type !== "MemberExpression") return false;

  if (callee.property.type !== "Identifier") return false;

  return ITERATION_METHODS.has(callee.property.name);
};
