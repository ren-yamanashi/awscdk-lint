import type { CorsaTypeCheckerShape, ESTree, ParserServices, RuleContext } from "corsa-oxlint";

import { AST_NODE_TYPES, ESLintUtils } from "corsa-oxlint";

import { findConstructor } from "../../core/ast-node/finder/constructor";
import { findConstructorParamIdentifier } from "../../core/ast-node/finder/constructor-param-identifier";
import { isConstructType } from "../../core/cdk-construct/type-checker/is-construct";
import { findNonNullableType } from "../../core/ts-type/finder/non-nullable-type";
import { createRule } from "../../shared/create-rule";
import { PropsUsageAnalyzer } from "./props-usage-analyzer";
import { IPropsUsageTracker, PropsUsageTracker } from "./props-usage-tracker";

/**
 * Enforces that all properties defined in props type are used within the constructor
 */
export const noUnusedProps = createRule({
  name: "no-unused-props",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforces that all properties defined in props type are used within the constructor",
      requiresTypeChecking: true,
    },
    messages: {
      unusedProp: "Property '{{propName}}' is defined in props but never used",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const parserServices = ESLintUtils.getParserServices(context);
    const checker = parserServices.program.getTypeChecker();

    return {
      ClassDeclaration(node) {
        if (node.abstract) return;

        const type = parserServices.getTypeAtLocation(node);
        if (!isConstructType(type, checker)) return;

        const constructor = findConstructor(node);
        if (!constructor) return;

        const propsParam = getPropsParam(constructor, parserServices, checker);
        if (!propsParam) return;
        if (isPropsUsedInSuperCall(constructor, propsParam.identifier.name)) return;

        const tracker = new PropsUsageTracker(propsParam.type, checker);
        const analyzer = new PropsUsageAnalyzer(tracker);

        analyzer.analyze(constructor, propsParam.identifier.name, {
          treatAsInstanceVariable: propsParam.isParameterProperty,
        });
        reportUnusedProperties(tracker, propsParam.reportNode, context);
      },
    };
  },
});

const getPropsParam = (
  constructor: ESTree.MethodDefinition,
  parserServices: ParserServices,
  checker: CorsaTypeCheckerShape,
) => {
  const params = constructor.value.params;
  if (params.length < 3) return null;

  const propsParam = params[2];
  const isParameterProperty = propsParam.type === AST_NODE_TYPES.TSParameterProperty;

  // ++++++++++++++Important+++++++++++++
  // When AST_NODE_TYPES is "ObjectPattern" (e.g. { bucketName, enableVersioning }: MyConstructProps), it can be confirmed whether the variable is used in the IDE, and it conflicts with the @typescript-eslint/no-unused-vars rule, so this rule does not apply.
  // ++++++++++++++++++++++++++++++++++++
  const identifier = findConstructorParamIdentifier(propsParam);
  if (!identifier) return null;

  const type = parserServices.getTypeAtLocation(identifier);
  if (!type) return null;

  return {
    identifier,
    reportNode: propsParam,
    // NOTE: An optional parameter (e.g. `props?: MyConstructProps`) is typed as the union
    // `MyConstructProps | undefined`, which only exposes the properties shared by every union
    // member (none). Strip the nullish members so the declared properties are tracked.
    type: findNonNullableType(type, checker),
    isParameterProperty,
  };
};

/**
 * Checks if props are used in a super call
 */
const isPropsUsedInSuperCall = (
  constructor: ESTree.MethodDefinition,
  propsPropertyName: string,
): boolean => {
  if (constructor.kind !== "constructor") return false;
  const body = constructor.value.body;
  if (!body) return false;

  for (const expr of body.body) {
    if (
      expr.type !== AST_NODE_TYPES.ExpressionStatement ||
      expr.expression.type !== AST_NODE_TYPES.CallExpression ||
      expr.expression.callee.type !== AST_NODE_TYPES.Super
    ) {
      continue;
    }

    const visitNode = (node: ESTree.Node, propsName: string): boolean => {
      const nodeValue = node.type === AST_NODE_TYPES.Property ? node.value : node;
      switch (nodeValue.type) {
        case AST_NODE_TYPES.Identifier: {
          return nodeValue.name === propsName;
        }
        case AST_NODE_TYPES.ObjectExpression: {
          for (const prop of nodeValue.properties) {
            if (visitNode(prop, propsName)) return true;
          }
          break;
        }
        default: {
          break;
        }
      }
      return false;
    };

    // NOTE: Check if the same variable name as props is passed to super()
    for (const arg of expr.expression.arguments) {
      if (visitNode(arg, propsPropertyName)) return true;
    }
  }
  return false;
};

/**
 * Reports unused properties to ESLint
 */
const reportUnusedProperties = (
  tracker: IPropsUsageTracker,
  propsParam: ESTree.Node,
  context: RuleContext,
): void => {
  for (const propName of tracker.getUnusedProperties()) {
    context.report({
      node: propsParam,
      messageId: "unusedProp",
      data: {
        propName,
      },
    });
  }
};
