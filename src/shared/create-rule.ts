import type { Rule, RuleDefinition } from "corsa-oxlint";

import { defineRule } from "corsa-oxlint";

export const createRule = <MessageId extends string, const Options extends readonly unknown[]>(
  rule: RuleDefinition<MessageId, Options> & { readonly name: string },
): Rule => {
  return defineRule({
    ...rule,
    meta: {
      ...rule.meta,
      docs: {
        ...rule.meta?.docs,
        url: `https://eslint-plugin-awscdk.dev/rules/${rule.name}`,
      },
    },
  });
};
