import type { ESTree, RuleContext } from "corsa-oxlint";

import { AST_NODE_TYPES, ESLintUtils } from "corsa-oxlint";

import { isDeclaredInEnclosingBlocks } from "../core/ast-node/finder/declared-in-enclosing-blocks";
import { findEnclosingLoopBody } from "../core/ast-node/finder/enclosing-loop-body";
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
  context: RuleContext<"preventConstructIdCollision">,
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
 * Check whether the scope argument is an identifier declared inside the loop body.
 * Only a variable declaration is treated as a per-iteration scope: any other form
 * (`this`, an outer variable, a member expression, ...) may be shared across iterations.
 */
const isScopeDeclaredInLoopBody = (
  scopeArg: ESTree.NewExpression["arguments"][number],
  loopBody: ESTree.Node,
): boolean => {
  if (scopeArg.type !== AST_NODE_TYPES.Identifier) return false;
  return isDeclaredInEnclosingBlocks(scopeArg.name, scopeArg, loopBody);
};
