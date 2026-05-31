import type { Context, ESTree } from "@oxlint/plugins";

import { AST_NODE_TYPES, ESLintUtils } from "corsa-oxlint";

import { findEnclosingClass } from "../core/ast-node/finder/enclosing-class";
import { isConstructType } from "../core/cdk-construct/type-checker/is-construct";
import { isConstructOrStackType } from "../core/cdk-construct/type-checker/is-construct-or-stack";
import { findConstructorPropertyNames } from "../core/ts-type/finder/constructor-property-name";
import { createRule } from "../shared/create-rule";

/**
 * Enforce using literal strings for Construct ID.
 * @param context - The rule context provided by ESLint
 * @returns An object containing the AST visitor functions
 */
export const noVariableConstructId = createRule({
  name: "no-variable-construct-id",
  meta: {
    type: "problem",
    docs: {
      description: `Enforce using literal strings for Construct ID.`,
    },
    messages: {
      invalidConstructId: "Shouldn't use a parameter as a Construct ID.",
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

        // NOTE: Skip when inside a class that is not Construct/Stack
        const enclosingClass = findEnclosingClass(node);
        const enclosingClassType = enclosingClass
          ? parserServices.getTypeAtLocation(enclosingClass)
          : undefined;
        if (enclosingClassType && !isConstructOrStackType(enclosingClassType, checker)) return;

        const calleeType = parserServices.getTypeAtLocation(node.callee);
        const constructorPropertyNames = findConstructorPropertyNames(calleeType, checker);
        if (constructorPropertyNames[1] !== "id") return;

        validateConstructId(node, context);
      },
    };
  },
});

/**
 * Check if the construct ID is a literal string
 */
const validateConstructId = (node: ESTree.NewExpression, context: Context) => {
  if (node.arguments.length < 2 || shouldSkipIdValidation(node)) return;

  // NOTE: Treat the second argument as ID
  const secondArg = node.arguments[1];

  // NOTE: When id is string literal, it's OK
  if (secondArg.type === AST_NODE_TYPES.Literal && typeof secondArg.value === "string") {
    return;
  }

  // NOTE: When id is template literal, only those without expressions are OK
  if (secondArg.type === AST_NODE_TYPES.TemplateLiteral && !secondArg.expressions.length) {
    return;
  }

  context.report({
    node: secondArg,
    messageId: "invalidConstructId",
  });
};

/**
 * Check if construct ID validation should be skipped for a node.
 * Skip if it is inside a loop statement, non-constructor method, or arrow function.
 */
const shouldSkipIdValidation = (node: ESTree.Node): boolean => {
  let current = node.parent;
  while (current) {
    // Constructs defined in loops require variable IDs
    if (
      current.type === AST_NODE_TYPES.ForStatement ||
      current.type === AST_NODE_TYPES.ForInStatement ||
      current.type === AST_NODE_TYPES.ForOfStatement ||
      current.type === AST_NODE_TYPES.WhileStatement ||
      current.type === AST_NODE_TYPES.DoWhileStatement
    ) {
      return true;
    }

    // Constructs defined in class methods are intended to be called multiple times,
    // which requires variable IDs
    if (current.type === AST_NODE_TYPES.MethodDefinition && current.kind !== "constructor") {
      return true;
    }

    // Constructs in arrow functions are also intended to be called multiple times.
    // This includes usages of array methods like forEach, map, etc.
    if (current.type === AST_NODE_TYPES.ArrowFunctionExpression) {
      return true;
    }

    // Constructs in standalone functions (outside of classes) are intended to be called
    // multiple times with different IDs
    if (current.type === AST_NODE_TYPES.FunctionDeclaration) {
      return true;
    }

    current = current.parent;
  }
  return false;
};
