import type { ESTree } from "corsa-oxlint";

// NOTE: AST node fields like `parent` still carry oxlint's wider `Node$1` type even though
//       corsa-oxlint's `ESTree.Node` is the discriminated narrowed union. Structurally they
//       describe the same set of values, but TypeScript cannot prove the wider→narrower step
//       without a cast. This helper is the single allowed cast site for that conversion.
// TODO: delete this function
export const asEstreeNode = (node: NonNullable<ESTree.Node["parent"]>): ESTree.Node =>
  node as ESTree.Node;
