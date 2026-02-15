import { RuleTester } from "@typescript-eslint/rule-tester";

import { noMutablePublicPropertyOfConstruct } from "../rules/no-mutable-public-property-of-construct";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts*"],
      },
    },
  },
});

ruleTester.run("no-mutable-public-property-of-construct", noMutablePublicPropertyOfConstruct, {
  valid: [
    // WHEN: readonly field type is primitive
    {
      code: `
          class Construct {}
          class TestClass extends Construct {
            public readonly test: string;
          }
        `,
    },
    // WHEN: field is private
    {
      code: `
          class Construct {}
          class DependencyClass extends Construct {}
          class TestClass extends Construct {
            private test: DependencyClass;
          }
        `,
    },
    // WHEN: field is protected
    {
      code: `
          class Construct {}
          class DependencyClass extends Construct {}
          class TestClass extends Construct {
            protected test: DependencyClass;
          }
        `,
    },
    // WHEN: constructor parameter property is mutable
    {
      code: `
          class Construct {}
          class DependencyClass extends Construct {}
          class TestClass extends Construct {
            constructor(test: DependencyClass) {}
          }
        `,
    },
    // WHEN: superClass is not Construct or Stack
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
    // WHEN: public field is mutable, nested superClass is Construct
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
    // WHEN: public field is mutable, superClass is Construct
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
    // WHEN: public field is mutable, superClass is Stack
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
    // WHEN: public field is mutable, `public` is omitted, superClass is Construct
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
