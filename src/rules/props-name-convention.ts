import { AST_NODE_TYPES, ESLintUtils } from "@typescript-eslint/utils";

import { findConstructor } from "../core/ast-node/finder/constructor";
import { isConstructType } from "../core/cdk-construct/type-checker/is-construct";
import { createRule } from "../shared/create-rule";

/**
 * Enforces a naming convention for props interfaces in Construct classes
 * @param context - The rule context provided by ESLint
 * @returns An object containing the AST visitor functions
 */
export const propsNameConvention = createRule({
  name: "props-name-convention",
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce props interface name to follow ${ConstructName}Props format",
    },
    schema: [],
    messages: {
      invalidPropsName:
        "Props interface name '{{ interfaceName }}' should follow '${ConstructName}Props' format. Expected '{{ expectedName }}'.",
    },
  },
  defaultOptions: [],
  create(context) {
    const parserServices = ESLintUtils.getParserServices(context);
    return {
      ClassDeclaration(node) {
        if (!node.id || !node.superClass) return;

        const type = parserServices.getTypeAtLocation(node.superClass);
        if (!isConstructType(type)) return;

        // NOTE: check constructor parameter
        const constructor = findConstructor(node);
        if (!constructor) return;

        const propsParam = constructor.value.params?.[2];
        if (propsParam?.type !== AST_NODE_TYPES.Identifier) return;

        const typeAnnotation = propsParam.typeAnnotation;
        if (typeAnnotation?.type !== AST_NODE_TYPES.TSTypeAnnotation) return;

        const typeNode = typeAnnotation.typeAnnotation;
        if (typeNode.type !== AST_NODE_TYPES.TSTypeReference) return;

        const propsTypeName = typeNode.typeName;
        if (propsTypeName.type !== AST_NODE_TYPES.Identifier) return;

        // NOTE: create valid props name
        const constructName = node.id.name;
        const expectedPropsName = `${constructName}Props`;

        // NOTE: error when props name is not expected format
        if (propsTypeName.name !== expectedPropsName) {
          context.report({
            node: propsTypeName,
            messageId: "invalidPropsName",
            data: {
              interfaceName: propsTypeName.name,
              expectedName: expectedPropsName,
            },
          });
        }
      },
    };
  },
});
