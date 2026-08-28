import { AST_NODE_TYPES, ESLintUtils, TSESLint } from "@typescript-eslint/utils";

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
        const type = parserServices.getTypeAtLocation(node);
        if (!isConstructOrStackType(type)) return;

        const publicProperties = findPublicPropertiesInClass(node);
        for (const property of publicProperties) {
          validatePublicProperty({
            publicProperty: property,
            context,
          });
        }
      },
    };
  },
});

const validatePublicProperty = (args: {
  publicProperty: PublicProperty;
  context: Context;
}) => {
  const { publicProperty, context } = args;
  if (publicProperty.node.readonly) return;

  context.report({
    node: publicProperty.node,
    messageId: "invalidPublicPropertyOfConstruct",
    data: {
      propertyName: publicProperty.name,
    },
    fix: (fixer) => {
      // NOTE: TS modifier order is accessibility -> static -> override -> readonly,
      // so inserting right before the key is always a legal position

      const anchor =
        publicProperty.node.type === AST_NODE_TYPES.TSParameterProperty
          ? publicProperty.node.parameter
          : publicProperty.node.key;
      return fixer.insertTextBefore(anchor, "readonly ");
    },
  });
};
