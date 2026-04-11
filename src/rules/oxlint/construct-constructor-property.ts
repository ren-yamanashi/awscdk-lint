import { getParserServices } from "corsa-oxlint";

import { findConstructor } from "../../core/ast-node/finder/constructor";
import { isConstructTypeOxlint } from "../../core/cdk-construct/type-checker/is-construct";
import { createRuleOxlint } from "../../shared/create-rule";

/**
 * Enforces that constructors of classes extending Construct have the property names 'scope, id' or 'scope, id, props'
 * @param context - The rule context provided by the linter
 * @returns An object containing the AST visitor functions
 */
export const constructConstructorPropertyOxlint = createRuleOxlint({
  name: "construct-constructor-property-oxlint",
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforces that constructors of classes extending Construct have the property names 'scope, id' or 'scope, id, props'",
    },
    messages: {
      invalidConstructorProperty:
        "Constructor of a class extending Construct must have the property names 'scope, id' or 'scope, id, props'",
      invalidConstructorType:
        "Constructor of a class extending Construct must have the type 'Construct' for the first parameter",
      invalidConstructorIdType:
        "Constructor of a class extending Construct must have the type 'string' for the second parameter",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const services = getParserServices(context);
    const checker = services.program.getTypeChecker();
    return {
      ClassDeclaration(node: any) {
        // NOTE: tsgo resolves types at node.id position for ClassDeclaration
        const type = checker.getTypeAtLocation(node.id);
        if (!type || !isConstructTypeOxlint(type, checker)) return;

        const constructor = findConstructor(node);
        if (!constructor) return;

        const params = checkNumOfConstructorProperty(constructor, context);
        if (params) {
          checkFirstParamIsScope(params[0], context, checker);
          checkSecondParamIsId(params[1], context);
          checkThirdParamIsProps(params[2], context);
        }
      },
    };
  },
});

/**
 * Checks if the number of constructor properties is valid (at least 2)
 */
const checkNumOfConstructorProperty = (
  constructor: any,
  context: any,
): [any, any, any] | undefined => {
  const params = constructor.value.params;
  if (params.length < 2) {
    context.report({
      node: constructor.value,
      messageId: "invalidConstructorProperty",
    });
    return undefined;
  }
  return [params[0], params[1], params[2]];
};

/**
 * Checks if the first parameter is named "scope" and of type Construct
 */
const checkFirstParamIsScope = (firstParam: any, context: any, checker: any) => {
  if (firstParam.type !== "Identifier" || firstParam.name !== "scope") {
    context.report({
      node: firstParam,
      messageId: "invalidConstructorProperty",
    });
  } else {
    const type = checker.getTypeAtLocation(firstParam);
    if (type && !isConstructTypeOxlint(type, checker)) {
      context.report({
        node: firstParam,
        messageId: "invalidConstructorType",
      });
    }
  }
};

/**
 * Checks if the second parameter is named "id" and of type string
 */
const checkSecondParamIsId = (secondParam: any, context: any) => {
  if (secondParam.type !== "Identifier" || secondParam.name !== "id") {
    context.report({
      node: secondParam,
      messageId: "invalidConstructorProperty",
    });
  } else if (secondParam.typeAnnotation?.typeAnnotation.type !== "TSStringKeyword") {
    context.report({
      node: secondParam,
      messageId: "invalidConstructorIdType",
    });
  }
};

/**
 * Checks if the third parameter is named "props"
 */
const checkThirdParamIsProps = (thirdParam: any, context: any) => {
  if (!thirdParam) return;
  if (thirdParam.type !== "Identifier" || thirdParam.name !== "props") {
    context.report({
      node: thirdParam,
      messageId: "invalidConstructorProperty",
    });
  }
};
