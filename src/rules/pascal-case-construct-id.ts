import {
  AST_NODE_TYPES,
  ESLintUtils,
  TSESLint,
  TSESTree,
} from "@typescript-eslint/utils";

import { isConstructOrStackType } from "../core/cdk-construct/type-checker/is-construct-or-stack";
import { findConstructorPropertyNames } from "../core/ts-type/finder/constructor-property-name";
import { toPascalCase } from "../shared/converter/to-pascal-case";
import { createRule } from "../shared/create-rule";

const QUOTE_TYPE = {
  SINGLE: "'",
  DOUBLE: '"',
} as const;

type QuoteType = (typeof QUOTE_TYPE)[keyof typeof QUOTE_TYPE];

type Context = TSESLint.RuleContext<"invalidConstructId", []>;

/**
/**
 * Enforce PascalCase for Construct ID.
 * @param context - The rule context provided by ESLint
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
    const parserServices = ESLintUtils.getParserServices(context);
    return {
      NewExpression(node) {
        const type = parserServices.getTypeAtLocation(node);
        if (!isConstructOrStackType(type) || node.arguments.length < 2) {
          return;
        }

        const constructorPropertyNames = findConstructorPropertyNames(type);
        if (constructorPropertyNames[1] !== "id") return;

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
const validateConstructId = (
  node: TSESTree.NewExpression,
  context: Context
) => {
  if (node.arguments.length < 2) return;

  // NOTE: Treat the second argument as ID
  const secondArg = node.arguments[1];
  if (
    secondArg.type !== AST_NODE_TYPES.Literal ||
    typeof secondArg.value !== "string"
  ) {
    return;
  }

  const quote: QuoteType = secondArg.raw?.startsWith('"')
    ? QUOTE_TYPE.DOUBLE
    : QUOTE_TYPE.SINGLE;

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
