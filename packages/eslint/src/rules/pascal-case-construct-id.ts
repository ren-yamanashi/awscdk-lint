import { AST_NODE_TYPES, ESLintUtils, TSESLint, TSESTree } from "@typescript-eslint/utils";

import { findConstructIdString } from "../core/ast-node/finder/construct-id-string";
import { findSiblingConstructIdStrings } from "../core/ast-node/finder/sibling-construct-id-strings";
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
    const checker = parserServices.program.getTypeChecker();
    return {
      NewExpression(node) {
        const type = parserServices.getTypeAtLocation(node);
        if (!isConstructOrStackType(type) || node.arguments.length < 2) {
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
 * @param str - The string to check
 * @returns true if the string is PascalCase, false otherwise
 */
const isPascalCase = (str: string) => {
  return /^[A-Z][a-zA-Z0-9]*$/.test(str);
};

/**
 * Pick the quote type used to wrap the ID literal so that the fixer keeps
 * the original delimiter (single/double quote or backtick).
 */
const findQuoteType = (node: TSESTree.Node): QuoteType => {
  if (node.type === AST_NODE_TYPES.TemplateLiteral) return QUOTE_TYPE.BACKTICK;
  if (node.type === AST_NODE_TYPES.Literal && node.raw?.startsWith('"')) return QUOTE_TYPE.DOUBLE;
  return QUOTE_TYPE.SINGLE;
};

/**
 * Check whether another construct created in the same class body or function
 * body already owns the converted ID. `toPascalCase` is lossy ("Logs" and
 * "logs" both become "Logs"), so fixing such an ID would create a duplicate
 * construct ID that throws at synth time.
 */
const isTakenByAnotherConstruct = (node: TSESTree.NewExpression, pascalCaseValue: string) => {
  // NOTE: Compare against the raw sibling IDs and their converted forms, so that
  // several case variants of one word are not all fixed onto the same ID either.
  // The sibling scan only approximates the scope, so a `new` expression of an
  // unrelated class can withhold the fix. Reporting without a fix is the safe
  // direction, so the approximation is kept on the conservative side.
  return findSiblingConstructIdStrings(node).some(
    (siblingId) => siblingId === pascalCaseValue || toPascalCase(siblingId) === pascalCaseValue,
  );
};

/**
 * Check the construct ID is PascalCase
 */
const validateConstructId = (node: TSESTree.NewExpression, context: Context) => {
  if (node.arguments.length < 2) return;

  // NOTE: Treat the second argument as ID
  const secondArg = node.arguments[1];
  const constructId = findConstructIdString(secondArg);
  if (constructId === null) return;

  if (isPascalCase(constructId)) return;

  const pascalCaseValue = toPascalCase(constructId);
  // Skip the fix when the converted value would still fail validation
  // (e.g. leading digits, symbol-only input) so the fix always converges,
  // or when it would collide with another construct ID in the same class body or
  // function body.
  if (!isPascalCase(pascalCaseValue) || isTakenByAnotherConstruct(node, pascalCaseValue)) {
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
