import type { ESTree, RuleContext } from "corsa-oxlint";

import { AST_NODE_TYPES, ESLintUtils } from "corsa-oxlint";

import { findConstructIdString } from "../core/ast-node/finder/construct-id-string";
import { isConstructOrStackType } from "../core/cdk-construct/type-checker/is-construct-or-stack";
import { findConstructorPropertyNames } from "../core/ts-type/finder/constructor-property-name";
import { toPascalCase } from "../shared/converter/to-pascal-case";
import { createRule } from "../shared/create-rule";

const QUOTE_TYPE = {
  SINGLE: "'",
  DOUBLE: '"',
  BACKTICK: "`",
} as const;

type QuoteType = (typeof QUOTE_TYPE)[keyof typeof QUOTE_TYPE];

/**
 * Enforce PascalCase for Construct ID.
 */
export const pascalCaseConstructId = createRule({
  name: "pascal-case-construct-id",
  meta: {
    type: "problem",
    docs: {
      description: "Enforce PascalCase for Construct ID.",
      requiresTypeChecking: true,
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
    const checker = parserServices.program.getTypeChecker();
    return {
      NewExpression(node) {
        const type = parserServices.getTypeAtLocation(node);
        if (!isConstructOrStackType(type, checker) || node.arguments.length < 2) {
          return;
        }

        const calleeType = parserServices.getTypeAtLocation(node.callee);
        const constructorPropertyNames = findConstructorPropertyNames(calleeType, checker);
        if (constructorPropertyNames[1] !== "id") return;

        validateConstructId(node, context);
      },
    };
  },
});

/**
 * check if the string is PascalCase
 */
const isPascalCase = (str: string) => {
  return /^[A-Z][a-zA-Z0-9]*$/.test(str);
};

/**
 * Pick the quote type used to wrap the ID literal so that the fixer keeps
 * the original delimiter (single/double quote or backtick).
 */
const findQuoteType = (node: ESTree.Node): QuoteType => {
  if (node.type === AST_NODE_TYPES.TemplateLiteral) return QUOTE_TYPE.BACKTICK;
  if (node.type === AST_NODE_TYPES.Literal && node.raw?.startsWith('"')) return QUOTE_TYPE.DOUBLE;
  return QUOTE_TYPE.SINGLE;
};

/**
 * Check the construct ID is PascalCase
 */
const validateConstructId = (node: ESTree.NewExpression, context: RuleContext) => {
  if (node.arguments.length < 2) return;

  // NOTE: Treat the second argument as ID
  const secondArg = node.arguments[1];
  const constructId = findConstructIdString(secondArg);
  if (constructId === null) return;

  if (isPascalCase(constructId)) return;

  const pascalCaseValue = toPascalCase(constructId);
  // Skip the fix when the converted value would still fail validation
  // (e.g. leading digits, symbol-only input) so the fix always converges.
  if (!isPascalCase(pascalCaseValue)) {
    context.report({ node: secondArg, messageId: "invalidConstructId" });
    return;
  }

  const quote = findQuoteType(secondArg);
  context.report({
    node: secondArg,
    messageId: "invalidConstructId",
    fix: (fixer) => fixer.replaceText(secondArg, `${quote}${pascalCaseValue}${quote}`),
  });
};
