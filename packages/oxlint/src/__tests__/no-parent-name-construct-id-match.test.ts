import { RuleTester } from "corsa-oxlint";

import { noParentNameConstructIdMatch } from "../rules/no-parent-name-construct-id-match";

const ruleTester = new RuleTester({
  languageOptions: { sourceType: "module" },
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
        constructor(scope: Construct, id: string) {}
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
          new SampleClass(scope, "TestConstruct");
        }
      }`,
    },
  ],
  invalid: [
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
          new SampleClass(this, "TestClass");
        }
      }`,
      errors: [{ messageId: "invalidConstructId" }],
    },
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
    // WHEN: child assigned to `this` field (assignment expression)
    {
      code: `
      class Construct {}
      class SampleClass extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class TestClass extends Construct {
        public sample!: SampleClass;
        constructor(scope: Construct, id: string) {
          super(scope, id);
          this.sample = new SampleClass(scope, "TestClass");
        }
      }`,
      errors: [{ messageId: "invalidConstructId" }],
    },
    // WHEN: child statement inside else branch of if
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
          if (false) {
            // no-op
          } else {
            new SampleClass(scope, "TestClass");
          }
        }
      }`,
      errors: [{ messageId: "invalidConstructId" }],
    },
    // WHEN: child statement inside for-of loop body
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
          for (const item of [1, 2, 3]) {
            new SampleClass(scope, "TestClass");
          }
        }
      }`,
      errors: [{ messageId: "invalidConstructId" }],
    },
    // WHEN: child appears in a second declarator of a VariableDeclaration
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
          const a = "x", b = new SampleClass(scope, "TestClass");
        }
      }`,
      errors: [{ messageId: "invalidConstructId" }],
    },
  ],
});
