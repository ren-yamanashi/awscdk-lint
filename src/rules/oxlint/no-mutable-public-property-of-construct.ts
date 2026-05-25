import type { ESTree } from "@oxlint/plugins";

import { getParserServices } from "corsa-oxlint";

import { findPublicPropertiesInClassOxlint } from "../../core/ast-node/finder/public-property";
import { isConstructOrStackTypeOxlint } from "../../core/cdk-construct/type-checker/is-construct-or-stack";
import { createRuleOxlint } from "../../shared/create-rule";

/**
 * Disallow mutable public properties of Construct
 * @param context - The rule context provided by the linter
 * @returns An object containing the AST visitor functions
 */
export const noMutablePublicPropertyOfConstructOxlint = createRuleOxlint({
  name: "no-mutable-public-property-of-construct-oxlint",
  meta: {
    type: "problem",
    docs: {
      description: "Disallow mutable public properties of Construct",
    },
    fixable: "code",
    messages: {
      invalidPublicPropertyOfConstruct:
        "Public property '{{ propertyName }}' should be readonly. Consider adding the 'readonly' modifier.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const services = getParserServices(context);
    const checker = services.program.getTypeChecker();

    return {
      ClassDeclaration(node: ESTree.Class) {
        if (!node.id) return;
        const sourceCode = context.sourceCode;
        // NOTE: tsgo resolves types at node.id position for ClassDeclaration
        const type = checker.getTypeAtLocation(node.id);
        if (!type || !isConstructOrStackTypeOxlint(type, checker)) return;

        const publicProperties = findPublicPropertiesInClassOxlint(node);
        for (const property of publicProperties) {
          validatePublicProperty({
            publicProperty: property,
            context,
            sourceCode,
          });
        }
      },
    };
  },
});

const validatePublicProperty = (args: {
  publicProperty: { name: string; node: any };
  context: any;
  sourceCode: any;
}) => {
  const { publicProperty, context, sourceCode } = args;
  if (publicProperty.node.readonly) return;

  context.report({
    node: publicProperty.node,
    messageId: "invalidPublicPropertyOfConstruct",
    data: {
      propertyName: publicProperty.name,
    },
    fix: (fixer: any) => {
      const accessibility = publicProperty.node.accessibility ? "public " : "";
      const paramText = sourceCode.getText(publicProperty.node);
      const [key, value] = paramText.split(":");
      const replacedKey = key.startsWith("public ") ? key.replace("public ", "") : key;
      return fixer.replaceText(
        publicProperty.node,
        `${accessibility}readonly ${replacedKey}:${value}`,
      );
    },
  });
};
