import type { Context, ESTree } from "@oxlint/plugins";
import type { CorsaTypeCheckerShape } from "corsa-oxlint";

import { getParserServices } from "corsa-oxlint";

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

type ConstructorFn = ESTree.MethodDefinition["value"];

type Args = {
  parentClassName: string;
  context: Context;
  checker: CorsaTypeCheckerShape;
  option: Option;
};

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
  create(context) {
    const option: Option = (context.options[0] as Option) || defaultOption;
    const services = getParserServices(context);
    const checker = services.program.getTypeChecker();
    return {
      ClassBody(node) {
        const parent = node.parent;
        if (parent?.type !== "ClassDeclaration" || !parent.id) return;

        const parentClassName = parent.id.name;
        if (!parentClassName) return;

        const type = checker.getTypeAtLocation(parent);
        if (!type || !isConstructOrStackType(type, checker)) return;

        for (const body of node.body) {
          // NOTE: Ignore if neither method nor constructor.
          if (
            body.type !== "MethodDefinition" ||
            !["method", "constructor"].includes(body.kind) ||
            body.value.type !== "FunctionExpression"
          ) {
            continue;
          }
          validateConstructorBody({
            expression: body.value,
            parentClassName,
            context,
            checker,
            option,
          });
        }
      },
    };
  },
});

/**
 * Validate the constructor body for the parent class
 * - validate each statement in the constructor body
 */
const validateConstructorBody = ({
  expression,
  parentClassName,
  context,
  checker,
  option,
}: Args & { expression: ConstructorFn }): void => {
  if (!expression.body || expression.body.type !== "BlockStatement") return;
  for (const statement of expression.body.body) {
    switch (statement.type) {
      case "VariableDeclaration": {
        const newExpression = statement.declarations[0].init;
        if (newExpression?.type !== "NewExpression") continue;
        validateConstructId({
          context,
          expression: newExpression,
          parentClassName,
          checker,
          option,
        });
        break;
      }
      case "ExpressionStatement": {
        if (statement.expression?.type !== "NewExpression") break;
        validateStatement({
          statement,
          parentClassName,
          context,
          checker,
          option,
        });
        break;
      }
      case "IfStatement": {
        traverseStatements({
          context,
          parentClassName,
          statement: statement.consequent,
          checker,
          option,
        });
        break;
      }
      case "SwitchStatement": {
        for (const switchCase of statement.cases) {
          for (const consequent of switchCase.consequent) {
            traverseStatements({
              context,
              parentClassName,
              statement: consequent,
              checker,
              option,
            });
          }
        }
        break;
      }
    }
  }
};

/**
 * Recursively traverse and validate statements in the AST
 * - Handles BlockStatement, ExpressionStatement, and VariableDeclaration
 * - Validates construct IDs against parent class name
 */
const traverseStatements = ({
  statement,
  parentClassName,
  context,
  checker,
  option,
}: Args & { statement: ESTree.Statement }) => {
  switch (statement.type) {
    case "BlockStatement": {
      for (const body of statement.body) {
        validateStatement({
          statement: body,
          parentClassName,
          context,
          checker,
          option,
        });
      }
      break;
    }
    case "ExpressionStatement": {
      const newExpression = statement.expression;
      if (newExpression?.type !== "NewExpression") break;
      validateStatement({
        statement,
        parentClassName,
        context,
        checker,
        option,
      });
      break;
    }
    case "VariableDeclaration": {
      const newExpression = statement.declarations[0].init;
      if (newExpression?.type !== "NewExpression") break;
      validateConstructId({
        context,
        expression: newExpression,
        parentClassName,
        checker,
        option,
      });
      break;
    }
  }
};

/**
 * Validate a single statement in the AST
 * - Handles different types of statements (Variable, Expression, If, Switch)
 * - Extracts and validates construct IDs from new expressions
 */
const validateStatement = ({
  statement,
  parentClassName,
  context,
  checker,
  option,
}: Args & { statement: ESTree.Statement }): void => {
  switch (statement.type) {
    case "VariableDeclaration": {
      const newExpression = statement.declarations[0].init;
      if (newExpression?.type !== "NewExpression") break;
      validateConstructId({
        context,
        expression: newExpression,
        parentClassName,
        checker,
        option,
      });
      break;
    }
    case "ExpressionStatement": {
      const newExpression = statement.expression;
      if (newExpression?.type !== "NewExpression") break;
      validateConstructId({
        context,
        expression: newExpression,
        parentClassName,
        checker,
        option,
      });
      break;
    }
    case "IfStatement": {
      validateIfStatement({
        statement,
        parentClassName,
        context,
        checker,
        option,
      });
      break;
    }
    case "SwitchStatement": {
      validateSwitchStatement({
        statement,
        parentClassName,
        context,
        checker,
        option,
      });
      break;
    }
  }
};

/**
 * Validate the `if` statement
 * - Validate recursively if `if` statements are nested
 */
const validateIfStatement = ({
  statement,
  parentClassName,
  context,
  checker,
  option,
}: Args & { statement: ESTree.IfStatement }): void => {
  traverseStatements({
    context,
    parentClassName,
    statement: statement.consequent,
    checker,
    option,
  });
};

/**
 * Validate the `switch` statement
 * - Validate recursively if `switch` statements are nested
 */
const validateSwitchStatement = ({
  statement,
  parentClassName,
  context,
  checker,
  option,
}: Args & { statement: ESTree.SwitchStatement }): void => {
  for (const caseStatement of statement.cases) {
    for (const _consequent of caseStatement.consequent) {
      traverseStatements({
        context,
        parentClassName,
        statement: _consequent,
        checker,
        option,
      });
    }
  }
};

/**
 * Validate that parent construct name and child id do not match
 */
const validateConstructId = ({
  context,
  expression,
  parentClassName,
  checker,
  option,
}: Args & { expression: ESTree.NewExpression }): void => {
  const type = checker.getTypeAtLocation(expression);

  if (expression.arguments.length < 2) return;

  // NOTE: Treat the second argument as ID
  const secondArg = expression.arguments[1];
  if (secondArg.type !== "Literal" || typeof secondArg.value !== "string") {
    return;
  }

  const formattedConstructId = toPascalCase(secondArg.value);
  const formattedParentClassName = toPascalCase(parentClassName);

  if (!type || !isConstructType(type, checker)) return;

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
