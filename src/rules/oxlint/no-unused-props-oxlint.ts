import { getParserServices } from "corsa-oxlint";

import { findConstructor } from "../../core/ast-node/finder/constructor";
import { isConstructTypeOxlint } from "../../core/cdk-construct/type-checker/is-construct";
import { createRuleOxlint } from "../../shared/create-rule";
import { safeCall } from "../../shared/safe-call";

/**
 * Enforces that all properties defined in props type are used within the constructor.
 * This is a simplified oxlint version that detects unused props via direct access,
 * destructuring, assignment expressions, and super call forwarding.
 * @param context - The rule context provided by the linter
 * @returns An object containing the AST visitor functions
 */
export const noUnusedPropsOxlint = createRuleOxlint({
  name: "no-unused-props-oxlint",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforces that all properties defined in props type are used within the constructor",
    },
    messages: {
      unusedProp: "Property '{{propName}}' is defined in props but never used",
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
        if (node.abstract) return;

        const type = safeCall(() => checker.getTypeAtLocation(node), undefined);
        if (!type || !isConstructTypeOxlint(type, checker)) return;

        const constructor = findConstructor(node);
        if (!constructor) return;

        const propsParam = getPropsParam(constructor, checker);
        if (!propsParam) return;
        if (isPropsUsedInSuperCall(constructor, propsParam.name)) return;

        const propNames = getPropsPropertyNames(propsParam.type, checker);
        if (!propNames.length) return;

        const usedProps = new Set<string>();
        const constructorBody = constructor.value.body;
        if (!constructorBody) return;

        collectUsedProps(constructorBody, propsParam.name, usedProps);
        collectUsedPropsFromInstanceMethods(node, constructor, propsParam.name, usedProps);

        for (const propName of propNames) {
          if (!usedProps.has(propName)) {
            context.report({
              node: propsParam.node,
              messageId: "unusedProp",
              data: { propName },
            });
          }
        }
      },
    };
  },
});

/**
 * Gets the props parameter (3rd param) from the constructor
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getPropsParam = (
  constructor: any,
  checker: any,
): { node: any; name: string; type: any } | null => {
  const params = constructor.value.params;
  if (params.length < 3) return null;

  const propsParam = params[2];

  // NOTE: When AST_NODE_TYPES is "ObjectPattern", it conflicts with @typescript-eslint/no-unused-vars
  if (propsParam.type !== "Identifier") return null;

  const type = safeCall(() => checker.getTypeAtLocation(propsParam), undefined);
  if (!type) return null;

  return { node: propsParam, name: propsParam.name, type };
};

/**
 * Gets property names from the props type
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getPropsPropertyNames = (propsType: any, checker: any): string[] => {
  const isInternalProperty = (propertyName: string): boolean =>
    propertyName.startsWith("_") || propertyName === "constructor" || propertyName === "prototype";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const typeProperties: any[] = safeCall(() => propsType.getProperties(), []);
  if (typeProperties.length) {
    return typeProperties.reduce<string[]>(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (acc: string[], prop: any) => (!isInternalProperty(prop.name) ? [...acc, prop.name] : acc),
      [],
    );
  }

  const symbol = safeCall(() => propsType.getSymbol(), undefined);
  if (!symbol?.members) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const memberNames: any[] = safeCall(() => Array.from(checker.getPropertiesOfType(propsType)), []);
  return memberNames.reduce<string[]>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (acc: string[], prop: any) => (!isInternalProperty(prop.name) ? [...acc, prop.name] : acc),
    [],
  );
};

/**
 * Checks if props are used in a super call
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isPropsUsedInSuperCall = (constructor: any, propsPropertyName: string): boolean => {
  if (constructor.kind !== "constructor") return false;
  const body = constructor.value.body;
  if (!body) return false;

  for (const expr of body.body) {
    if (
      expr.type !== "ExpressionStatement" ||
      expr.expression.type !== "CallExpression" ||
      expr.expression.callee.type !== "Super"
    ) {
      continue;
    }

    for (const arg of expr.expression.arguments) {
      if (containsIdentifier(arg, propsPropertyName)) return true;
    }
  }
  return false;
};

/**
 * Checks if a node contains an identifier with the given name
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const containsIdentifier = (node: any, name: string): boolean => {
  const nodeValue = node.type === "Property" ? node.value : node;
  switch (nodeValue.type) {
    case "Identifier":
      return nodeValue.name === name;
    case "ObjectExpression":
      return nodeValue.properties.some(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (prop: any) => containsIdentifier(prop, name),
      );
    default:
      return false;
  }
};

/**
 * Collects used property names from the constructor body
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const collectUsedProps = (node: any, propsParamName: string, usedProps: Set<string>): void => {
  if (!node || typeof node !== "object") return;

  // NOTE: Check for props.propertyName or props?.propertyName pattern
  if (
    node.type === "MemberExpression" &&
    node.object?.type === "Identifier" &&
    node.object.name === propsParamName &&
    node.property?.type === "Identifier"
  ) {
    usedProps.add(node.property.name);
  }

  // NOTE: Check for this.props.propertyName pattern
  if (
    node.type === "MemberExpression" &&
    node.object?.type === "MemberExpression" &&
    node.object.object?.type === "ThisExpression" &&
    node.object.property?.type === "Identifier" &&
    node.object.property.name === propsParamName &&
    node.property?.type === "Identifier"
  ) {
    usedProps.add(node.property.name);
  }

  // NOTE: Check for destructuring: const { prop1, prop2 } = props
  if (
    node.type === "VariableDeclarator" &&
    node.id?.type === "ObjectPattern" &&
    node.init?.type === "Identifier" &&
    node.init.name === propsParamName
  ) {
    for (const prop of node.id.properties) {
      if (prop.type === "Property" && prop.key?.type === "Identifier") {
        usedProps.add(prop.key.name);
      }
    }
  }

  // NOTE: Check for assignment: this.x = props.x
  if (
    node.type === "AssignmentExpression" &&
    node.right?.type === "MemberExpression" &&
    node.right.object?.type === "Identifier" &&
    node.right.object.name === propsParamName &&
    node.right.property?.type === "Identifier"
  ) {
    usedProps.add(node.right.property.name);
  }

  // NOTE: Check for alias: const p = props; then track p
  if (
    node.type === "VariableDeclarator" &&
    node.id?.type === "Identifier" &&
    node.init?.type === "Identifier" &&
    node.init.name === propsParamName
  ) {
    // NOTE: Recursively scan using the alias name
    const parent = node.parent;
    if (parent) {
      collectUsedProps(parent.parent ?? parent, node.id.name, usedProps);
    }
    return;
  }

  // NOTE: Recurse into child nodes
  for (const key of Object.keys(node)) {
    if (key === "parent") continue;
    const child = node[key];
    if (Array.isArray(child)) {
      for (const item of child) {
        if (item && typeof item === "object" && item.type) {
          collectUsedProps(item, propsParamName, usedProps);
        }
      }
    } else if (child && typeof child === "object" && child.type) {
      collectUsedProps(child, propsParamName, usedProps);
    }
  }
};

/**
 * Collects used props from private methods that are called from constructor with props as argument
 */
