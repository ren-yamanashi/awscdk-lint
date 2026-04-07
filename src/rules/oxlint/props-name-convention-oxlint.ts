import { getParserServices } from "corsa-oxlint";

import { findConstructor } from "../../core/ast-node/finder/constructor";
import { isConstructTypeOxlint } from "../../core/cdk-construct/type-checker/is-construct";
import { createRuleOxlint } from "../../shared/create-rule";
import { safeCall } from "../../shared/safe-call";

/**
 * Enforces a naming convention for props interfaces in Construct classes
 * @param context - The rule context provided by the linter
 * @returns An object containing the AST visitor functions
 */
export const propsNameConventionOxlint = createRuleOxlint({
  name: "props-name-convention-oxlint",
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create(context: any) {
    const services = getParserServices(context);
    const checker = services.program.getTypeChecker();

    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ClassDeclaration(node: any) {
        if (!node.id || !node.superClass) return;

        const type = safeCall(() => checker.getTypeAtLocation(node.superClass), undefined);
        if (!type || !isConstructTypeOxlint(type, checker)) return;

        // NOTE: check constructor parameter
        const constructor = findConstructor(node);
        if (!constructor) return;

        const propsParam = constructor.value.params?.[2];
        if (propsParam?.type !== "Identifier") return;

        const typeAnnotation = propsParam.typeAnnotation;
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
