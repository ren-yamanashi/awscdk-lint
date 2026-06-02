import type { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

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
export const isResourceWithReadonlyInterface = (
  type: CorsaType | undefined,
  checker: CorsaTypeCheckerShape,
): boolean => {
  if (!type || !isResourceType(type, checker)) return false;
  const className = getSimpleTypeName(type, checker);
  if (!className || isIgnoreClass(className)) return false;
  return hasMatchingInterfaceInHierarchy(type, checker);
};

/**
 * Checks if a type or any of its base classes implements an interface matching its class name
 * @param type - The TypeScript type to check
 * @returns true if any class in the hierarchy implements a matching interface
 * @private
 */
const hasMatchingInterfaceInHierarchy = (
  type: CorsaType,
  checker: CorsaTypeCheckerShape,
): boolean => {
  const processedTypes = new Set<string>();

  const checkTypeAndBases = (currentType: CorsaType): boolean => {
    const currentClassName = getSimpleTypeName(currentType, checker);
    if (!currentClassName) return false;

    // Skip if already processed
    if (processedTypes.has(currentClassName)) return false;
    processedTypes.add(currentClassName);

    if (isIgnoreClass(currentClassName)) return false;

    const directInterfaces = getImplementedInterfaceNames(currentType, checker);

    // NOTE: Check if any interface matches this class name
    if (
      directInterfaces.some((interfaceName) =>
        checkInterfaceMatchClassName(interfaceName, currentClassName),
      )
    ) {
      return true;
    }

    const baseTypes = checker.getBaseTypes(currentType);
    return baseTypes.some((baseType) => checkTypeAndBases(baseType));
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
const checkInterfaceMatchClassName = (interfaceName: string, classname: string) => {
  // Pattern 1: Class name with I prefix
  if (interfaceName === `I${classname}`) return true;

  // Pattern 2: Class name without Base suffix/prefix with I prefix
  const classNameWithoutBase = classname.replace(/^Base|Base$/g, "");
  if (classNameWithoutBase && interfaceName === `I${classNameWithoutBase}`) {
    return true;
  }

  // Pattern 3: Class name with BaseV{number} suffix with I prefix (e.g., TableBaseV2 -> ITableV2)
  const baseVMatch = /^(.+)BaseV(\d+)$/.exec(classname);
  if (!baseVMatch) return false;
  const [, baseName, version] = baseVMatch;
  return interfaceName === `I${baseName}V${version}`;
};

/**
 * Retrieves interface names a type implements (inherited interfaces included).
 * @private
 */
const getImplementedInterfaceNames = (
  type: CorsaType,
  checker: CorsaTypeCheckerShape,
): string[] => {
  return checker.getImplementedTypesOfType(type).reduce<string[]>((acc, t) => {
    const name = getSimpleTypeName(t, checker);
    return name ? [...acc, name] : acc;
  }, []);
};

/**
 * Extracts the simple class name from a CorsaType via its symbol.
 * @private
 */
const getSimpleTypeName = (type: CorsaType, checker: CorsaTypeCheckerShape): string | undefined => {
  return checker.getSymbolOfType(type)?.name;
};

const isIgnoreClass = (className: string): boolean => {
  return className === "Resource" || className === "Construct";
};
