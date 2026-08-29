import { AST_NODE_TYPES, ESLintUtils, TSESTree } from "@typescript-eslint/utils";

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

        if (!isConstructType(type) || node.arguments.length < 2) return;

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
  node: TSESTree.NewExpression,
  context: Parameters<typeof preventConstructIdCollision.create>[0],
) => {
  const loopBody = findEnclosingLoopBody(node);
  if (!loopBody) return;

  // NOTE: A scope declared inside the loop body is re-created on every iteration,
  //       so a literal ID cannot collide within it
  if (isScopeDeclaredInLoopBody(node.arguments[0], loopBody)) return;

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
 * Find the body of the loop that encloses a node.
 * Detects for, for...in, for...of, while, do...while statements,
 * and callbacks of iteration methods (forEach, map, etc.)
 * Returns null when the node is not inside a loop.
 */
const findEnclosingLoopBody = (node: TSESTree.Node): TSESTree.Node | null => {
  const parent = node.parent;
  if (!parent) return null;

  // NOTE: Detect loop statements
  if (
    parent.type === AST_NODE_TYPES.ForStatement ||
    parent.type === AST_NODE_TYPES.ForInStatement ||
    parent.type === AST_NODE_TYPES.ForOfStatement ||
    parent.type === AST_NODE_TYPES.WhileStatement ||
    parent.type === AST_NODE_TYPES.DoWhileStatement
  ) {
    return parent.body;
  }

  // NOTE: Detect iteration method callbacks (ArrowFunction/FunctionExpression)
  if (
    (parent.type === AST_NODE_TYPES.ArrowFunctionExpression ||
      parent.type === AST_NODE_TYPES.FunctionExpression) &&
    isIterationMethodCallback(parent)
  ) {
    return parent.body;
  }

  // NOTE: Stop at non-constructor method definitions
  if (parent.type === AST_NODE_TYPES.MethodDefinition && parent.kind !== "constructor") {
    return null;
  }

  return findEnclosingLoopBody(parent);
};

/**
 * Check whether the scope argument is an identifier declared inside the loop body.
 * Only a variable declaration is treated as a per-iteration scope: any other form
 * (`this`, an outer variable, a member expression, ...) may be shared across iterations.
 */
const isScopeDeclaredInLoopBody = (
  scopeArg: TSESTree.NewExpression["arguments"][number],
  loopBody: TSESTree.Node,
): boolean => {
  if (scopeArg.type !== AST_NODE_TYPES.Identifier) return false;
  return isDeclaredInEnclosingBlocks(scopeArg.name, scopeArg, loopBody);
};

/**
 * Check whether a block enclosing the node, up to and including the loop body,
 * declares a variable with the given name
 */
const isDeclaredInEnclosingBlocks = (
  name: string,
  node: TSESTree.Node,
  loopBody: TSESTree.Node,
): boolean => {
  if (declaresVariableName(node, name)) return true;
  if (node === loopBody || !node.parent) return false;
  return isDeclaredInEnclosingBlocks(name, node.parent, loopBody);
};

/**
 * Check whether a block statement declares a variable with the given name
 */
const declaresVariableName = (node: TSESTree.Node, name: string): boolean => {
  if (node.type !== AST_NODE_TYPES.BlockStatement) return false;

  return node.body.some(
    (statement) =>
      statement.type === AST_NODE_TYPES.VariableDeclaration &&
      statement.declarations.some(
        (declarator) =>
          declarator.id.type === AST_NODE_TYPES.Identifier && declarator.id.name === name,
      ),
  );
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
  node: TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression,
): boolean => {
  const parent = node.parent;
  if (parent?.type !== AST_NODE_TYPES.CallExpression) return false;

  const callee = parent.callee;
  if (callee.type !== AST_NODE_TYPES.MemberExpression) return false;

  if (callee.property.type !== AST_NODE_TYPES.Identifier) return false;

  return ITERATION_METHODS.has(callee.property.name);
};
