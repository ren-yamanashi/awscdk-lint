import type { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

import { safeGetSymbolOfType } from "../../ts-type/checker/safe-get-symbol-of-type";
import { isResourceType } from "./is-resource";

/**
 * Checks if the type is an AWS resource Construct that implements a read-only resource interface
 *
 * Validates:
 * 1. The type extends from Resource (AWS CDK resource)
 * 2. The type or any of its base classes implements an interface following CDK's read-only
 *    interface naming convention
 *    - Pattern 1: Class name with I prefix (Bucket -> IBucket)
 *    - Pattern 2: Class name without Base suffix/prefix with I prefix (BucketBase -> IBucket)
 *    - Pattern 3: Class name with BaseV{n} suffix with I prefix (TableBaseV2 -> ITableV2)
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

const hasMatchingInterfaceInHierarchy = (
  type: CorsaType,
  checker: CorsaTypeCheckerShape,
): boolean => {
  const processedTypes = new Set<string>();

  const checkTypeAndBases = (currentType: CorsaType): boolean => {
    const currentClassName = getSimpleTypeName(currentType, checker);
    if (!currentClassName) return false;

    if (processedTypes.has(currentClassName)) return false;
    processedTypes.add(currentClassName);

    if (isIgnoreClass(currentClassName)) return false;

    const directInterfaces = getImplementedInterfaceNames(currentType, checker);

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

const checkInterfaceMatchClassName = (interfaceName: string, classname: string) => {
  // Pattern 1: Class name with I prefix
  if (interfaceName === `I${classname}`) return true;

  // Pattern 2: Class name without Base suffix/prefix with I prefix
  const classNameWithoutBase = classname.replace(/^Base|Base$/g, "");
  if (classNameWithoutBase && interfaceName === `I${classNameWithoutBase}`) {
    return true;
  }

  // Pattern 3: Class name with BaseV{number} suffix with I prefix
  const baseVMatch = /^(.+)BaseV(\d+)$/.exec(classname);
  if (!baseVMatch) return false;
  const [, baseName, version] = baseVMatch;
  return interfaceName === `I${baseName}V${version}`;
};

const getImplementedInterfaceNames = (
  type: CorsaType,
  checker: CorsaTypeCheckerShape,
): string[] => {
  return checker.getImplementedTypesOfType(type).reduce<string[]>((acc, t) => {
    const name = getSimpleTypeName(t, checker);
    return name ? [...acc, name] : acc;
  }, []);
};

const getSimpleTypeName = (type: CorsaType, checker: CorsaTypeCheckerShape): string | undefined => {
  return safeGetSymbolOfType(type, checker)?.name;
};

const isIgnoreClass = (className: string): boolean => {
  return className === "Resource" || className === "Construct";
};
