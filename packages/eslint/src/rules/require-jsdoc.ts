import { AST_NODE_TYPES, ESLintUtils } from "@typescript-eslint/utils";

import { findAttachedJSDocComments } from "../core/ast-node/finder/attached-jsdoc-comment";
import { isConstructType } from "../core/cdk-construct/type-checker/is-construct";
import { createRule } from "../shared/create-rule";

/**
 * Require JSDoc comments for interface properties and public properties in Construct classes
 * @param context - The rule context provided by ESLint
 * @returns An object containing the AST visitor functions
 */
export const requireJSDoc = createRule({
  name: "require-jsdoc",
  meta: {
    type: "problem",
    docs: {
      description:
        "Require JSDoc comments for interface properties and public properties in Construct classes",
    },
    messages: {
      missingJSDoc: "Property '{{ propertyName }}' should have a JSDoc comment.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const parserServices = ESLintUtils.getParserServices(context);
    return {
      TSPropertySignature(node) {
        if (
          node.key.type !== AST_NODE_TYPES.Identifier &&
          node.key.type !== AST_NODE_TYPES.Literal
        ) {
          return;
        }

        // NOTE: Check if the parent is an interface
        const parent = node.parent.parent;
        if (parent.type !== AST_NODE_TYPES.TSInterfaceDeclaration) return;

        // NOTE: Check if the interface name ends with 'Props'
        if (!parent.id.name.endsWith("Props")) return;

        const comments = findAttachedJSDocComments(context.sourceCode, node);
        if (comments.length > 0) return;

        const propertyName =
          node.key.type === AST_NODE_TYPES.Identifier ? node.key.name : String(node.key.value);
        context.report({
          node,
          messageId: "missingJSDoc",
          data: { propertyName },
        });
      },
      PropertyDefinition(node) {
        if (
          (node.key.type !== AST_NODE_TYPES.Identifier &&
            node.key.type !== AST_NODE_TYPES.Literal) ||
          node.parent.type !== AST_NODE_TYPES.ClassBody
        ) {
          return;
        }

        // NOTE: Check if the class extends Construct
        const classDeclaration = node.parent.parent;
        if (
          classDeclaration.type !== AST_NODE_TYPES.ClassDeclaration ||
          !classDeclaration.superClass
        ) {
          return;
        }

        // NOTE: Check if the class extends Construct and the property is public
        const classType = parserServices.getTypeAtLocation(classDeclaration);
        const accessibility = node.accessibility ?? "public";
        if (!isConstructType(classType) || accessibility !== "public") {
          return;
        }

        const comments = findAttachedJSDocComments(context.sourceCode, node);
        if (comments.length > 0) return;

        const propertyName =
          node.key.type === AST_NODE_TYPES.Identifier ? node.key.name : String(node.key.value);
        context.report({
          node,
          messageId: "missingJSDoc",
          data: { propertyName },
        });
      },
    };
  },
});
