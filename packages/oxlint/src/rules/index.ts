import type { Rule } from "corsa-oxlint";

import { noImportPrivate } from "./no-import-private";

export const rules: Record<string, Rule> = {
  "no-import-private": noImportPrivate,
};
