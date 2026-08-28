import * as path from "path";

import { createRule } from "../shared/create-rule";

/**
 * Disallow importing modules from private directories at different levels of the hierarchy.
 */
export const noImportPrivate = createRule({
  name: "no-import-private",
  meta: {
    type: "problem",
    docs: {
      description: "Cannot import modules from private dir at different levels of the hierarchy.",
    },
    messages: {
      invalidImportPath:
        "Cannot import modules from private dir at different levels of the hierarchy.",
    },
    schema: [],
  },
  defaultOptions: [],
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
      },
    };
  },
});

/**
 * Split the directory path into segments using the platform separator.
 */
const getDirSegments = (dirPath: string): string[] => {
  return dirPath.split(path.sep).filter((segment) => segment !== "");
};
