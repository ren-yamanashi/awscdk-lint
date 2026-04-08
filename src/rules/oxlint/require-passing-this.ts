import { getParserServices } from "corsa-oxlint";

import { isConstructTypeOxlint } from "../../core/cdk-construct/type-checker/is-construct";
import { createRuleOxlint } from "../../shared/create-rule";
import { safeCall } from "../../shared/safe-call";

type Option = {
  allowNonThisAndDisallowScope?: boolean;
};

const defaultOption: Option = {
  allowNonThisAndDisallowScope: true,
};

/**
 * Enforces that `this` is passed to the constructor
 * @param context - The rule context provided by the linter
 * @returns An object containing the AST visitor functions
 */
export const requirePassingThisOxlint = createRuleOxlint({
  name: "require-passing-this-oxlint",
  meta: {
    type: "problem",
    docs: {
      description: "Require passing `this` in a constructor.",
    },
    messages: {
      missingPassingThis: "Require passing `this` in a constructor.",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowNonThisAndDisallowScope: {
            type: "boolean",
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
    fixable: "code",
  },
  defaultOptions: [defaultOption],
  create(context: any) {
    const options: Option = context.options[0] || defaultOption;
    const services = getParserServices(context);
    const checker = services.program.getTypeChecker();
    return {
      NewExpression(node: any) {
        // NOTE: tsgo resolves callee type as "typeof ClassName" for NewExpression
        const type = safeCall(() => checker.getTypeAtLocation(node.callee), undefined);

        if (!type || !isConstructTypeOxlint(type, checker) || !node.arguments.length) return;

        const argument = node.arguments[0];

        // NOTE: If the first argument is already `this`, it's valid
        if (argument.type === "ThisExpression") return;

        // NOTE: CDK constructs always have 1st param as "scope", skip findConstructorPropertyNames

        // NOTE: If `allowNonThisAndDisallowScope` is false, require `this` for all cases
        if (!options.allowNonThisAndDisallowScope) {
          context.report({
            node: argument,
            messageId: "missingPassingThis",
            fix: (fixer: any) => {
              return fixer.replaceText(argument, "this");
            },
          });
          return;
        }
        // NOTE: If `allowNonThisAndDisallowScope` is true, allow non-`this` values except `scope` variable
        // Check if the argument is the `scope` variable
        if (argument.type === "Identifier" && argument.name === "scope") {
          context.report({
            node: argument,
            messageId: "missingPassingThis",
            fix: (fixer: any) => {
              return fixer.replaceText(argument, "this");
            },
          });
        }
      },
    };
  },
});
