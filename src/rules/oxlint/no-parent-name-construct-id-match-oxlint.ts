import { getParserServices } from "corsa-oxlint";

import { isConstructTypeOxlint } from "../../core/cdk-construct/type-checker/is-construct";
import { isConstructOrStackTypeOxlint } from "../../core/cdk-construct/type-checker/is-construct-or-stack";
import { toPascalCase } from "../../shared/converter/to-pascal-case";
import { createRuleOxlint } from "../../shared/create-rule";
import { safeCall } from "../../shared/safe-call";

type Option = {
  disallowContainingParentName?: boolean;
};

const defaultOption: Option = {
  disallowContainingParentName: false,
};

/**
 * Enforce that construct IDs does not match the parent construct name.
 * @param context - The rule context provided by the linter
 * @returns An object containing the AST visitor functions
 */
export const noParentNameConstructIdMatchOxlint = createRuleOxlint({
  name: "no-parent-name-construct-id-match-oxlint",
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create(context: any) {
    const option: Option = context.options[0] || defaultOption;
    const services = getParserServices(context);
    const checker = services.program.getTypeChecker();

    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ClassBody(node: any) {
        const type = safeCall(() => checker.getTypeAtLocation(node), undefined);
        if (!type || !isConstructOrStackTypeOxlint(type, checker)) return;

        const parent = node.parent;
        if (parent?.type !== "ClassDeclaration") return;

        const parentClassName = parent.id?.name;
        if (!parentClassName) return;

        for (const body of node.body) {
          // NOTE: Ignore if neither method nor constructor.
          if (
            body.type !== "MethodDefinition" ||
            !["method", "constructor"].includes(body.kind) ||
            body.value.type !== "FunctionExpression"
          ) {
            continue;
          }
          validateConstructorBody(body.value, parentClassName, context, checker, option);
        }
      },
    };
  },
});

/**
 * Validate the constructor body for the parent class
 */
const validateConstructorBody = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expression: any,
  parentClassName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  checker: any,
  option: Option,
): void => {
  for (const statement of expression.body.body) {
    switch (statement.type) {
      case "VariableDeclaration": {
        const newExpression = statement.declarations[0].init;
        if (newExpression?.type !== "NewExpression") continue;
        validateConstructId(newExpression, parentClassName, context, checker, option);
        break;
      }
      case "ExpressionStatement": {
        if (statement.expression?.type !== "NewExpression") break;
        validateStatement(statement, parentClassName, context, checker, option);
        break;
      }
      case "IfStatement": {
        traverseStatements(statement.consequent, parentClassName, context, checker, option);
        break;
      }
      case "SwitchStatement": {
        for (const switchCase of statement.cases) {
          for (const consequent of switchCase.consequent) {
            traverseStatements(consequent, parentClassName, context, checker, option);
          }
        }
        break;
      }
    }
  }
};

/**
 * Recursively traverse and validate statements in the AST
 */
const traverseStatements = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  statement: any,
  parentClassName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  checker: any,
  option: Option,
) => {
  switch (statement.type) {
    case "BlockStatement": {
      for (const body of statement.body) {
        validateStatement(body, parentClassName, context, checker, option);
      }
      break;
    }
    case "ExpressionStatement": {
      const newExpression = statement.expression;
      if (newExpression?.type !== "NewExpression") break;
      validateStatement(statement, parentClassName, context, checker, option);
      break;
    }
    case "VariableDeclaration": {
      const newExpression = statement.declarations[0].init;
      if (newExpression?.type !== "NewExpression") break;
      validateConstructId(newExpression, parentClassName, context, checker, option);
      break;
    }
  }
};

/**
 * Validate a single statement in the AST
 */
const validateStatement = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  statement: any,
  parentClassName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  checker: any,
  option: Option,
): void => {
  switch (statement.type) {
    case "VariableDeclaration": {
      const newExpression = statement.declarations[0].init;
      if (newExpression?.type !== "NewExpression") break;
      validateConstructId(newExpression, parentClassName, context, checker, option);
      break;
    }
    case "ExpressionStatement": {
      const newExpression = statement.expression;
      if (newExpression?.type !== "NewExpression") break;
      validateConstructId(newExpression, parentClassName, context, checker, option);
      break;
    }
    case "IfStatement": {
      traverseStatements(statement.consequent, parentClassName, context, checker, option);
      break;
    }
    case "SwitchStatement": {
      for (const caseStatement of statement.cases) {
        for (const consequent of caseStatement.consequent) {
          traverseStatements(consequent, parentClassName, context, checker, option);
        }
      }
      break;
    }
  }
};

/**
 * Validate that parent construct name and child id do not match
 */
const validateConstructId = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expression: any,
  parentClassName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  checker: any,
  option: Option,
): void => {
  // NOTE: tsgo resolves callee type as "typeof ClassName" for NewExpression
  const type = safeCall(() => checker.getTypeAtLocation(expression.callee), undefined);

  if (expression.arguments.length < 2) return;

  // NOTE: Treat the second argument as ID
  const secondArg = expression.arguments[1];
  if (secondArg.type !== "Literal" || typeof secondArg.value !== "string") {
    return;
  }

  const formattedConstructId = toPascalCase(secondArg.value);
  const formattedParentClassName = toPascalCase(parentClassName);

  if (!type || !isConstructTypeOxlint(type, checker)) return;

  if (
    option.disallowContainingParentName &&
    formattedConstructId.includes(formattedParentClassName)
  ) {
    context.report({
      node: secondArg,
      messageId: "invalidConstructId",
      data: {
        constructId: secondArg.value,
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
        constructId: secondArg.value,
        parentConstructName: parentClassName,
      },
    });
  }
};
