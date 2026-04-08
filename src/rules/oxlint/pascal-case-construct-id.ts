import { getParserServices } from "corsa-oxlint";

import { isConstructOrStackTypeOxlint } from "../../core/cdk-construct/type-checker/is-construct-or-stack";
import { toPascalCase } from "../../shared/converter/to-pascal-case";
import { createRuleOxlint } from "../../shared/create-rule";
import { safeCall } from "../../shared/safe-call";

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
export const pascalCaseConstructIdOxlint = createRuleOxlint({
  name: "pascal-case-construct-id-oxlint",
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
  create(context: any) {
    const services = getParserServices(context);
    const checker = services.program.getTypeChecker();
    return {
      NewExpression(node: any) {
        // NOTE: tsgo resolves callee type as "typeof ClassName" for NewExpression
        const type = safeCall(() => checker.getTypeAtLocation(node.callee), undefined);
        if (!type || !isConstructOrStackTypeOxlint(type, checker) || node.arguments.length < 2) {
          return;
        }

        // NOTE: CDK constructs always have 2nd param as "id", skip findConstructorPropertyNames

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
const validateConstructId = (node: any, context: any) => {
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
    fix: (fixer: any) => {
      const pascalCaseValue = toPascalCase(secondArg.value);
      return fixer.replaceText(secondArg, `${quote}${pascalCaseValue}${quote}`);
    },
  });
};
