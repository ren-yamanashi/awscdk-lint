import {
  AST_NODE_TYPES,
  ESLintUtils,
  ParserServicesWithTypeInformation,
  TSESLint,
  TSESTree,
} from "@typescript-eslint/utils";
import { Type, TypeChecker } from "typescript";

import { findConstructor } from "../../core/ast-node/finder/constructor";
import { findConstructorParamIdentifier } from "../../core/ast-node/finder/constructor-param-identifier";
import { isConstructType } from "../../core/cdk-construct/type-checker/is-construct";
import { findNonNullableType } from "../../core/ts-type/finder/non-nullable-type";
import { createRule } from "../../shared/create-rule";
import { PropsUsageAnalyzer } from "./props-usage-analyzer";
import { IPropsUsageTracker, PropsUsageTracker } from "./props-usage-tracker";

type Context = TSESLint.RuleContext<"unusedProp", []>;

type PropsParam = {
  identifier: TSESTree.Identifier;
  reportNode: TSESTree.Parameter;
  type: Type;
  isParameterProperty: boolean;
};

/**
 * Enforces that all properties defined in props type are used within the constructor
 * @param context - The rule context provided by ESLint
 * @returns An object containing the AST visitor functions
 */
export const noUnusedProps = createRule({
  name: "no-unused-props",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforces that all properties defined in props type are used within the constructor",
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
        if (!isConstructType(type)) return;

        const constructor = findConstructor(node);
        if (!constructor) return;

        const propsParam = getPropsParam(constructor, parserServices, checker);
        if (!propsParam) return;
        if (isPropsUsedInSuperCall(constructor, propsParam.identifier.name)) return;

        const tracker = new PropsUsageTracker(propsParam.type);
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
  constructor: TSESTree.MethodDefinition,
  parserServices: ParserServicesWithTypeInformation,
  checker: TypeChecker,
): PropsParam | null => {
  const params = constructor.value.params;
  if (params.length < 3) return null;

  const propsParam = params[2];
  const isParameterProperty = propsParam.type === AST_NODE_TYPES.TSParameterProperty;

  // ++++++++++++++Important+++++++++++++
  // When AST_NODE_TYPES is "ObjectPattern" (e.g. { bucketName, enableVersioning }: MyConstructProps), it can be confirmed whether the variable is used in the IDE, and it conflicts with the @typescript-eslint/no-unused-vars rule, so this rule does not apply.
  // ++++++++++++++++++++++++++++++++++++
  const identifier = findConstructorParamIdentifier(propsParam);
  if (!identifier) return null;

  return {
    identifier,
    reportNode: propsParam,
    // NOTE: An optional parameter (e.g. `props?: MyConstructProps`) is typed as the union
    // `MyConstructProps | undefined`, which only exposes the properties shared by every union
    // member (none). Strip the nullish members so the declared properties are tracked.
    type: findNonNullableType(parserServices.getTypeAtLocation(identifier), checker),
    isParameterProperty,
  };
};

/**
 * Checks if props are used in a super call
 *
 * @example
 * ```ts
 * constructor(scope: Construct, id: string, props: MyConstructProps) {
 *   super(scope, id, props); // props used here
 * }
 * ```
 *
 * @param constructor - The constructor method definition node
 * @param propsPropertyName - The name of the props parameter
 * @returns True if props are used in super call, false otherwise
 */
const isPropsUsedInSuperCall = (
  constructor: TSESTree.MethodDefinition,
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

    const visitNode = (node: TSESTree.Node, propsName: string): boolean => {
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
  propsParam: TSESTree.Parameter,
  context: Context,
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
