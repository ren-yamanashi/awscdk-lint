import { RuleTester } from "@typescript-eslint/rule-tester";

import { requireJSDoc } from "../rules/require-jsdoc";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts*"],
      },
    },
  },
});

ruleTester.run("require-jsdoc", requireJSDoc, {
  valid: [
    {
      // WHEN: Interface with JSDoc comments
      code: `
        interface TestProps {
          /**
           * Description for prop1
           */
          prop1: string;
          /** Description for prop2 */
          prop2: number;
        }
      `,
    },
    {
      // WHEN: Construct class with JSDoc comments
      code: `
        class Construct {}
        class TestConstruct extends Construct {
          /**
           * Description for prop1
           */
          public prop1: string;
          /** Description for prop2 */
          public prop2: number;
        }
      `,
    },
    {
      // WHEN: property is not public
      code: `
        class Construct {}
        class TestConstruct extends Construct {
          private prop3: string;
          protected prop4: number;
        }
      `,
    },
    {
      // WHEN: non-Construct class
      code: `
        class SampleConstruct {
          public prop1: string;
          private prop2: number;
        }
      `,
    },
    {
      // WHEN: public parameter property with a JSDoc comment
      code: `
        class Construct {}
        class TestConstruct extends Construct {
          constructor(
            scope: Construct,
            id: string,
            /**
             * Description for bucket
             */
            public readonly bucket: string,
          ) {
            super();
          }
        }
      `,
    },
    {
      // WHEN: parameter property is not public
      code: `
        class Construct {}
        class TestConstruct extends Construct {
          constructor(
            scope: Construct,
            id: string,
            private readonly bucket: string,
            protected readonly table: string,
          ) {
            super();
          }
        }
      `,
    },
    {
      // WHEN: constructor parameter is not a parameter property
      code: `
        class Construct {}
        class TestConstruct extends Construct {
          constructor(scope: Construct, id: string, bucket: string) {
            super();
          }
        }
      `,
    },
    {
      // WHEN: parameter property of a non-Construct class
      code: `
        class SampleConstruct {
          constructor(public readonly bucket: string) {}
        }
      `,
    },
  ],
  invalid: [
    {
      // WHEN: interface without JSDoc comments
      code: `
        interface TestProps {
          prop1: string;
        }
      `,
      errors: [
        {
          messageId: "missingJSDoc",
          data: { propertyName: "prop1" },
        },
      ],
    },
    {
      // WHEN: public property in Construct class without JSDoc comments
      code: `
        class Construct {}
        class TestConstruct extends Construct {
          public prop1: string;
          prop2: string;
        }
      `,
      errors: [
        {
          messageId: "missingJSDoc",
          data: { propertyName: "prop1" },
        },
        {
          messageId: "missingJSDoc",
          data: { propertyName: "prop2" },
        },
      ],
    },
    {
      // WHEN: only a non-JSDoc block comment precedes the property
      code: `
        interface TestProps {
          /* not a jsdoc */
          prop1: string;
        }
      `,
      errors: [
        {
          messageId: "missingJSDoc",
          data: { propertyName: "prop1" },
        },
      ],
    },
    {
      // WHEN: JSDoc is a trailing comment on the previous property line
      // (comment attributes to neither `first` nor `second` because it starts
      // on the same line as `first` and precedes only `second`).
      code: `
        interface TestProps {
          first: string; /** doc for first */
          second: string;
        }
      `,
      errors: [
        {
          messageId: "missingJSDoc",
          data: { propertyName: "first" },
        },
        {
          messageId: "missingJSDoc",
          data: { propertyName: "second" },
        },
      ],
    },
    {
      // WHEN: quoted key without documentation
      code: `
        interface TestProps {
          "bucket-name": string;
        }
      `,
      errors: [
        {
          messageId: "missingJSDoc",
          data: { propertyName: "bucket-name" },
        },
      ],
    },
    {
      // WHEN: public parameter property without JSDoc comments
      code: `
        class Construct {}
        class TestConstruct extends Construct {
          constructor(
            scope: Construct,
            id: string,
            public readonly bucket: string,
            readonly table: string,
          ) {
            super();
          }
        }
      `,
      errors: [
        {
          messageId: "missingJSDoc",
          data: { propertyName: "bucket" },
        },
        {
          messageId: "missingJSDoc",
          data: { propertyName: "table" },
        },
      ],
    },
    {
      // WHEN: public parameter property with a default value and without JSDoc comments
      code: `
        class Construct {}
        class TestConstruct extends Construct {
          constructor(
            scope: Construct,
            id: string,
            public readonly bucket: string = "sample",
          ) {
            super();
          }
        }
      `,
      errors: [
        {
          messageId: "missingJSDoc",
          data: { propertyName: "bucket" },
        },
      ],
    },
  ],
});