const collectUsedPropsFromInstanceMethods = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  classNode: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor: any,
  propsParamName: string,
  usedProps: Set<string>,
): void => {
  const constructorBody = constructor.value.body;
  if (!constructorBody) return;

  // NOTE: Find this.props = props assignment for instance variable tracking
  const instanceVarName = findPropsInstanceVariable(constructorBody, propsParamName);
  if (instanceVarName) {
    collectUsedProps(classNode.body, instanceVarName, usedProps);
  }

  // NOTE: Find method calls with props as argument
  const methodCalls = findMethodCallsWithProps(constructorBody, propsParamName);
  for (const { methodName, argIndex } of methodCalls) {
    const methodDef = findMethodDefinition(classNode.body, methodName);
    if (!methodDef?.value.body) continue;

    const param = methodDef.value.params[argIndex];
    if (param?.type === "Identifier") {
      collectUsedProps(methodDef.value.body, param.name, usedProps);
    }
  }
};

/**
 * Finds the instance variable name where props is assigned (e.g., this.myProps = props)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const findPropsInstanceVariable = (body: any, propsParamName: string): string | null => {
  for (const statement of body.body) {
    if (
      statement.type === "ExpressionStatement" &&
      statement.expression.type === "AssignmentExpression" &&
      statement.expression.left.type === "MemberExpression" &&
      statement.expression.left.object.type === "ThisExpression" &&
      statement.expression.left.property.type === "Identifier" &&
      statement.expression.right.type === "Identifier" &&
      statement.expression.right.name === propsParamName
    ) {
      return statement.expression.left.property.name;
    }
  }
  return null;
};

/**
 * Finds method calls in constructor where props is passed as an argument
 */
const findMethodCallsWithProps = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any,
  propsParamName: string,
): { methodName: string; argIndex: number }[] => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const statements: any[] = body.body;
  return statements.reduce<{ methodName: string; argIndex: number }[]>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (acc: { methodName: string; argIndex: number }[], statement: any) => {
      if (
        statement.type !== "ExpressionStatement" ||
        statement.expression.type !== "CallExpression"
      ) {
        return acc;
      }

      const callee = statement.expression.callee;
      if (
        callee.type !== "MemberExpression" ||
        callee.object.type !== "ThisExpression" ||
        callee.property.type !== "Identifier"
      ) {
        return acc;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const args: any[] = statement.expression.arguments;
      return args.reduce<{ methodName: string; argIndex: number }[]>((innerAcc, arg, i) => {
        if (arg.type === "Identifier" && arg.name === propsParamName) {
          return [...innerAcc, { methodName: callee.property.name, argIndex: i }];
        }
        return innerAcc;
      }, acc);
    },
    [],
  );
};

/**
 * Finds a method definition in the class body by name
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const findMethodDefinition = (classBody: any, methodName: string): any => {
  for (const member of classBody.body) {
    if (
      member.type === "MethodDefinition" &&
      member.key.type === "Identifier" &&
      member.key.name === methodName
    ) {
      return member;
    }
  }
  return null;
};
