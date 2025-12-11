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

type Context = TSESLint.RuleContext<"invalidConstructId", Option[]>;

/**
 * Enforces that Construct IDs do not end with 'Construct' or 'Stack' suffix
 * @param context - The rule context provided by ESLint
 * @returns An object containing the AST visitor functions
 */
export const noConstructStackSuffix = createRule({
  name: "no-construct-stack-suffix",
  meta: {
    type: "problem",
    docs: {
      description:
        "Effort to avoid using 'Construct' and 'Stack' suffix in construct id.",
    },
    messages: {
      invalidConstructId:
        "{{ classType }} ID '{{ id }}' should not include {{ suffix }} suffix.",
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
 * Validate that construct ID does not end with "Construct" or "Stack"
 */
const validateConstructId = (
  node: TSESTree.NewExpression,
  context: Context
): void => {
  const options = context.options[0] ?? defaultOption;

  // NOTE: Treat the second argument as ID
  const secondArg = node.arguments[1];
  if (
    secondArg.type !== AST_NODE_TYPES.Literal ||
    typeof secondArg.value !== "string"
  ) {
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
