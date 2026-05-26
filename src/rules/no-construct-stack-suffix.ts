import type { Context, ESTree } from "@oxlint/plugins";

import { getParserServices } from "corsa-oxlint";

import { isConstructOrStackType } from "../core/cdk-construct/type-checker/is-construct-or-stack";
import { findConstructorParamNames } from "../core/ts-type/finder/constructor-param-names";
import { toPascalCase } from "../shared/converter/to-pascal-case";
import { createRule } from "../shared/create-rule";

const SUFFIX_TYPE = {
  CONSTRUCT: "Construct",
  STACK: "Stack",
} as const;

type SuffixType = (typeof SUFFIX_TYPE)[keyof typeof SUFFIX_TYPE];

type Option = {
  disallowedSuffixes?: SuffixType[];
};

const defaultOption: Option = {
  disallowedSuffixes: [SUFFIX_TYPE.CONSTRUCT, SUFFIX_TYPE.STACK],
};

/**
 * Enforces that Construct IDs do not end with 'Construct' or 'Stack' suffix
 * @param context - The rule context provided by the linter
 * @returns An object containing the AST visitor functions
 */
export const noConstructStackSuffix = createRule({
  name: "no-construct-stack-suffix",
  meta: {
    type: "problem",
    docs: {
      description: "Effort to avoid using 'Construct' and 'Stack' suffix in construct id.",
    },
    messages: {
      invalidConstructId: "{{ classType }} ID '{{ id }}' should not include {{ suffix }} suffix.",
    },
    schema: [
      {
        type: "object",
        properties: {
          disallowedSuffixes: {
            type: "array",
            items: {
              type: "string",
              enum: [SUFFIX_TYPE.CONSTRUCT, SUFFIX_TYPE.STACK],
            },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [defaultOption],
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
 * Validate that construct ID does not end with "Construct" or "Stack"
 */
const validateConstructId = (node: ESTree.NewExpression, context: Context): void => {
  const options: Option = (context.options[0] as Option | undefined) ?? defaultOption;

  // NOTE: Treat the second argument as ID
  const secondArg = node.arguments[1];
  if (secondArg.type !== "Literal" || typeof secondArg.value !== "string") {
    return;
  }

  const formattedConstructId = toPascalCase(secondArg.value);
  const disallowedSuffixes = options.disallowedSuffixes;

  if (
    disallowedSuffixes?.includes(SUFFIX_TYPE.CONSTRUCT) &&
    formattedConstructId.endsWith(SUFFIX_TYPE.CONSTRUCT)
  ) {
    context.report({
      node: secondArg,
      messageId: "invalidConstructId",
      data: {
        classType: "Construct",
        id: secondArg.value,
        suffix: SUFFIX_TYPE.CONSTRUCT,
      },
    });
  } else if (
    disallowedSuffixes?.includes(SUFFIX_TYPE.STACK) &&
    formattedConstructId.endsWith(SUFFIX_TYPE.STACK)
  ) {
    context.report({
      node: secondArg,
      messageId: "invalidConstructId",
      data: {
        classType: "Stack",
        id: secondArg.value,
        suffix: SUFFIX_TYPE.STACK,
      },
    });
  }
};
