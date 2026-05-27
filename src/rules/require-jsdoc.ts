import type { ESTree } from "@oxlint/plugins";

import { getParserServices } from "corsa-oxlint";

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
    const services = getParserServices(context);
    const checker = services.program.getTypeChecker();

    return {
      TSPropertySignature(node: ESTree.TSPropertySignature) {
        if (node.key.type !== "Identifier") return;

        // NOTE: Check if the parent is an interface
        const parent = node.parent.parent;
        if (parent?.type !== "TSInterfaceDeclaration") return;

        // NOTE: Check if the interface name ends with 'Props'
        if (!parent.id.name.endsWith("Props")) return;

        // NOTE: Get JSDoc comments
        const sourceCode = context.sourceCode;
        const comments = sourceCode.getCommentsBefore(node);
        const hasJSDoc = comments.some(
          ({ type, value }) => type === "Block" && value.startsWith("*"),
        );

        if (!hasJSDoc) {
          context.report({
            node,
            messageId: "missingJSDoc",
            data: {
              propertyName: node.key.name,
            },
          });
        }
      },
      PropertyDefinition(node: ESTree.PropertyDefinition) {
        if (node.key.type !== "Identifier" || node.parent.type !== "ClassBody") {
          return;
        }

        // NOTE: Check if the class extends Construct
        const classDeclaration = node.parent.parent;
        if (
          classDeclaration.type !== "ClassDeclaration" ||
          !classDeclaration.superClass ||
          !classDeclaration.id
        ) {
          return;
        }

        // NOTE: Check if the class extends Construct and the property is public
        const classType = checker.getTypeAtLocation(classDeclaration.id);
        const accessibility = node.accessibility ?? "public";
        if (!classType || !isConstructType(classType, checker) || accessibility !== "public") {
          return;
        }

        const sourceCode = context.sourceCode;
        const comments = sourceCode.getCommentsBefore(node);
        const hasJSDoc = comments.some(
          ({ type, value }) => type === "Block" && value.startsWith("*"),
        );

        if (!hasJSDoc) {
          context.report({
            node,
            messageId: "missingJSDoc",
            data: {
              propertyName: node.key.name,
            },
          });
        }
      },
    };
  },
});
