import type { Context, ESTree } from "@oxlint/plugins";

import { getParserServices } from "corsa-oxlint";

import { findEnclosingClass } from "../core/ast-node/finder/enclosing-class";
import { isConstructType } from "../core/cdk-construct/type-checker/is-construct";
import { isConstructOrStackType } from "../core/cdk-construct/type-checker/is-construct-or-stack";
import { getConstructorParamNames } from "../core/ts-type/finder/constructor-param-names";
import { createRule } from "../shared/create-rule";

/**
 * Enforce using literal strings for Construct ID.
 * @param context - The rule context provided by the linter
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

        if (!type || !isConstructType(type, checker) || node.arguments.length < 2) return;

        // NOTE: Skip when inside a class that is not Construct/Stack
        const enclosingClass = findEnclosingClass(node);
        const enclosingClassType = enclosingClass
          ? checker.getTypeAtLocation(enclosingClass)
          : undefined;
        if (enclosingClassType && !isConstructOrStackType(enclosingClassType, checker)) return;

        // NOTE: Only validate when the second constructor parameter is named "id"
        // (otherwise the 2nd argument is not an ID).
        const constructorParamNames = getConstructorParamNames(type, checker);
        if (constructorParamNames[1] !== "id") return;

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
  if (secondArg.type === "Literal" && typeof secondArg.value === "string") {
    return;
  }

  // NOTE: When id is template literal, only those without expressions are OK
  if (secondArg.type === "TemplateLiteral" && !secondArg.expressions.length) {
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
      current.type === "ForStatement" ||
      current.type === "ForInStatement" ||
      current.type === "ForOfStatement" ||
      current.type === "WhileStatement" ||
      current.type === "DoWhileStatement"
    ) {
      return true;
    }

    // Constructs defined in class methods are intended to be called multiple times,
    // which requires variable IDs
    if (current.type === "MethodDefinition" && current.kind !== "constructor") {
      return true;
    }

    // Constructs in arrow functions are also intended to be called multiple times.
    // This includes usages of array methods like forEach, map, etc.
    if (current.type === "ArrowFunctionExpression") {
      return true;
    }

    // Constructs in standalone functions (outside of classes) are intended to be
    // called multiple times with different IDs
    if (current.type === "FunctionDeclaration") {
      return true;
    }

    current = current.parent;
  }
  return false;
};
