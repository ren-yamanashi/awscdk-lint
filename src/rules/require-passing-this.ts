import type { ESTree } from "@oxlint/plugins";

import { getParserServices } from "corsa-oxlint";

import { findEnclosingClass } from "../core/ast-node/finder/enclosing-class";
import { isConstructType } from "../core/cdk-construct/type-checker/is-construct";
import { isConstructOrStackType } from "../core/cdk-construct/type-checker/is-construct-or-stack";
import { createRule } from "../shared/create-rule";

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
export const requirePassingThis = createRule({
  name: "require-passing-this",
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
  create(context) {
    const options: Option = (context.options[0] as Option) || defaultOption;
    const services = getParserServices(context);
    const checker = services.program.getTypeChecker();
    return {
      NewExpression(node: ESTree.NewExpression) {
        // MEMO: tsgo returns `any` for `getTypeAtLocation` on a NewExpression, so
        // we resolve the instance type from the callee's `typeof ClassName` type.
        // Ideally we would derive it from the node directly so this also works
        // under standard TypeScript, where `getTypeAtLocation(node)` returns the
        // instance type.
        const type = checker.getTypeAtLocation(node.callee);

        if (!type || !isConstructType(type, checker) || !node.arguments.length) return;

        // NOTE: Only flag when inside a Construct/Stack class where `this` is available
        const enclosingClass = findEnclosingClass(node);
        if (!enclosingClass) return;
        const enclosingClassType = checker.getTypeAtLocation(enclosingClass);
        if (!enclosingClassType || !isConstructOrStackType(enclosingClassType, checker)) {
          return;
        }

        const argument = node.arguments[0];

        // NOTE: If the first argument is already `this`, it's valid
        if (argument.type === "ThisExpression") return;

        // FIXME: This should also skip when the construct's first constructor
        // parameter is not named "scope" (then passing a non-`this` value is valid):
        //   const constructorParamNames = getConstructorParamNames(type, checker);
        //   if (constructorParamNames[0] !== "scope") return;
        // But the type checker exposes constructor parameters only as opaque IDs
        // with no way to resolve their names, so for now we rely on the CDK
        // convention that the first parameter is always "scope".

        // NOTE: If `allowNonThisAndDisallowScope` is false, require `this` for all cases
        if (!options.allowNonThisAndDisallowScope) {
          context.report({
            node: argument,
            messageId: "missingPassingThis",
            fix: (fixer) => {
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
            fix: (fixer) => {
              return fixer.replaceText(argument, "this");
            },
          });
        }
      },
    };
  },
});
