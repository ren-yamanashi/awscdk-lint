import { requirePropsDefaultDoc } from "../rules/require-props-default-doc";
import { createRuleTester } from "./create-rule-tester";

const ruleTester = createRuleTester();

ruleTester.run("require-props-default-doc", requirePropsDefaultDoc, {
  valid: [
    {
      // WHEN: Optional property has @default JSDoc in Props interface
      code: `
        interface MyConstructProps {
          /**
           * @default undefined
           */
          optional?: number;
        }
      `,
    },
    {
      // WHEN: Optional property is in a class
      code: `
        class Example {
          optional?: string;
        }
      `,
    },
    {
      // WHEN: Optional property is in a non-Props interface
      code: `
        interface Config {
          optional?: number;
        }
      `,
    },
    {
      // WHEN: Optional property with JSDoc is in a non-Props interface
      code: `
        interface Config {
          /** Some description */
          optional?: string;
        }
      `,
    },
  ],
  invalid: [
    {
      // WHEN: Optional property has no JSDoc in Props interface
      code: `
        interface MyConstructProps {
          optional?: number;
        }
      `,
      errors: [
        {
          messageId: "missingDefaultDoc",
          data: { propertyName: "optional" },
        },
      ],
    },
    {
      // WHEN: Optional property has no @default JSDoc in Props interface
      code: `
        interface StackProps {
          /** Some description */
          optional?: string;
        }
      `,
      errors: [
        {
          messageId: "missingDefaultDoc",
          data: { propertyName: "optional" },
        },
      ],
    },
  ],
});
