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
    {
      code: `
          class Construct {}
          class TestClass extends Construct {
            public readonly inferred = 0;
          }
        `,
    },
    {
      code: `
          class Construct {}
          class DependencyClass extends Construct {}
          class TestClass extends Construct {
            constructor(scope: Construct, id: string, public readonly test: DependencyClass = undefined!) {
              super(scope, id);
            }
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
    {
      code: `
          class Construct {}
          class TestClass extends Construct {
            public config: { a: string; b: number } = { a: "x", b: 1 };
          }
        `,
      errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      output: `
          class Construct {}
          class TestClass extends Construct {
            public readonly config: { a: string; b: number } = { a: "x", b: 1 };
          }
        `,
    },
    {
      code: `
          class Construct {}
          class TestClass extends Construct {
            public static defaultName: string = "sample";
          }
        `,
      errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      output: `
          class Construct {}
          class TestClass extends Construct {
            public static readonly defaultName: string = "sample";
          }
        `,
    },
    {
      code: `
          class Construct {}
          class TestClass extends Construct {
            public inferred = 0;
          }
        `,
      errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      output: `
          class Construct {}
          class TestClass extends Construct {
            public readonly inferred = 0;
          }
        `,
    },
    {
      code: `
          class Construct {}
          class TestClass extends Construct {
            constructor(scope: Construct, id: string, public count) {
              super(scope, id);
            }
          }
        `,
      errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      output: `
          class Construct {}
          class TestClass extends Construct {
            constructor(scope: Construct, id: string, public readonly count) {
              super(scope, id);
            }
          }
        `,
    },
    {
      code: `
          class Construct {}
          class DependencyClass extends Construct {}
          class TestClass extends Construct {
            constructor(scope: Construct, id: string, public test: DependencyClass = undefined!) {
              super(scope, id);
            }
          }
        `,
      errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      output: `
          class Construct {}
          class DependencyClass extends Construct {}
          class TestClass extends Construct {
            constructor(scope: Construct, id: string, public readonly test: DependencyClass = undefined!) {
              super(scope, id);
            }
          }
        `,
    },
  ],
});
