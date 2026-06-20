import { RuleTester } from "corsa-oxlint";

import { noMutablePublicPropertyOfConstruct } from "../rules/no-mutable-public-property-of-construct";

const ruleTester = new RuleTester({
  languageOptions: { sourceType: "module" },
});

ruleTester.run("no-mutable-public-property-of-construct", noMutablePublicPropertyOfConstruct, {
  valid: [
    {
      code: `
          class Construct {}
          class TestClass extends Construct {
            public readonly test: string;
          }
        `,
    },
    {
      code: `
          class Construct {}
          class DependencyClass extends Construct {}
          class TestClass extends Construct {
            private test: DependencyClass;
          }
        `,
    },
    {
      code: `
          class Construct {}
          class DependencyClass extends Construct {}
          class TestClass extends Construct {
            protected test: DependencyClass;
          }
        `,
    },
    {
      code: `
          class Construct {}
          class DependencyClass extends Construct {}
          class TestClass extends Construct {
            constructor(test: DependencyClass) {}
          }
        `,
    },
    {
      code: `
          class DependencyClass {}
          class TestClass extends DependencyClass {
            public test: DependencyClass;
          }
        `,
    },
    {
      code: `
          class Construct {}
          class DependencyClass extends Construct {}
          class SampleConstruct {
            public test: DependencyClass;
          }
        `,
    },
  ],
  invalid: [
    {
      code: `
          class Construct {}
          class DependencyClass extends Construct {}
          class SampleConstruct extends Construct {}
          class TestClass extends SampleConstruct {
            public test: DependencyClass;
          }
        `,
      errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      output: `
          class Construct {}
          class DependencyClass extends Construct {}
          class SampleConstruct extends Construct {}
          class TestClass extends SampleConstruct {
            public readonly test: DependencyClass;
          }
        `,
    },
    {
      code: `
          class Construct {}
          class DependencyClass extends Construct {}
          class TestClass extends Construct {
            public test: DependencyClass;
          }
        `,
      errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      output: `
          class Construct {}
          class DependencyClass extends Construct {}
          class TestClass extends Construct {
            public readonly test: DependencyClass;
          }
        `,
    },
    {
      code: `
          class Stack {}
          class Construct {}
          class DependencyClass extends Construct {}
          class TestClass extends Stack {
            public test: DependencyClass;
          }
        `,
      errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      output: `
          class Stack {}
          class Construct {}
          class DependencyClass extends Construct {}
          class TestClass extends Stack {
            public readonly test: DependencyClass;
          }
        `,
    },
    {
      code: `
          class Construct {}
          class TestClass extends Construct {
            test: string;
          }
        `,
      errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      output: `
          class Construct {}
          class TestClass extends Construct {
            readonly test: string;
          }
        `,
    },
  ],
});
