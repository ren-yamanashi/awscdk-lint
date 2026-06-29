import type { CorsaSymbol, CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

/**
 * `getSymbolOfType` throws on synthetic type arguments produced by utility types
 * like `Partial<T>` / `Record<K, V>` instead of returning undefined; swallow the
 * error so type-walking rules don't crash on those.
 */
export const safeGetSymbolOfType = (
  type: CorsaType,
  checker: CorsaTypeCheckerShape,
): CorsaSymbol | undefined => {
  try {
    return checker.getSymbolOfType(type);
  } catch {
    return undefined;
  }
};
