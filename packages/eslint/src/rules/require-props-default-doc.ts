import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { createRule } from "../shared/create-rule";
import { getAttachedJSDocComments, hasDefaultTag } from "../shared/jsdoc-comment";

/**
 * Requires @default JSDoc documentation for optional properties in interfaces ending with 'Props'
 * @param context - The rule context provided by ESLint
 * @returns An object containing the AST visitor functions
 */
export const requirePropsDefaultDoc = createRule({
  name: "require-props-default-doc",
  meta: {
    type: "problem",
    docs: {
      description:
        "Require @default JSDoc for optional properties in interfaces ending with 'Props'",
    },
    schema: [],
    messages: {
      missingDefaultDoc:
        "Optional property '{{ propertyName }}' in Props interface must have @default JSDoc documentation",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      TSPropertySignature(node) {
        // NOTE: Only Identifier / Literal (string or numeric) keys are checked.
        // Computed keys are out of scope for this rule.
        if (
          node.key.type !== AST_NODE_TYPES.Identifier &&
          node.key.type !== AST_NODE_TYPES.Literal
        ) {
          return;
        }

        // NOTE: Check if the property is optional
        if (!node.optional) return;

        // NOTE: Check if the parent is an interface
        const parent = node.parent.parent;
        if (parent.type !== AST_NODE_TYPES.TSInterfaceDeclaration) return;

        // NOTE: Check if the interface name ends with 'Props'
        if (!parent.id.name.endsWith("Props")) return;

        const comments = getAttachedJSDocComments(context.sourceCode, node);
        if (hasDefaultTag(comments)) return;

        const propertyName =
          node.key.type === AST_NODE_TYPES.Identifier ? node.key.name : String(node.key.value);
        context.report({
          node,
          messageId: "missingDefaultDoc",
          data: { propertyName },
        });
      },
    };
  },
});
