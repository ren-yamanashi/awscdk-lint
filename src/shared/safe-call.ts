/**
 * Safely call a checker method, returning a fallback on error.
 * tsgo may throw on certain types (e.g. getBaseTypes on a generic type reference
 * such as `Wrapper<Bucket>` or `Promise<Array<Bucket>>`).
 */
export const safeCall = <T>(fn: () => T, fallback: T): T => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};
