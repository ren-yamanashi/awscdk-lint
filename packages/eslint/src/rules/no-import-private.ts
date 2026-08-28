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
        const importPath = node.source.value?.toString() ?? "";
        // Only relative imports can address a `private` directory on disk.
        // Bare specifiers like `@scope/private-utils` must not be resolved as paths.
        if (!importPath.startsWith("./") && !importPath.startsWith("../")) return;

        const currentDirPath = path.dirname(context.filename);
        const absoluteCurrentDirPath = path.resolve(currentDirPath);
        const absoluteImportPath = path.resolve(currentDirPath, importPath);

        const importSegments = getDirSegments(absoluteImportPath);
        // Match the deepest exact `private` segment so that a `private` subtree
        // can still import from its own child `private` directory.
        const lastPrivateIndex = importSegments.lastIndexOf("private");
        if (lastPrivateIndex === -1) return;

        const importDirSegments = importSegments.slice(0, lastPrivateIndex);
        const currentDirSegments = getDirSegments(absoluteCurrentDirPath);
        if (
          currentDirSegments.length !== importDirSegments.length ||
          currentDirSegments.some((segment, index) => segment !== importDirSegments[index])
        ) {
          context.report({ node, messageId: "invalidImportPath" });
        }
      },
    };
  },
};

/**
 * Split the directory path into segments using the platform separator.
 * @param dirPath - The directory path to split
 * @returns The segments of the directory path
 */
const getDirSegments = (dirPath: string): string[] => {
  return dirPath.split(path.sep).filter((segment) => segment !== "");
};
