/**
 * Normalize type name by stripping "typeof " prefix that tsgo returns for constructor types.
 * e.g. "typeof Bucket" → "Bucket"
 */
export const normalizeTypeName = (name: string): string => {
  return name.startsWith("typeof ") ? name.slice(7) : name;
};
