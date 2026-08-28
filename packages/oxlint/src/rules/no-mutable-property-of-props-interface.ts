import { AST_NODE_TYPES } from "corsa-oxlint";

import { createRule } from "../shared/create-rule";

/**
 * Disallow mutable properties of Construct Props (interface)
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
          if (property.type !== AST_NODE_TYPES.TSPropertySignature) continue;

          // NOTE: Skip if already readonly
          if (property.readonly) continue;

          // NOTE: computed keys cannot be resolved statically, so they are skipped
          let propertyName: string;
          if (property.key.type === AST_NODE_TYPES.Identifier) {
            propertyName = property.key.name;
          } else if (
            property.key.type === AST_NODE_TYPES.Literal &&
            (typeof property.key.value === "string" || typeof property.key.value === "number")
          ) {
            propertyName = String(property.key.value);
          } else {
            continue;
          }

          context.report({
            node: property,
            messageId: "invalidPropertyOfPropsInterface",
            data: {
              propertyName,
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
