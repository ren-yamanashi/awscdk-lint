import { RuleTester } from "@typescript-eslint/rule-tester";

import { noParentNameConstructIdMatch } from "../rules/no-parent-name-construct-id-match";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts*"],
      },
    },
  },
});

ruleTester.run("no-parent-name-construct-id-match", noParentNameConstructIdMatch, {
  valid: [
    // WHEN: child id not same parent construct name
    {
      code: `
      class Construct {}
      class SampleConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class TestConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          new SampleConstruct(this, "ValidId");
        }
      }`,
    },
    // WHEN: child id not included parent construct name(typescript)
    {
      code: `
      class Construct {}
      class SampleConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class TestConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          new SampleConstruct(this, "Test-ValidId-Construct");
        }
      }`,
    },
    // WHEN: child id included parent construct name(typescript)
    //       and disallowContainingParentName is false
    {
      code: `
      class Construct {}
      class SampleConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class TestConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          new SampleConstruct(this, "SampleTestConstruct");
        }
      }`,
      options: [{ disallowContainingParentName: false }],
    },
    // WHEN: instantiating class does not extend Construct
    {
      code: `
      class Construct {}
      class SampleClass {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class TestConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          new SampleClass(scope, "TestConstruct");
        }
      }`,
    },
    // WHEN: parent class does not extend Construct
    {
      code: `
      class Construct {}
      class SampleClass extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class SampleConstruct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          new SampleClass(scope, "TestConstruct");
        }
      }`,
    },
  ],
  invalid: [
    // WHEN: child class inside constructor (expression statement)
    {
      code: `
      class Construct {}
      class SampleClass extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class TestClass extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          new SampleClass(scope, "TestClass");
        }
      }`,
      errors: [{ messageId: "invalidConstructId" }],
    },

    // WHEN: child class inside constructor (expression statement)
    //       and disallowContainingParentName is true
    {
      code: `
      class Construct {}
      class SampleClass extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class TestClass extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          new SampleClass(scope, "SampleTestClass");
        }
      }`,
      errors: [{ messageId: "invalidConstructId" }],
      options: [{ disallowContainingParentName: true }],
    },

    // WHEN: child class inside constructor (variable declaration)
    {
      code: `
      class Construct {}
      class SampleClass extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class TestClass extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          const test = new SampleClass(scope, "TestClass");
        }
      }`,
      errors: [{ messageId: "invalidConstructId" }],
    },
    // WHEN: child statement inside if statement inside constructor (expression statement)
    {
      code: `
      class Construct {}
      class SampleClass extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class TestClass extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          if (true) new SampleClass(scope, "TestClass");
        }
      }`,
      errors: [{ messageId: "invalidConstructId" }],
    },
    // WHEN: child statement inside if statement inside constructor (block statement)
    {
      code: `
      class Construct {}
      class SampleClass extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class TestClass extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          if (true) {
            new SampleClass(scope, "TestClass");
          }
        }
      }`,
      errors: [{ messageId: "invalidConstructId" }],
    },
    // WHEN: child statement inside if statement inside inside constructor (block statement / nested)
    {
      code: `
      class Construct {}
      class SampleClass extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class TestClass extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          if (true) {
            if (true) {
              new SampleClass(scope, "TestClass");
            }
          }
        }
      }`,
      errors: [{ messageId: "invalidConstructId" }],
    },
    // WHEN: child statement inside switch statement inside inside constructor (expression statement)
    {
      code: `
      class Construct {}
      class SampleClass extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class TestClass extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          switch (item.type) {
            case "test":
              const test = new SampleClass(scope, "TestClass");
              break;
          }
        }
      }`,
      errors: [{ messageId: "invalidConstructId" }],
    },
    // WHEN: child statement inside switch statement inside inside constructor (block statement)
    {
      code: `
      class Construct {}
      class SampleClass extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class TestClass extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          switch (item.type) {
            case "test": {
              const test = new SampleClass(scope, "TestClass");
              break;
            }
          }
        }
      }`,
      errors: [{ messageId: "invalidConstructId" }],
    },
    // WHEN: child statement inside switch statement inside inside constructor (block statement / nested)
    {
      code: `
      class Construct {}
      class SampleClass extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class TestClass extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          switch (item.type) {
            case "test": {
              switch (item.type) {
                case "test":
                  const test = new SampleClass(scope, "TestClass");
                  break;
              }
            }
          }
        }
      }`,
      errors: [{ messageId: "invalidConstructId" }],
    },
    // WHEN: in method
    {
      code: `
      class Construct {}
      class SampleClass extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class TestClass extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
        test() {
          new SampleClass(scope, "TestClass");
        }
      }`,
      errors: [{ messageId: "invalidConstructId" }],
    },
  ],
});
