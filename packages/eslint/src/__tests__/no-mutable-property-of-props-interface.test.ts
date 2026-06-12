import { RuleTester } from "@typescript-eslint/rule-tester";

import { noMutablePropertyOfPropsInterface } from "../rules/no-mutable-property-of-props-interface";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts*"],
      },
    },
  },
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
  ],
});
