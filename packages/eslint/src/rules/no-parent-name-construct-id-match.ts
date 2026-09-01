import { ESLintUtils, TSESLint, TSESTree } from "@typescript-eslint/utils";

import { findConstructIdString } from "../core/ast-node/finder/construct-id-string";
import { findEnclosingClass } from "../core/ast-node/finder/enclosing-class";
import { isInsideConstructorOrMethod } from "../core/ast-node/finder/enclosing-method";
import { isConstructType } from "../core/cdk-construct/type-checker/is-construct";
import { isConstructOrStackType } from "../core/cdk-construct/type-checker/is-construct-or-stack";
import { toPascalCase } from "../shared/converter/to-pascal-case";
import { createRule } from "../shared/create-rule";

type Option = {
  disallowContainingParentName?: boolean;
};

const defaultOption: Option = {
  disallowContainingParentName: false,
};

type Context = TSESLint.RuleContext<"invalidConstructId", Option[]>;

/**
 * Enforce that construct IDs does not match the parent construct name.
 * @param context - The rule context provided by ESLint
 * @returns An object containing the AST visitor functions
 */
export const noParentNameConstructIdMatch = createRule({
  name: "no-parent-name-construct-id-match",
  meta: {
    type: "problem",
    docs: {
      description: "Enforce that construct IDs does not match the parent construct name.",
    },
    messages: {
      invalidConstructId:
        "Construct ID '{{ constructId }}' should not match parent construct name '{{ parentConstructName }}'. Use a more specific identifier.",
    },
    schema: [
      {
        type: "object",
        properties: {
          disallowContainingParentName: {
            type: "boolean",
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [defaultOption],

  create(context: Context) {
    const option = context.options[0] || defaultOption;
    const parserServices = ESLintUtils.getParserServices(context);
    return {
      NewExpression(node) {
        if (node.arguments.length < 2) return;

        const type = parserServices.getTypeAtLocation(node);
        if (!isConstructType(type)) return;

        // NOTE: nested closures do not have a stable "parent class" relationship
        if (!isInsideConstructorOrMethod(node)) return;

        const enclosingClass = findEnclosingClass(node);
        if (!enclosingClass) return;

        const enclosingClassType = parserServices.getTypeAtLocation(enclosingClass);
        if (!isConstructOrStackType(enclosingClassType)) return;

        const parentClassName = enclosingClass.id?.name;
        if (!parentClassName) return;

        validateConstructId({ node, parentClassName, context, option });
      },
    };
  },
});

type ValidateConstructIdArgs = {
  node: TSESTree.NewExpression;
  parentClassName: string;
  context: Context;
  option: Option;
};

/**
 * Report when the construct id matches (or contains) the parent class name.
 */
const validateConstructId = ({
  node,
  parentClassName,
  context,
  option,
}: ValidateConstructIdArgs): void => {
  // NOTE: Treat the second argument as ID
  const secondArg = node.arguments[1];
  const constructId = findConstructIdString(secondArg);
  if (constructId === null) return;

  const formattedConstructId = toPascalCase(constructId);
  const formattedParentClassName = toPascalCase(parentClassName);

  if (
    option.disallowContainingParentName &&
    formattedConstructId.includes(formattedParentClassName)
  ) {
    context.report({
      node: secondArg,
      messageId: "invalidConstructId",
      data: {
        constructId,
        parentConstructName: parentClassName,
      },
    });
    return;
  }
  if (formattedParentClassName === formattedConstructId) {
    context.report({
      node: secondArg,
      messageId: "invalidConstructId",
      data: {
        constructId,
        parentConstructName: parentClassName,
      },
    });
  }
};
