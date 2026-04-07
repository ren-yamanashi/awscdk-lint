import { getParserServices } from "corsa-oxlint";

import { isConstructTypeOxlint } from "../../core/cdk-construct/type-checker/is-construct";
import { createRuleOxlint } from "../../shared/create-rule";
import { safeCall } from "../../shared/safe-call";

export const preferGrantsPropertyOxlint = createRuleOxlint({
  name: "prefer-grants-property-oxlint",
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
  create(context: any) {
    const services = getParserServices(context);
    const checker = services.program.getTypeChecker();

    return {
      CallExpression(node: any) {
        if (node.callee.type !== "MemberExpression" || node.callee.property.type !== "Identifier") {
          return;
        }

        const methodName = node.callee.property.name;
        if (!methodName.startsWith("grant")) return;

        const objectNode = node.callee.object;
        const type = safeCall(() => checker.getTypeAtLocation(objectNode), undefined);
        if (!type || !isConstructTypeOxlint(type, checker)) return;

        const grantsProperty = safeCall(
          () =>
            checker.getPropertiesOfType(type).find((s: { name: string }) => s.name === "grants"),
          undefined,
        );
        if (!grantsProperty) return;

        const grantsType = safeCall(
          () => checker.getTypeOfSymbolAtLocation(grantsProperty, objectNode),
          undefined,
        );
        if (!grantsType) return;

        const grantsTypeName = safeCall(() => checker.typeToString(grantsType), "");
        if (!grantsTypeName?.endsWith("Grants")) return;

        const convertedMethodName = methodName
          .replace(/^grant/, "")
          .replace(/^./, (c: string) => c.toLowerCase());

        const suggestedMethod = safeCall(
          () =>
            checker
              .getPropertiesOfType(grantsType)
              .find((s: { name: string }) => s.name === convertedMethodName),
          undefined,
        );
        if (!suggestedMethod) return;

        const objectName = objectNode.type === "Identifier" ? objectNode.name : "object";

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
