import { getParserServices } from "corsa-oxlint";

import { isConstructTypeOxlint } from "../../core/cdk-construct/type-checker/is-construct";
import { createRuleOxlint } from "../../shared/create-rule";
import { safeCall } from "../../shared/safe-call";

/**
 * Enforce using literal strings for Construct ID.
 * @param context - The rule context provided by the linter
 * @returns An object containing the AST visitor functions
 */
export const noVariableConstructIdOxlint = createRuleOxlint({
  name: "no-variable-construct-id-oxlint",
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create(context: any) {
    const services = getParserServices(context);
    const checker = services.program.getTypeChecker();

    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      NewExpression(node: any) {
        // NOTE: tsgo resolves callee type as "typeof ClassName" for NewExpression
        const type = safeCall(() => checker.getTypeAtLocation(node.callee), undefined);
        if (!type || !isConstructTypeOxlint(type, checker) || node.arguments.length < 2) return;

        // NOTE: CDK constructs always have 2nd param as "id", skip findConstructorPropertyNames
        validateConstructId(node, context);
      },
    };
  },
});

/**
 * Check if the construct ID is a literal string
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateConstructId = (node: any, context: any) => {
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shouldSkipIdValidation = (node: any): boolean => {
  let current = node.parent;
  while (current) {
    // NOTE: Constructs defined in loops require variable IDs
    if (
      current.type === "ForStatement" ||
      current.type === "ForInStatement" ||
      current.type === "ForOfStatement" ||
      current.type === "WhileStatement" ||
      current.type === "DoWhileStatement"
    ) {
      return true;
    }

    // NOTE: Constructs defined in class methods are intended to be called multiple times
    if (current.type === "MethodDefinition" && current.kind !== "constructor") {
      return true;
    }

    // NOTE: Constructs in arrow functions are also intended to be called multiple times
    if (current.type === "ArrowFunctionExpression") {
      return true;
    }

    current = current.parent;
  }
  return false;
};
