import { AST_NODE_TYPES, ESLintUtils } from "corsa-oxlint";

import { findAttachedJSDocComments } from "../core/ast-node/finder/attached-jsdoc-comment";
import { findConstructorParamIdentifier } from "../core/ast-node/finder/constructor-param-identifier";
import { findEnclosingClass } from "../core/ast-node/finder/enclosing-class";
import { isConstructType } from "../core/cdk-construct/type-checker/is-construct";
import { createRule } from "../shared/create-rule";

/**
 * Require JSDoc comments for interface properties and public properties in Construct classes
 */
export const requireJSDoc = createRule({
  name: "require-jsdoc",
  meta: {
    type: "problem",
    docs: {
      description:
        "Require JSDoc comments for interface properties and public properties in Construct classes",
      requiresTypeChecking: true,
    },
    messages: {
      missingJSDoc: "Property '{{ propertyName }}' should have a JSDoc comment.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const parserServices = ESLintUtils.getParserServices(context);
    const checker = parserServices.program.getTypeChecker();
    return {
      TSPropertySignature(node) {
        if (
          node.key.type !== AST_NODE_TYPES.Identifier &&
          node.key.type !== AST_NODE_TYPES.Literal
        ) {
          return;
        }

        // NOTE: Check if the parent is an interface
        const grandparent = node.parent?.parent;
        if (!grandparent || grandparent.type !== AST_NODE_TYPES.TSInterfaceDeclaration) return;

        // NOTE: Check if the interface name ends with 'Props'
        if (!grandparent.id.name.endsWith("Props")) return;

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
          node.parent?.type !== AST_NODE_TYPES.ClassBody
        ) {
          return;
        }

        // NOTE: Check if the class extends Construct
        const classDeclaration = node.parent.parent;
        if (
          !classDeclaration ||
          classDeclaration.type !== AST_NODE_TYPES.ClassDeclaration ||
          !classDeclaration.superClass
        ) {
          return;
        }

        // NOTE: Check if the class extends Construct and the property is public
        const classType = parserServices.getTypeAtLocation(classDeclaration);
        const accessibility = node.accessibility ?? "public";
        if (!isConstructType(classType, checker) || accessibility !== "public") {
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
      TSParameterProperty(node) {
        // NOTE: TypeScript declares an instance field from a parameter property,
        // so it is a public property of the class just like a PropertyDefinition
        if (["private", "protected"].includes(node.accessibility ?? "")) return;

        const identifier = findConstructorParamIdentifier(node);
        if (!identifier) return;

        // NOTE: Check if the class extends Construct
        const classDeclaration = findEnclosingClass(node);
        if (!classDeclaration?.superClass) return;

        const classType = parserServices.getTypeAtLocation(classDeclaration);
        if (!isConstructType(classType, checker)) return;

        const comments = findAttachedJSDocComments(context.sourceCode, node);
        if (comments.length > 0) return;

        context.report({
          node,
          messageId: "missingJSDoc",
          data: { propertyName: identifier.name },
        });
      },
    };
  },
});
