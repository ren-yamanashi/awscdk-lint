import { RuleTester } from "corsa-oxlint";

import { requirePropsDefaultDoc } from "../rules/require-props-default-doc";

const ruleTester = new RuleTester({
  languageOptions: { sourceType: "module" },
});

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
    {
      // WHEN: @default appears at the end of a JSDoc line
      code: `
        interface MyConstructProps {
          /** the last line is @default */
          optional?: number;
        }
      `,
    },
    {
      // WHEN: Optional property has a computed identifier key
      code: `
        const nameKey = "name";
        interface MyConstructProps {
          [nameKey]?: string;
        }
      `,
    },
    {
      // WHEN: Optional property has a computed string literal key
      code: `
        interface MyConstructProps {
          ["bucket-name"]?: string;
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
    {
      // WHEN: JSDoc contains an unrelated substring that happens to include "@default"
      code: `
        interface MyConstructProps {
          /** Contact no-reply@defaultmail.com if needed */
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
    {
      // WHEN: Non-JSDoc block comment (starts with "/*" not "/**") mentions @default
      code: `
        interface MyConstructProps {
          /* * @default 1 */
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
      // WHEN: @default appears in a trailing comment on the previous property line
      code: `
        interface MyConstructProps {
          first?: number; /** @default 2 */
          second?: number;
        }
      `,
      errors: [
        {
          messageId: "missingDefaultDoc",
          data: { propertyName: "first" },
        },
        {
          messageId: "missingDefaultDoc",
          data: { propertyName: "second" },
        },
      ],
    },
    {
      // WHEN: Optional property has quoted key without documentation
      code: `
        interface MyConstructProps {
          "bucket-name"?: string;
        }
      `,
      errors: [
        {
          messageId: "missingDefaultDoc",
          data: { propertyName: "bucket-name" },
        },
      ],
    },
    {
      // WHEN: Optional property has numeric literal key without documentation
      code: `
        interface MyConstructProps {
          1?: string;
        }
      `,
      errors: [
        {
          messageId: "missingDefaultDoc",
          data: { propertyName: "1" },
        },
      ],
    },
  ],
});
