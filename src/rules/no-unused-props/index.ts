import type { Context, ESTree } from "@oxlint/plugins";
import type { CorsaType } from "corsa-oxlint";

import { AST_NODE_TYPES } from "corsa-oxlint";

import { findConstructor } from "../../core/ast-node/finder/constructor";
import { isConstructType } from "../../core/cdk-construct/type-checker/is-construct";
import { createRule } from "../../shared/create-rule";
import { getParserServices } from "../../shared/parser-services";
import { PropsUsageAnalyzer } from "./props-usage-analyzer";
import { IPropsUsageTracker, PropsUsageTracker } from "./props-usage-tracker";

type ConstructorParam = ESTree.MethodDefinition["value"]["params"][number];
type PropsParamNode = Extract<ConstructorParam, { type: "Identifier" }>;
type ParserServicesWithTypeInformation = ReturnType<typeof getParserServices>;

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
    const parserServices = getParserServices(context);
    const checker = parserServices.program.getTypeChecker();

    return {
      ClassDeclaration(node) {
        if (node.abstract) return;

        const type = parserServices.getTypeAtLocation(node);
        if (!isConstructType(type, checker)) return;

        const constructor = findConstructor(node);
        if (!constructor) return;

        const propsParam = getPropsParam(constructor, parserServices);
        if (!propsParam) return;
        if (isPropsUsedInSuperCall(constructor, propsParam.node.name)) return;

        const tracker = new PropsUsageTracker(propsParam.type, checker);
        const analyzer = new PropsUsageAnalyzer(tracker);

        analyzer.analyze(constructor, propsParam.node);
        reportUnusedProperties(tracker, propsParam.node, context);
      },
    };
  },
});

const getPropsParam = (
  constructor: ESTree.MethodDefinition,
  parserServices: ParserServicesWithTypeInformation,
): { node: PropsParamNode; type: CorsaType } | null => {
  const params = constructor.value.params;
  if (params.length < 3) return null;

  const propsParam = params[2];

  // ++++++++++++++Important+++++++++++++
  // When AST_NODE_TYPES is "ObjectPattern" (e.g. { bucketName, enableVersioning }: MyConstructProps), it can be confirmed whether the variable is used in the IDE, and it conflicts with the @typescript-eslint/no-unused-vars rule, so this rule does not apply.
  // ++++++++++++++++++++++++++++++++++++
  if (propsParam.type !== AST_NODE_TYPES.Identifier) return null;

  return {
    node: propsParam,
    type: parserServices.getTypeAtLocation(propsParam),
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
  propsParam: PropsParamNode,
  context: Context,
): void => {
  for (const propName of tracker.getUnusedProperties()) {
    context.report({
      node: propsParam,
      messageId: "unusedProp",
      data: { propName },
    });
  }
};
