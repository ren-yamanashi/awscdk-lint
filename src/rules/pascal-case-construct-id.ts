import type { Context, ESTree } from "@oxlint/plugins";

import { getParserServices } from "corsa-oxlint";

import { isConstructOrStackType } from "../core/cdk-construct/type-checker/is-construct-or-stack";
import { findConstructorParamNames } from "../core/ts-type/finder/constructor-param-names";
import { toPascalCase } from "../shared/converter/to-pascal-case";
import { createRule } from "../shared/create-rule";

const QUOTE_TYPE = {
  SINGLE: "'",
  DOUBLE: '"',
} as const;

type QuoteType = (typeof QUOTE_TYPE)[keyof typeof QUOTE_TYPE];

/**
 * Enforce PascalCase for Construct ID.
 * @param context - The rule context provided by the linter
 * @returns An object containing the AST visitor functions
 */
export const pascalCaseConstructId = createRule({
  name: "pascal-case-construct-id",
  meta: {
    type: "problem",
    docs: {
      description: "Enforce PascalCase for Construct ID.",
    },
    messages: {
      invalidConstructId: "Construct ID must be PascalCase.",
    },
    schema: [],
    fixable: "code",
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
        if (!type || !isConstructOrStackType(type, checker) || node.arguments.length < 2) {
          return;
        }

        // NOTE: Only validate when the second constructor parameter is named "id"
        // (otherwise the 2nd argument is not an ID).
        const constructorParamNames = findConstructorParamNames(type, checker);
        if (constructorParamNames[1] !== "id") return;

        validateConstructId(node, context);
      },
    };
  },
});

/**
 * check if the string is PascalCase
 * @param str - The string to check
 * @returns true if the string is PascalCase, false otherwise
 */
const isPascalCase = (str: string) => {
  return /^[A-Z][a-zA-Z0-9]*$/.test(str);
};

/**
 * Check the construct ID is PascalCase
 */
const validateConstructId = (node: ESTree.NewExpression, context: Context) => {
  if (node.arguments.length < 2) return;

  // NOTE: Treat the second argument as ID
  const secondArg = node.arguments[1];
  if (secondArg.type !== "Literal" || typeof secondArg.value !== "string") {
    return;
  }

  const quote: QuoteType = secondArg.raw?.startsWith('"') ? QUOTE_TYPE.DOUBLE : QUOTE_TYPE.SINGLE;

  if (isPascalCase(secondArg.value)) return;

  context.report({
    node: secondArg,
    messageId: "invalidConstructId",
    fix: (fixer) => {
      const pascalCaseValue = toPascalCase(secondArg.value);
      return fixer.replaceText(secondArg, `${quote}${pascalCaseValue}${quote}`);
    },
  });
};
