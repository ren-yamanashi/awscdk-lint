import { RuleTester } from "corsa-oxlint";

import { noMutablePropertyOfPropsInterface } from "../rules/no-mutable-property-of-props-interface";

const ruleTester = new RuleTester({
  languageOptions: { sourceType: "module" },
});

ruleTester.run("no-mutable-property-of-props-interface", noMutablePropertyOfPropsInterface, {
  valid: [
    // WHEN: All properties are readonly
    {
      code: `
        interface TestProps {
          readonly name: string;
          readonly age: number;
        }
      `,
    },
    // WHEN: Interface name does not end with "Props"
    {
      code: `
        interface Test {
          name: string;
          age: number;
        }
      `,
    },
    // WHEN: Optional properties are readonly
    {
      code: `
        interface UserProps {
          readonly name?: string;
          readonly age?: number;
        }
      `,
    },
    // WHEN: Quoted property keys are readonly
    {
      code: `
        interface QuotedKeyProps {
          readonly "bucket-name": string;
          readonly "table-arn"?: string;
        }
      `,
    },
    // WHEN: Computed identifier key (the property name is not the key source text)
    {
      code: `
        const nameKey = "name";
        interface ComputedKeyProps {
          [nameKey]: string;
        }
      `,
    },
    // WHEN: Computed string literal key
    {
      code: `
        interface ComputedKeyProps {
          ["bucket-name"]: string;
        }
      `,
    },
  ],
  invalid: [
    // WHEN: readonly is not set
    {
      code: `
        interface TestProps {
          name: string;
          age: number;
        }
      `,
      output: `
        interface TestProps {
          readonly name: string;
          readonly age: number;
        }
      `,
      errors: [
        { messageId: "invalidPropertyOfPropsInterface" },
        { messageId: "invalidPropertyOfPropsInterface" },
      ],
    },
    // WHEN: Some properties do not have readonly
    {
      code: `
        interface UserProps {
          readonly name: string;
          age: number;
        }
      `,
      output: `
        interface UserProps {
          readonly name: string;
          readonly age: number;
        }
      `,
      errors: [{ messageId: "invalidPropertyOfPropsInterface" }],
    },
    // WHEN: Optional properties do not have readonly
    {
      code: `
        interface ConfigProps {
          name?: string;
          age?: number;
        }
      `,
      output: `
        interface ConfigProps {
          readonly name?: string;
          readonly age?: number;
        }
      `,
      errors: [
        { messageId: "invalidPropertyOfPropsInterface" },
        { messageId: "invalidPropertyOfPropsInterface" },
      ],
    },
    // WHEN: Quoted property keys do not have readonly
    {
      code: `
        interface QuotedKeyProps {
          "bucket-name": string;
          "table-arn"?: string;
        }
      `,
      output: `
        interface QuotedKeyProps {
          readonly "bucket-name": string;
          readonly "table-arn"?: string;
        }
      `,
      errors: [
        { messageId: "invalidPropertyOfPropsInterface" },
        { messageId: "invalidPropertyOfPropsInterface" },
      ],
    },
    // WHEN: Numeric literal property key does not have readonly
    {
      code: `
        interface NumericKeyProps {
          1: string;
        }
      `,
      output: `
        interface NumericKeyProps {
          readonly 1: string;
        }
      `,
      errors: [
        {
          messageId: "invalidPropertyOfPropsInterface",
          data: { propertyName: "1" },
        },
      ],
    },
  ],
});
