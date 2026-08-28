import type { ESTree } from "corsa-oxlint";

import { AST_TOKEN_TYPES } from "corsa-oxlint";

// Matches @default as a JSDoc tag (bounded by start, whitespace, or "*" on
// the left, and by whitespace or end on the right). Avoids matching
// substrings like `no-reply@defaultmail.com` or `@defaultValue`.
const DEFAULT_TAG_PATTERN = /(^|[\s*])@default(\s|$)/;

type CommentLike = { type: string; value: string; loc: { start: { line: number } } };
type TokenLike = { loc: { end: { line: number } } };
type SourceCodeLike = {
  getCommentsBefore: (node: ESTree.Node) => CommentLike[];
  getTokenBefore: (node: ESTree.Node, options?: { includeComments?: boolean }) => TokenLike | null;
};

/**
 * Return JSDoc block comments that are attributed to the given node.
 *
 * A comment is attributed when it is a `/** ... *\/` block comment whose
 * start line is strictly greater than the end line of the previous token.
 * This excludes trailing comments that belong to the preceding property.
 */
export const findAttachedJSDocComments = (
  sourceCode: SourceCodeLike,
  node: ESTree.Node,
): CommentLike[] => {
  const previousToken = sourceCode.getTokenBefore(node, { includeComments: false });
  const previousEndLine = previousToken?.loc.end.line ?? -1;
  return sourceCode
    .getCommentsBefore(node)
    .filter(
      (comment) =>
        comment.type === AST_TOKEN_TYPES.Block &&
        comment.value.startsWith("*") &&
        comment.loc.start.line > previousEndLine,
    );
};

/**
 * Return true if any of the given JSDoc comments contains an `@default` tag.
 */
export const hasDefaultTag = (comments: readonly CommentLike[]): boolean => {
  return comments.some((comment) => DEFAULT_TAG_PATTERN.test(comment.value));
};
