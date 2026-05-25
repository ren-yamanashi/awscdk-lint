import type { ESTree } from "@oxlint/plugins";

import { getParserServices } from "corsa-oxlint";

import { findPublicPropertiesInClassOxlint } from "../../core/ast-node/finder/public-property";
import { isConstructOrStackTypeOxlint } from "../../core/cdk-construct/type-checker/is-construct-or-stack";
import { findTypeOfCdkConstructOxlint } from "../../core/cdk-construct/type-finder";
import { createRuleOxlint } from "../../shared/create-rule";

/**
 * Disallow Construct types in public property of Construct
 * @param context - The rule context provided by the linter
 * @returns An object containing the AST visitor functions
 */
export const noConstructInPublicPropertyOfConstructOxlint = createRuleOxlint({
  name: "no-construct-in-public-property-of-construct-oxlint",
  meta: {
    type: "problem",
    docs: {
      description: "Disallow Construct types in public property of Construct",
    },
    messages: {
      invalidPublicPropertyOfConstruct:
        "Public property '{{ propertyName }}' of Construct should not use Construct type '{{ typeName }}'. Consider using an interface or type alias instead.",
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
        // NOTE: tsgo resolves types at node.id position for ClassDeclaration
        const type = checker.getTypeAtLocation(node.id);
        if (!type || !isConstructOrStackTypeOxlint(type, checker)) return;
        const publicProperties = findPublicPropertiesInClassOxlint(node);
        for (const publicProperty of publicProperties) {
          validatePublicProperty(publicProperty, context, checker);
        }
      },
    };
  },
});

const validatePublicProperty = (
  publicProperty: { name: string; node: any },
  context: any,
  checker: any,
) => {
  // NOTE: tsgo resolves types at the key position for properties
  const keyNode =
    publicProperty.node.type === "TSParameterProperty"
      ? publicProperty.node.parameter
      : (publicProperty.node.key ?? publicProperty.node);
  const type = checker.getTypeAtLocation(keyNode);
  if (!type) return;
  const constructType = findTypeOfCdkConstructOxlint(type, checker);
  if (constructType) {
    context.report({
      node: publicProperty.node,
      messageId: "invalidPublicPropertyOfConstruct",
      data: {
        propertyName: publicProperty.name,
        typeName: checker.typeToString(constructType) ?? "unknown",
      },
    });
  }
};
