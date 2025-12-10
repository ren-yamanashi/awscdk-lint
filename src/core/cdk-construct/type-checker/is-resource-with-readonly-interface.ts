import {
  isClassDeclaration,
  isIdentifier,
  isPropertyAccessExpression,
  SyntaxKind,
  Type,
} from "typescript";

import { isClassType } from "../../ts-type/checker/is-class";

import { isResourceType } from "./is-resource";

/**
 * Checks if the type is an AWS resource Construct that implements a read-only resource interface
 *
 * This function validates that:
 * 1. The type extends from Resource (AWS CDK resource)
 * 2. The type or any of its base classes implements an interface following CDK's read-only interface naming convention
 *    - Pattern 1: Class name with I prefix (e.g., Bucket -> IBucket)
 *    - Pattern 2: Class name without Base suffix/prefix with I prefix (e.g., BucketBase -> IBucket, BaseService -> IService)
 *
 * @param type - The TypeScript type to check
 * @returns true if the type is a resource Construct with a matching read-only interface, false otherwise
 *
 * @example
 * // Returns true for:
 * class Bucket extends Resource implements IBucket { ... }
 * class BucketBase extends Resource implements IBucket { ... }
 * class BaseService extends Resource implements IService { ... }
 * class TableBaseV2 extends Resource implements ITableV2 { ... }
 * class S3OriginAccessControl extends OriginAccessControlBase { ... } // where OriginAccessControlBase implements IOriginAccessControl
 *
 * // Returns false for:
 * class CustomResource extends Resource { ... } // No matching interface
 * class EdgeFunction extends Resource implements IVersion { ... } // Interface doesn't match naming pattern
 */
export const isResourceWithReadonlyInterface = (type: Type): boolean => {
  if (!isResourceType(type) || !type.symbol?.name) return false;
  if (isIgnoreClass(type.symbol.name)) return false;
  return hasMatchingInterfaceInHierarchy(type);
};

/**
 * Checks if a type or any of its base classes implements an interface matching its class name
 * @param type - The TypeScript type to check
 * @returns true if any class in the hierarchy implements a matching interface
 * @private
 */
const hasMatchingInterfaceInHierarchy = (type: Type): boolean => {
  const processedTypes = new Set<string>();

  const checkTypeAndBases = (currentType: Type): boolean => {
    const symbol = currentType.getSymbol?.() ?? currentType.symbol;
    if (!symbol?.name) return false;

    // Skip if already processed
    if (processedTypes.has(symbol.name)) return false;
    processedTypes.add(symbol.name);

    const currentClassName = symbol.name;
    if (isIgnoreClass(currentClassName)) return false;

    const directInterfaces = getDirectImplementedInterfaceNames(currentType);

    // NOTE: Check if any interface matches this class name
    if (
      directInterfaces.some((interfaceName) =>
        checkInterfaceMatchClassName(interfaceName, currentClassName)
      )
    ) {
      return true;
    }

    const baseTypes = currentType.getBaseTypes?.() ?? [];
    return baseTypes.some(
      (baseType) => isClassType(baseType) && checkTypeAndBases(baseType)
    );
  };

  return checkTypeAndBases(type);
};

/**
 * Checks if the provided interface name matches the class name according to specific patterns
 *
 * Patterns:
 * 1. Class name with I prefix (e.g., Bucket -> IBucket)
 * 2. Class name without Base suffix/prefix with I prefix (e.g., BucketBase -> IBucket, BaseService -> IService)
 * 3. Class name with BaseV{number} suffix with I prefix (e.g., TableBaseV2 -> ITableV2)
 *
 * @param interfaceName - The name of the interface to check
 * @param classname - The name of the class to compare against
 * @returns boolean - true if the interface name matches the class name patterns, false otherwise
 */
const checkInterfaceMatchClassName = (
  interfaceName: string,
  classname: string
) => {
  const simpleInterfaceName = interfaceName.includes(".")
    ? interfaceName.split(".").pop() ?? interfaceName
    : interfaceName;

  // Pattern 1: Class name with I prefix
  if (simpleInterfaceName === `I${classname}`) return true;

  // Pattern 2: Class name without Base suffix/prefix with I prefix
  const classNameWithoutBase = classname.replace(/^Base|Base$/g, "");
  if (
    classNameWithoutBase &&
    simpleInterfaceName === `I${classNameWithoutBase}`
  ) {
    return true;
  }

  // Pattern 3: Class name with BaseV{number} suffix with I prefix (e.g., TableBaseV2 -> ITableV2)
  const baseVMatch = /^(.+)BaseV(\d+)$/.exec(classname);
  if (!baseVMatch) return false;
  const [, baseName, version] = baseVMatch;
  return simpleInterfaceName === `I${baseName}V${version}`;
};

/**
 * Retrieves interface names directly implemented by a type (not including inherited interfaces)
 * @param type - The TypeScript type to analyze
 * @returns Array of interface names directly implemented by this type
 * @private
 */
const getDirectImplementedInterfaceNames = (type: Type): string[] => {
  const symbol = type.getSymbol?.() ?? type.symbol;
  if (!symbol?.name) return [];

  const declarations = symbol.getDeclarations
    ? symbol.getDeclarations()
    : symbol.declarations;
  if (!declarations?.length) return [];

  return declarations.reduce<string[]>((acc, decl) => {
    if (!isClassDeclaration(decl)) return acc;

    const heritageClauses = decl.heritageClauses;
    if (!heritageClauses) return acc;

    return heritageClauses.reduce<string[]>((hcAcc, hc) => {
      if (hc.token !== SyntaxKind.ImplementsKeyword) return hcAcc;

      return hc.types.reduce<string[]>((typeAcc, type) => {
        const expression = type.expression;
        if (!expression) return typeAcc;
        if (isIdentifier(expression)) return [...typeAcc, expression.text];
        if (!isPropertyAccessExpression(expression)) return typeAcc;

        const namespace = expression.expression;
        const interfaceName = expression.name;
        if (isIdentifier(namespace) && isIdentifier(interfaceName)) {
          return [...typeAcc, `${namespace.text}.${interfaceName.text}`];
        }

        return typeAcc;
      }, []);
    }, []);
  }, []);
};

const isIgnoreClass = (className: string): boolean => {
  return className === "Resource" || className === "Construct";
};
