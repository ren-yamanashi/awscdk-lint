import type { ESTree } from "@oxlint/plugins";

import { getParserServices } from "corsa-oxlint";

import { findConstructor } from "../core/ast-node/finder/constructor";
import { isConstructType } from "../core/cdk-construct/type-checker/is-construct";
import { createRule } from "../shared/create-rule";

/**
 * Enforces a naming convention for props interfaces in Construct classes
 * @param context - The rule context provided by the linter
 * @returns An object containing the AST visitor functions
 */
export const propsNameConvention = createRule({
  name: "props-name-convention",
  meta: {
    type: "problem",
    docs: {
      description: "Enforce props interface name to follow ${ConstructName}Props format",
    },
    schema: [],
    messages: {
      invalidPropsName:
        "Props interface name '{{ interfaceName }}' should follow '${ConstructName}Props' format. Expected '{{ expectedName }}'.",
    },
  },
  defaultOptions: [],
  create(context) {
    const services = getParserServices(context);
    const checker = services.program.getTypeChecker();
    return {
      ClassDeclaration(node: ESTree.Class) {
        if (!node.id || !node.superClass) return;

        const type = checker.getTypeAtLocation(node.superClass);
        if (!type || !isConstructType(type, checker)) return;

        // NOTE: check constructor parameter
        const constructor = findConstructor(node);
        if (!constructor) return;

        const propsParam = constructor.value.params?.[2];
        if (propsParam?.type !== "Identifier") return;

        const typeAnnotation = propsParam.typeAnnotation as ESTree.TSTypeAnnotation | null;
        if (typeAnnotation?.type !== "TSTypeAnnotation") return;

        const typeNode = typeAnnotation.typeAnnotation;
        if (typeNode.type !== "TSTypeReference") return;

        const propsTypeName = typeNode.typeName;
        if (propsTypeName.type !== "Identifier") return;

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
