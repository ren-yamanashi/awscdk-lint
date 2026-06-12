import { AST_NODE_TYPES, ESLintUtils, TSESTree } from "@typescript-eslint/utils";

import { isConstructType } from "../core/cdk-construct/type-checker/is-construct";
import { createRule } from "../shared/create-rule";

export const preferGrantsProperty = createRule({
  name: "prefer-grants-property",
  meta: {
    type: "suggestion",
    docs: {
      description: "Prefer using the grants property over grant* methods when available.",
    },
    messages: {
      useGrantsProperty:
        "Use '{{ objectName }}.grants.{{ methodName }}()' instead of '{{ objectName }}.{{ grantMethod }}()'.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const parserServices = ESLintUtils.getParserServices(context);
    const checker = parserServices.program.getTypeChecker();

    return {
      CallExpression(node: TSESTree.CallExpression) {
        if (
          node.callee.type !== AST_NODE_TYPES.MemberExpression ||
          node.callee.property.type !== AST_NODE_TYPES.Identifier
        ) {
          return;
        }

        const methodName = node.callee.property.name;
        if (!methodName.startsWith("grant")) return;

        const objectNode = node.callee.object;
        const tsNode = parserServices.esTreeNodeToTSNodeMap.get(objectNode);
        const type = checker.getTypeAtLocation(tsNode);
        if (!isConstructType(type)) return;

        const grantsProperty = type.getProperty("grants");
        if (!grantsProperty) return;

        const grantsType = checker.getTypeOfSymbolAtLocation(grantsProperty, tsNode);
        const grantsTypeName = grantsType.symbol?.name;
        if (!grantsTypeName?.endsWith("Grants")) return;

        const convertedMethodName = methodName
          .replace(/^grant/, "")
          .replace(/^./, (c) => c.toLowerCase());

        const suggestedMethod = grantsType.getProperty(convertedMethodName);
        if (!suggestedMethod) return;

        const objectName =
          objectNode.type === AST_NODE_TYPES.Identifier ? objectNode.name : "object";

        context.report({
          node: node.callee.property,
          messageId: "useGrantsProperty",
          data: {
            objectName,
            methodName: convertedMethodName,
            grantMethod: methodName,
          },
        });
      },
    };
  },
});
