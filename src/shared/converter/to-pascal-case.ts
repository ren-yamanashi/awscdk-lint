/**
 * Convert a string to PascalCase
 * @param str - The string to convert
 * @returns The PascalCase string
 */
export const toPascalCase = (str: string): string => {
  return str
    .split(/[-_\s]/)
    .map((word) => {
      // Consider camelCase, split by uppercase letters
      return word
        .replace(/([A-Z])/g, " $1")
        .split(/\s+/)
        .map(
          (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        )
        .join("");
    })
    .join("");
};
