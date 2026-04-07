/**
 * Safely call a checker method, returning a fallback on error.
 * tsgo may throw on certain types (e.g. getTypeArguments on non-generic types).
 */
export const safeCall = <T>(fn: () => T, fallback: T): T => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};
