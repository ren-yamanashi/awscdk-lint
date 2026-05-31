import type { CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

import { isResourceType } from "./is-resource";

const IGNORED_CLASS_NAMES: ReadonlySet<string> = new Set(["Resource", "Construct"]);

/**
 * Checks if the type is an AWS resource Construct that implements a read-only resource interface.
 *
 * This function validates that:
 * 1. The type extends from Resource (AWS CDK resource)
 * 2. The type or any of its base classes implements an interface following CDK's read-only interface naming convention
 *    - Pattern 1: Class name with I prefix (e.g., Bucket -> IBucket)
 *    - Pattern 2: Class name without Base suffix/prefix with I prefix (e.g., BucketBase -> IBucket, BaseService -> IService)
 *    - Pattern 3: Class name with BaseV{number} suffix with I prefix (e.g., TableBaseV2 -> ITableV2)
 */
export const isResourceWithReadonlyInterface = (
  type: CorsaType,
  checker: CorsaTypeCheckerShape,
): boolean => {
  if (!isResourceType(type, checker)) return false;

  const className = getSimpleTypeName(type, checker);
  if (!className || IGNORED_CLASS_NAMES.has(className)) return false;

  const interfaceNames = checker.getImplementedTypesOfType(type).reduce<string[]>((acc, t) => {
    const name = getSimpleTypeName(t, checker);
    return name ? [...acc, name] : acc;
  }, []);
  if (!interfaceNames.length) return false;

  return collectHierarchyClassNames(type, checker).some((cn) =>
    interfaceNames.some((iname) => matchesReadonlyInterfaceName(iname, cn)),
  );
};

const getSimpleTypeName = (type: CorsaType, checker: CorsaTypeCheckerShape): string | undefined => {
  const raw = checker.typeToString(type);
  if (!raw) return undefined;
  const withoutGenerics = raw.replace(/<.*$/, "").trim();
  const lastSegment = withoutGenerics.includes(".")
    ? (withoutGenerics.split(".").pop() ?? withoutGenerics)
    : withoutGenerics;
  return lastSegment || undefined;
};

const collectHierarchyClassNames = (type: CorsaType, checker: CorsaTypeCheckerShape): string[] => {
  const seen = new Set<string>();
  const walk = (current: CorsaType): string[] => {
    const name = getSimpleTypeName(current, checker);
    if (!name || seen.has(name)) return [];
    seen.add(name);
    const head = IGNORED_CLASS_NAMES.has(name) ? [] : [name];
    return checker
      .getBaseTypes(current)
      .reduce<string[]>((acc, base) => [...acc, ...walk(base)], head);
  };
  return walk(type);
};

const matchesReadonlyInterfaceName = (interfaceName: string, className: string): boolean => {
  if (interfaceName === `I${className}`) return true;

  const classNameWithoutBase = className.replace(/^Base|Base$/g, "");
  if (classNameWithoutBase && interfaceName === `I${classNameWithoutBase}`) return true;

  const baseVMatch = /^(.+)BaseV(\d+)$/.exec(className);
  if (!baseVMatch) return false;
  const [, baseName, version] = baseVMatch;
  return interfaceName === `I${baseName}V${version}`;
};
