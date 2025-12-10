import {
  AST_NODE_TYPES,
  ESLintUtils,
  ParserServicesWithTypeInformation,
  TSESLint,
  TSESTree,
} from "@typescript-eslint/utils";

import { findConstructor } from "../core/ast-node/finder/constructor";
import { isConstructType } from "../core/cdk-construct/type-checker/is-construct";
import { createRule } from "../shared/create-rule";

type Context = TSESLint.RuleContext<
  | "invalidConstructorProperty"
  | "invalidConstructorType"
  | "invalidConstructorIdType",
  []
>;

type ConstructorProperties = [
  TSESTree.Parameter,
  TSESTree.Parameter,
  TSESTree.Parameter | undefined
];

/**
 * Enforces that constructors of classes extending Construct have the property names 'scope, id' or 'scope, id, props'
 * @param context - The rule context provided by ESLint
 * @returns An object containing the AST visitor functions
 */
export const constructConstructorProperty = createRule({
  name: "construct-constructor-property",
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
    const parserServices = ESLintUtils.getParserServices(context);
    return {
      ClassDeclaration(node) {
        const type = parserServices.getTypeAtLocation(node);
        if (!isConstructType(type)) return;

        const constructor = findConstructor(node);
        if (!constructor) return;

        const params = checkNumOfConstructorProperty(constructor, context);
        if (params) {
          checkFirstParamIsScope(params[0], context, parserServices);
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
  constructor: TSESTree.MethodDefinition,
  context: Context
): ConstructorProperties | undefined => {
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
const checkFirstParamIsScope = (
  firstParam: ConstructorProperties[0],
  context: Context,
  parserServices: ParserServicesWithTypeInformation
) => {
  if (
    firstParam.type !== AST_NODE_TYPES.Identifier ||
    firstParam.name !== "scope"
  ) {
    context.report({
      node: firstParam,
      messageId: "invalidConstructorProperty",
    });
  } else if (!isConstructType(parserServices.getTypeAtLocation(firstParam))) {
    context.report({
      node: firstParam,
      messageId: "invalidConstructorType",
    });
  }
};

/**
 * Checks if the second parameter is named "id" and of type string
 */
const checkSecondParamIsId = (
  secondParam: ConstructorProperties[1],
  context: Context
) => {
  if (
    secondParam.type !== AST_NODE_TYPES.Identifier ||
    secondParam.name !== "id"
  ) {
    context.report({
      node: secondParam,
      messageId: "invalidConstructorProperty",
    });
  } else if (
    secondParam.typeAnnotation?.typeAnnotation.type !==
    AST_NODE_TYPES.TSStringKeyword
  ) {
    context.report({
      node: secondParam,
      messageId: "invalidConstructorIdType",
    });
  }
};

/**
 * Checks if the third parameter is named "props"
 */
const checkThirdParamIsProps = (
  thirdParam: ConstructorProperties[2],
  context: Context
) => {
  if (!thirdParam) return;
  if (
    thirdParam.type !== AST_NODE_TYPES.Identifier ||
    thirdParam.name !== "props"
  ) {
    context.report({
      node: thirdParam,
      messageId: "invalidConstructorProperty",
    });
  }
};
