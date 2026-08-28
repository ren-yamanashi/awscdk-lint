import type { ESTree } from "corsa-oxlint";

import { AST_NODE_TYPES } from "corsa-oxlint";

/**
 * Retrieve the static string ID from a `NewExpression` argument node.
 * Returns the string for a string literal or an expression-less template literal,
 * and `null` for any other argument shape (numbers, identifiers, templates with
 * `${}` interpolation, etc.).
 */
export const findConstructIdString = (node: ESTree.Node): string | null => {
  if (node.type === AST_NODE_TYPES.Literal && typeof node.value === "string") {
    return node.value;
  }
  if (node.type === AST_NODE_TYPES.TemplateLiteral && !node.expressions.length) {
    return node.quasis.map((q) => q.value.raw).join("");
  }
  return null;
};
