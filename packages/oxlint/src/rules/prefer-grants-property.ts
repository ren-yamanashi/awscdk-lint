import { AST_NODE_TYPES, ESLintUtils } from "corsa-oxlint";

import { isConstructType } from "../core/cdk-construct/type-checker/is-construct";
import { findNonNullableType } from "../core/ts-type/finder/non-nullable-type";
import { createRule } from "../shared/create-rule";

export const preferGrantsProperty = createRule({
  name: "prefer-grants-property",
  meta: {
    type: "suggestion",
    docs: {
      description: "Prefer using the grants property over grant* methods when available.",
      requiresTypeChecking: true,
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
      CallExpression(node) {
        if (
          node.callee.type !== AST_NODE_TYPES.MemberExpression ||
          node.callee.property.type !== AST_NODE_TYPES.Identifier
        ) {
          return;
        }

        const methodName = node.callee.property.name;
        if (!methodName.startsWith("grant")) return;

        const objectNode = node.callee.object;
        const receiverType = parserServices.getTypeAtLocation(objectNode);
        if (!receiverType) return;

        // NOTE: An optional receiver such as `props.topic?.grantPublish()` is typed
        // `Topic | undefined`, so strip the nullish members before inspecting the Construct.
        const type = findNonNullableType(receiverType, checker);
        if (!isConstructType(type, checker)) return;

        const grantsProperty = checker.getPropertiesOfType(type).find((s) => s.name === "grants");
        if (!grantsProperty) return;

        const grantsType = checker.getTypeOfSymbol(grantsProperty);
        if (!grantsType) return;

        const grantsTypeName = checker.getSymbolOfType(grantsType)?.name;
        if (!grantsTypeName?.endsWith("Grants")) return;

        const convertedMethodName = methodName
          .replace(/^grant/, "")
          .replace(/^./, (c) => c.toLowerCase());

        const suggestedMethod = checker
          .getPropertiesOfType(grantsType)
          .find((s) => s.name === convertedMethodName);
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
