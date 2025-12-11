import { AST_NODE_TYPES, AST_TOKEN_TYPES } from "@typescript-eslint/utils";

import { createRule } from "../shared/create-rule";

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
        if (node.key.type !== AST_NODE_TYPES.Identifier) return;

        // NOTE: Check if the property is optional
        if (!node.optional) return;

        // NOTE: Check if the parent is an interface
        const parent = node.parent.parent;
        if (parent.type !== AST_NODE_TYPES.TSInterfaceDeclaration) return;

        // NOTE: Check if the interface name ends with 'Props'
        if (!parent.id.name.endsWith("Props")) return;

        // NOTE: Get JSDoc comments
        const sourceCode = context.sourceCode;
        const comments = sourceCode.getCommentsBefore(node);
        const hasDefaultDoc = comments.some(
          (comment) =>
            comment.type === AST_TOKEN_TYPES.Block &&
            comment.value.includes("*") &&
            comment.value.includes("@default")
        );

        if (!hasDefaultDoc) {
          context.report({
            node,
            messageId: "missingDefaultDoc",
            data: {
              propertyName: node.key.name,
            },
          });
        }
      },
    };
  },
});
