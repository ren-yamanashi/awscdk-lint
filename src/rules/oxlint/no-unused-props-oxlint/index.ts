import { getParserServices } from "corsa-oxlint";

import { findConstructor } from "../../../core/ast-node/finder/constructor";
import { isConstructTypeOxlint } from "../../../core/cdk-construct/type-checker/is-construct";
import { createRuleOxlint } from "../../../shared/create-rule";
import { safeCall } from "../../../shared/safe-call";
import { PropsUsageAnalyzer } from "./props-usage-analyzer";
import { IPropsUsageTracker, PropsUsageTracker } from "./props-usage-tracker";

/**
 * Enforces that all properties defined in props type are used within the constructor
 * @param context - The rule context provided by the linter
 * @returns An object containing the AST visitor functions
 */
export const noUnusedPropsOxlint = createRuleOxlint({
  name: "no-unused-props-oxlint",
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
  create(context: any) {
    const services = getParserServices(context);
    const checker = services.program.getTypeChecker();

    return {
      ClassDeclaration(node: any) {
        if (node.abstract) return;

        const type = safeCall(() => checker.getTypeAtLocation(node), undefined);
        if (!type || !isConstructTypeOxlint(type, checker)) return;

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

const getPropsParam = (constructor: any, checker: any): { node: any; type: any } | null => {
  const params = constructor.value.params;
  if (params.length < 3) return null;

  const propsParam = params[2];

  // ++++++++++++++Important+++++++++++++
  // When AST_NODE_TYPES is "ObjectPattern" (e.g. { bucketName, enableVersioning }: MyConstructProps), it can be confirmed whether the variable is used in the IDE, and it conflicts with the @typescript-eslint/no-unused-vars rule, so this rule does not apply.
  // ++++++++++++++++++++++++++++++++++++
  if (propsParam.type !== "Identifier") return null;

  return {
    node: propsParam,
    type: safeCall(() => checker.getTypeAtLocation(propsParam), undefined),
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
const isPropsUsedInSuperCall = (constructor: any, propsPropertyName: string): boolean => {
  if (constructor.kind !== "constructor") return false;
  const body = constructor.value.body;
  if (!body) return false;

  for (const expr of body.body) {
    if (
      expr.type !== "ExpressionStatement" ||
      expr.expression.type !== "CallExpression" ||
      expr.expression.callee.type !== "Super"
    ) {
      continue;
    }

    const visitNode = (node: any, propsName: string): boolean => {
      const nodeValue = node.type === "Property" ? node.value : node;
      switch (nodeValue.type) {
        case "Identifier": {
          return nodeValue.name === propsName;
        }
        case "ObjectExpression": {
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
 * Reports unused properties to the linter
 */
const reportUnusedProperties = (
  tracker: IPropsUsageTracker,
  propsParam: any,
  context: any,
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
