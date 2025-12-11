import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { createRule } from "../shared/create-rule";

/**
 * Disallow mutable properties of Construct Props (interface)
 * @param context - The rule context provided by ESLint
 * @returns An object containing the AST visitor functions
 */
export const noMutablePropertyOfPropsInterface = createRule({
  name: "no-mutable-property-of-props-interface",
  meta: {
    type: "problem",
    docs: {
      description: "Disallow mutable properties of Construct Props (interface)",
    },
    fixable: "code",
    messages: {
      invalidPropertyOfPropsInterface:
        "Property '{{ propertyName }}' of Construct Props should be readonly.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      TSInterfaceDeclaration(node) {
        const sourceCode = context.sourceCode;

        // NOTE: Interface name check for "Props"
        if (!node.id.name.endsWith("Props")) return;

        for (const property of node.body.body) {
          // NOTE: check property signature
          if (
            property.type !== AST_NODE_TYPES.TSPropertySignature ||
            property.key.type !== AST_NODE_TYPES.Identifier
          ) {
            continue;
          }

          // NOTE: Skip if already readonly
          if (property.readonly) continue;

          context.report({
            node: property,
            messageId: "invalidPropertyOfPropsInterface",
            data: {
              propertyName: property.key.name,
            },
            fix: (fixer) => {
              const propertyText = sourceCode.getText(property);
              return fixer.replaceText(property, `readonly ${propertyText}`);
            },
          });
        }
      },
    };
  },
});
