import { getParserServices } from "corsa-oxlint";

import { findPublicPropertiesInClass } from "../../core/ast-node/finder/public-property";
import { isConstructOrStackTypeOxlint } from "../../core/cdk-construct/type-checker/is-construct-or-stack";
import { createRuleOxlint } from "../../shared/create-rule";
import { safeCall } from "../../shared/safe-call";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create(context: any) {
    const services = getParserServices(context);
    const checker = services.program.getTypeChecker();

    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ClassDeclaration(node: any) {
        const sourceCode = context.sourceCode;
        const type = safeCall(() => checker.getTypeAtLocation(node), undefined);
        if (!type || !isConstructOrStackTypeOxlint(type, checker)) return;

        const publicProperties = findPublicPropertiesInClass(node);
        for (const property of publicProperties) {
          validatePublicProperty(property, context, sourceCode);
        }
      },
    };
  },
});

/**
 * Validates that a public property has the readonly modifier
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validatePublicProperty = (publicProperty: any, context: any, sourceCode: any): void => {
  if (publicProperty.node.readonly) return;

  context.report({
    node: publicProperty.node,
    messageId: "invalidPublicPropertyOfConstruct",
    data: {
      propertyName: publicProperty.name,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
