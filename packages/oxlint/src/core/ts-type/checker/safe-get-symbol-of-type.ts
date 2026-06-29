import type { CorsaSymbol, CorsaType, CorsaTypeCheckerShape } from "corsa-oxlint";

/**
 * `getSymbolOfType` throws on synthetic type arguments produced by utility types
 * like `Partial<T>` / `Record<K, V>` instead of returning undefined; swallow the
 * error so type-walking rules don't crash on those.
 *
 * TODO: Drop this wrapper once corsa-bind returns `undefined` instead of throwing
 * for those handles. Tracking issue:
 * https://github.com/ubugeeei-prod/corsa-bind/issues/364
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
