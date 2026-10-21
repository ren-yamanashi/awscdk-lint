import {
  AST_NODE_TYPES,
  ESLintUtils,
  ParserServicesWithTypeInformation,
  TSESTree,
} from "@typescript-eslint/utils";

import { findConstructor } from "../core/ast-node/finder/constructor";
import { findConstructorParamIdentifier } from "../core/ast-node/finder/constructor-param-identifier";
import { isConstructTypeIgnoringSubclasses } from "../core/cdk-construct/type-checker/is-construct";
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
    const parserServices = ESLintUtils.getParserServices(context);
    return {
      ClassDeclaration(node) {
        if (!node.id || !node.superClass) return;

        // NOTE: resolve the class instance type, as the other class-level rules do: its base chain
        // is what reaches Construct through a project base class
        const type = parserServices.getTypeAtLocation(node);
        if (!isConstructTypeIgnoringSubclasses(type)) return;

        // NOTE: check constructor parameter
        const constructor = findConstructor(node);
        if (!constructor) return;

        const propsParam = constructor.value.params?.[2];
        if (!propsParam) return;

        const binding = findConstructorParamIdentifier(propsParam);
        if (!binding) return;

        const typeAnnotation = binding.typeAnnotation;
        if (typeAnnotation?.type !== AST_NODE_TYPES.TSTypeAnnotation) return;

        const typeNode = typeAnnotation.typeAnnotation;
        if (typeNode.type !== AST_NODE_TYPES.TSTypeReference) return;

        const propsTypeName = typeNode.typeName;
        if (propsTypeName.type !== AST_NODE_TYPES.Identifier) return;

        // NOTE: `Omit<BucketProps, "bucketName">` applies a type alias to arguments; the type to rename is
        // the argument, not the alias
        if (typeNode.typeArguments && isTypeAliasReference(propsTypeName, parserServices)) return;

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

/**
 * Check whether a parameterized type reference names a type alias rather than a class or interface
 * @param typeName - The identifier of the type reference
 * @param parserServices - The typescript-eslint parser services
 * @returns True if the identifier resolves to a type alias, otherwise false
 */
const isTypeAliasReference = (
  typeName: TSESTree.Identifier,
  parserServices: ParserServicesWithTypeInformation,
): boolean => {
  const symbol = parserServices.getSymbolAtLocation(typeName);
  if (!symbol) return false;

  const declaredType = parserServices.program.getTypeChecker().getDeclaredTypeOfSymbol(symbol);
  return !declaredType.isClassOrInterface();
};
