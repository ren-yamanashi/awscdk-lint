import type { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

import { AST_NODE_TYPES, ESLintUtils } from "corsa-oxlint";

import { isConstructType } from "../core/cdk-construct/type-checker/is-construct";
import { findExpressionTypes } from "../core/ts-type/finder/expression-types";
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

        const convertedMethodName = methodName
          .replace(/^grant/, "")
          .replace(/^./, (c) => c.toLowerCase());

        const objectNode = node.callee.object;
        const objectTypes = findExpressionTypes(objectNode, parserServices, checker);
        if (objectTypes.length === 0) return;
        if (!objectTypes.every((type) => hasGrantsMethod(type, convertedMethodName, checker))) {
          return;
        }

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

/**
 * Check whether a Construct type exposes the given method on its grants property
 * @param type - The type of the call receiver
 * @param methodName - The grants method name the grant* call maps to
 * @param checker - The corsa-oxlint type checker
 * @returns True if `type.grants.<methodName>()` is available, otherwise false
 */
const hasGrantsMethod = (
  type: CorsaType,
  methodName: string,
  checker: CorsaTypeCheckerShape,
): boolean => {
  if (!isConstructType(type, checker)) return false;

  const grantsProperty = checker.getPropertiesOfType(type).find((s) => s.name === "grants");
  if (!grantsProperty) return false;

  const grantsType = checker.getTypeOfSymbol(grantsProperty);
  if (!grantsType) return false;

  const grantsTypeName = checker.getSymbolOfType(grantsType)?.name;
  if (!grantsTypeName?.endsWith("Grants")) return false;

  return checker.getPropertiesOfType(grantsType).some((s) => s.name === methodName);
};
