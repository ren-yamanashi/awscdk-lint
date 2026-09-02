import { Rule } from "eslint";
import * as path from "path";

/**
 * Disallow importing modules from private directories at different levels of the hierarchy.
 * @param context - The rule context provided by ESLint
 * @returns An object containing the AST visitor functions
 */
export const noImportPrivate: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      url: "https://awscdk-lint.dev/rules/no-import-private",
      description: "Cannot import modules from private dir at different levels of the hierarchy.",
    },
    messages: {
      invalidImportPath:
        "Cannot import modules from private dir at different levels of the hierarchy.",
    },
    schema: [],
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        validateModuleSpecifier(node.source.value?.toString() ?? "", node, context);
      },
      ExportAllDeclaration(node) {
        validateModuleSpecifier(node.source.value?.toString() ?? "", node, context);
      },
      ExportNamedDeclaration(node) {
        // A local `export { x }` has no `source` and does not pull in another module.
        if (!node.source) return;
        validateModuleSpecifier(node.source.value?.toString() ?? "", node, context);
      },
      ImportExpression(node) {
        // Only a statically known specifier can be resolved to a path.
        const source = node.source;
        if (source.type !== "Literal" || typeof source.value !== "string") return;
        validateModuleSpecifier(source.value, node, context);
      },
    };
  },
};

/**
 * Report the given node when its module specifier crosses into a `private`
 * directory that belongs to another level of the hierarchy.
 * @param specifier - The module specifier as written in the source
 * @param node - The node to report the violation on
 * @param context - The rule context provided by ESLint
 */
const validateModuleSpecifier = (
  specifier: string,
  node: Rule.Node,
  context: Rule.RuleContext,
): void => {
  // Only relative specifiers can address a `private` directory on disk.
  // Bare specifiers like `@scope/private-utils` must not be resolved as paths.
  if (!specifier.startsWith("./") && !specifier.startsWith("../")) return;

  const currentDirPath = path.dirname(context.filename);
  const absoluteCurrentDirPath = path.resolve(currentDirPath);
  const absoluteImportPath = path.resolve(currentDirPath, specifier);

  const importSegments = getDirSegments(absoluteImportPath);
  // Match the deepest exact `private` segment so that a `private` subtree
  // can still import from its own child `private` directory.
  const lastPrivateIndex = importSegments.lastIndexOf("private");
  if (lastPrivateIndex === -1) return;

  const importDirSegments = importSegments.slice(0, lastPrivateIndex);
  const currentDirSegments = getDirSegments(absoluteCurrentDirPath);

  // NOTE: an importer inside the private subtree itself is not crossing its boundary
  const privateRootSegments = importSegments.slice(0, lastPrivateIndex + 1);
  if (privateRootSegments.every((segment, index) => segment === currentDirSegments[index])) {
    return;
  }

  if (
    currentDirSegments.length !== importDirSegments.length ||
    currentDirSegments.some((segment, index) => segment !== importDirSegments[index])
  ) {
    context.report({ node, messageId: "invalidImportPath" });
  }
};

/**
 * Split the directory path into segments using the platform separator.
 * @param dirPath - The directory path to split
 * @returns The segments of the directory path
 */
const getDirSegments = (dirPath: string): string[] => {
  return dirPath.split(path.sep).filter((segment) => segment !== "");
};
