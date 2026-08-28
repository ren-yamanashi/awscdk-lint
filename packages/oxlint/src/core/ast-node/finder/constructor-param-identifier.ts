import type { ESTree } from "corsa-oxlint";

import { AST_NODE_TYPES } from "corsa-oxlint";

/**
 * Unwraps a constructor parameter (TSParameterProperty and/or AssignmentPattern layers)
 * to its inner Identifier binding, or undefined if the binding is not a plain Identifier
 * (e.g. ObjectPattern, ArrayPattern).
 */
export const findConstructorParamIdentifier = (param: ESTree.Node) => {
  const withoutParameterProperty =
    param.type === AST_NODE_TYPES.TSParameterProperty ? param.parameter : param;
  const withoutDefaultValue =
    withoutParameterProperty.type === AST_NODE_TYPES.AssignmentPattern
      ? withoutParameterProperty.left
      : withoutParameterProperty;
  return withoutDefaultValue.type === AST_NODE_TYPES.Identifier ? withoutDefaultValue : undefined;
};
