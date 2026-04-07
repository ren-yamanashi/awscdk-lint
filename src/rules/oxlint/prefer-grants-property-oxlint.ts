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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create(context: any) {
    const services = getParserServices(context);
    const checker = services.program.getTypeChecker();

    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      CallExpression(node: any) {
        if (node.callee.type !== "MemberExpression" || node.callee.property.type !== "Identifier") {
          return;
        }

        const methodName = node.callee.property.name;
        if (!methodName.startsWith("grant")) return;

        const objectNode = node.callee.object;
        // NOTE: In oxlint version, use checker.getTypeAtLocation directly on the ESTree node
        const type = safeCall(() => checker.getTypeAtLocation(objectNode), undefined);
        if (!type || !isConstructTypeOxlint(type, checker)) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const typeAny = type as any;
        const grantsProperty = safeCall(() => typeAny.getProperty("grants"), undefined);
        if (!grantsProperty) return;

        const grantsType = safeCall(
          () => checker.getTypeOfSymbolAtLocation(grantsProperty, objectNode),
          undefined,
        );
        if (!grantsType) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const grantsTypeName = (grantsType as any).symbol?.name;
        if (!grantsTypeName?.endsWith("Grants")) return;

        const convertedMethodName = methodName
          .replace(/^grant/, "")
          .replace(/^./, (c: string) => c.toLowerCase());

        const suggestedMethod = safeCall(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          () => (grantsType as any).getProperty(convertedMethodName),
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
