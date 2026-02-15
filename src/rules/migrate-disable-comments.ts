import { createRule } from "../shared/create-rule";

export const migrateDisableComments = createRule({
  name: "migrate-disable-comments",
  meta: {
    type: "problem",
    fixable: "code",
    docs: {
      description: "Migrate deprecated 'cdk/' ESLint disable comments to 'awscdk/'",
    },
    messages: {
      migrateDisableComment: "Replace 'cdk/' with 'awscdk/' in ESLint disable comments.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      Program() {
        const comments = context.sourceCode.getAllComments();
        for (const comment of comments) {
          if (comment.value.includes("eslint-disable cdk/")) {
            context.report({
              loc: comment.loc,
              messageId: "migrateDisableComment",
              fix: (fixer) => {
                const text = context.sourceCode.getText(comment);
                return fixer.replaceText(comment, text.replace("cdk/", "awscdk/"));
              },
            });
            continue;
          }
          if (comment.value.includes("eslint-disable-next-line cdk/")) {
            context.report({
              loc: comment.loc,
              messageId: "migrateDisableComment",
              fix: (fixer) => {
                const text = context.sourceCode.getText(comment);
                return fixer.replaceText(comment, text.replace("cdk/", "awscdk/"));
              },
            });
          }
        }
      },
    };
  },
});
