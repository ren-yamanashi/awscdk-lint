import { getParserServices } from "corsa-oxlint";

import { findPublicPropertiesInClass } from "../../core/ast-node/finder/public-property";
import { isConstructOrStackTypeOxlint } from "../../core/cdk-construct/type-checker/is-construct-or-stack";
import { findTypeOfCdkConstructOxlint } from "../../core/cdk-construct/type-finder";
import { createRuleOxlint } from "../../shared/create-rule";
import { safeCall } from "../../shared/safe-call";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create(context: any) {
    const services = getParserServices(context);
    const checker = services.program.getTypeChecker();

    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ClassDeclaration(node: any) {
        const type = safeCall(() => checker.getTypeAtLocation(node), undefined);
        if (!type || !isConstructOrStackTypeOxlint(type, checker)) return;

        const publicProperties = findPublicPropertiesInClass(node);
        for (const publicProperty of publicProperties) {
          validatePublicProperty(publicProperty, context, checker);
        }
      },
    };
  },
});

/**
 * Validates that a public property does not use a CDK Construct type
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validatePublicProperty = (publicProperty: any, context: any, checker: any): void => {
  // NOTE: tsgo resolves types at the key position for property definitions
  const propertyNode = publicProperty.node;
  const keyNode =
    propertyNode.type === "TSParameterProperty" ? propertyNode.parameter : propertyNode.key;

  const type = safeCall(() => checker.getTypeAtLocation(keyNode), undefined);
  if (!type) return;

  const constructType = findTypeOfCdkConstructOxlint(type, checker);
  if (constructType) {
    context.report({
      node: publicProperty.node,
      messageId: "invalidPublicPropertyOfConstruct",
      data: {
        propertyName: publicProperty.name,
        typeName: safeCall(() => checker.typeToString(constructType), "unknown"),
      },
    });
  }
};
