import type { Node } from "@oxlint/plugins";
import type { ContextWithParserOptions, CorsaType, ParserServices } from "corsa-oxlint";

import { ESLintUtils } from "corsa-oxlint";

type EagerParserServices = Omit<ParserServices, "getTypeAtLocation"> & {
  getTypeAtLocation(node: Node): CorsaType;
};

// Re-exports `ESLintUtils.getParserServices` from corsa-oxlint with `getTypeAtLocation`
// asserting non-undefined, so call sites match the `@typescript-eslint/utils` shape.
export const getParserServices = (context: ContextWithParserOptions): EagerParserServices => {
  const services = ESLintUtils.getParserServices(context);
  return {
    ...services,
    getTypeAtLocation: (node) => {
      const type = services.getTypeAtLocation(node);
      if (!type) throw new Error("Failed to resolve type at location");
      return type;
    },
  };
};
