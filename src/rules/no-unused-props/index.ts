import type { Context, ESTree } from "@oxlint/plugins";
import type { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

import { getParserServices } from "corsa-oxlint";

import { findConstructor } from "../../core/ast-node/finder/constructor";
import { isConstructType } from "../../core/cdk-construct/type-checker/is-construct";
import { createRule } from "../../shared/create-rule";
import { PropsUsageAnalyzer } from "./props-usage-analyzer";
import { IPropsUsageTracker, PropsUsageTracker } from "./props-usage-tracker";

type ConstructorParam = ESTree.MethodDefinition["value"]["params"][number];
type PropsParamNode = Extract<ConstructorParam, { type: "Identifier" }>;

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
    const services = getParserServices(context);
    const checker = services.program.getTypeChecker();

    return {
      ClassDeclaration(node: ESTree.Class) {
        if (node.abstract || !node.id) return;

        const type = checker.getTypeAtLocation(node);
        if (!type || !isConstructType(type, checker)) return;

        const constructor = findConstructor(node);
        if (!constructor) return;

        const propsParam = getPropsParam(constructor, checker);
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
  checker: CorsaTypeCheckerShape,
): { node: PropsParamNode; type: CorsaType } | null => {
  const params = constructor.value.params;
  if (params.length < 3) return null;

  const propsParam = params[2];

  // ++++++++++++++Important+++++++++++++
  // When AST_NODE_TYPES is "ObjectPattern", this rule does not apply.
  // ++++++++++++++++++++++++++++++++++++
  if (propsParam.type !== "Identifier") return null;

  const type = checker.getTypeAtLocation(propsParam);
  if (!type) return null;

  return { node: propsParam, type };
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
  if (!body || body.type !== "BlockStatement") return false;

  for (const expr of body.body) {
    if (
      expr.type !== "ExpressionStatement" ||
      expr.expression.type !== "CallExpression" ||
      expr.expression.callee.type !== "Super"
    ) {
      continue;
    }

    const visitNode = (node: ESTree.Node, propsName: string): boolean => {
      const nodeValue = node.type === "Property" ? node.value : node;
      switch (nodeValue.type) {
        case "Identifier":
          return nodeValue.name === propsName;
        case "ObjectExpression":
          for (const prop of nodeValue.properties) {
            if (visitNode(prop, propsName)) return true;
          }
          break;
        default:
          break;
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
