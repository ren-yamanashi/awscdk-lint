import { createRuleOxlint } from "../../shared/create-rule";

/**
 * Requires @default JSDoc documentation for optional properties in interfaces ending with 'Props'
 * @param context - The rule context provided by the linter
 * @returns An object containing the AST visitor functions
 */
export const requirePropsDefaultDocOxlint = createRuleOxlint({
  name: "require-props-default-doc-oxlint",
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
  create(context: any) {
    return {
      TSPropertySignature(node: any) {
        if (node.key.type !== "Identifier") return;

        // NOTE: Check if the property is optional
        if (!node.optional) return;

        // NOTE: Check if the parent is an interface
        const parent = node.parent.parent;
        if (parent.type !== "TSInterfaceDeclaration") return;

        // NOTE: Check if the interface name ends with 'Props'
        if (!parent.id.name.endsWith("Props")) return;

        // NOTE: Get JSDoc comments
        const sourceCode = context.sourceCode;
        const comments = sourceCode.getCommentsBefore?.(node) ?? [];
        const hasDefaultDoc = comments.some(
          (comment: any) =>
            comment.type === "Block" &&
            comment.value.includes("*") &&
            comment.value.includes("@default"),
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
