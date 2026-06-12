import { ESLintUtils, TSESLint } from "@typescript-eslint/utils";

import {
  findPublicPropertiesInClass,
  PublicProperty,
} from "../core/ast-node/finder/public-property";
import { isConstructOrStackType } from "../core/cdk-construct/type-checker/is-construct-or-stack";
import { createRule } from "../shared/create-rule";

type Context = TSESLint.RuleContext<"invalidPublicPropertyOfConstruct", []>;

/**
 * Disallow mutable public properties of Construct
 * @param context - The rule context provided by ESLint
 * @returns An object containing the AST visitor functions
 */
export const noMutablePublicPropertyOfConstruct = createRule({
  name: "no-mutable-public-property-of-construct",
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
    const parserServices = ESLintUtils.getParserServices(context);

    return {
      ClassDeclaration(node) {
        const sourceCode = context.sourceCode;
        const type = parserServices.getTypeAtLocation(node);
        if (!isConstructOrStackType(type)) return;

        const publicProperties = findPublicPropertiesInClass(node);
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
  publicProperty: PublicProperty;
  context: Context;
  sourceCode: Readonly<TSESLint.SourceCode>;
}) => {
  const { publicProperty, context, sourceCode } = args;
  if (publicProperty.node.readonly) return;

  context.report({
    node: publicProperty.node,
    messageId: "invalidPublicPropertyOfConstruct",
    data: {
      propertyName: publicProperty.name,
    },
    fix: (fixer) => {
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
