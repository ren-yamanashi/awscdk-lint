import { RuleTester } from "@typescript-eslint/rule-tester";

import { requirePassingThis } from "../rules/require-passing-this";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts*"],
      },
    },
  },
});

ruleTester.run("require-passing-this", requirePassingThis, {
  valid: [
    // WHEN: passing `this` to a constructor
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
      }
      `,
    },
    // WHEN: instantiated class does not extend Construct
    {
      code: `
      class Construct {}
      class SampleConstruct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class TestConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          new SampleConstruct(scope, "ValidId");
        }
      }
      `,
    },
    // WHEN: property name is not `scope`
    {
      code: `
      class Construct {}
      class SampleConstruct extends Construct {
        constructor(validProperty: Construct, id: string) {
          super(validProperty, id);
        }
      }
      class TestConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          new SampleConstruct(scope, "ValidId");
        }
      }
      `,
    },
    // WHEN: new expression is inside a standalone function (no class context)
    {
      code: `
      class Construct {}
      class SampleConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      function createResource(scope: Construct, id: string) {
        new SampleConstruct(scope, id);
      }
      `,
    },
    // WHEN: new expression is inside an arrow function (no class context)
    {
      code: `
      class Construct {}
      class SampleConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      const createResource = (scope: Construct, id: string) => {
        new SampleConstruct(scope, id);
      };
      `,
    },
    // WHEN: new expression is inside a class that does not extend Construct
    {
      code: `
      class Construct {}
      class SampleConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class NotAConstruct {
        create(scope: Construct) {
          new SampleConstruct(scope, "Id");
        }
      }
      `,
    },
    // WHEN: allowNonThisAndDisallowScope is true and passing a non-scope variable
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
          const sample = new SampleConstruct(this, "Sample");
          new SampleConstruct(sample, "ValidId");
        }
      }
      `,
      options: [{ allowNonThisAndDisallowScope: true }],
    },
    // WHEN: subclass redeclares a constructor that does not follow (scope, id)
    {
      code: `
      class Construct {}
      class Target extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class Wrapped extends Target {
        constructor(config: { scope: Construct }) {
          super(config.scope, "Fixed");
        }
      }
      class TestConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          new Wrapped({ scope });
        }
      }
      `,
    },
  ],
  invalid: [
    // WHEN: passing 'scope' variable
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
          new SampleConstruct(scope, "ValidId");
        }
      }
      `,
      errors: [{ messageId: "missingPassingThis" }],
      output: `
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
      }
      `,
    },
    // WHEN: instantiated class inherits its constructor from a parent Construct
    {
      code: `
      class Construct {}
      class Target extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class Inherited extends Target {}
      class TestConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          new Inherited(scope, "X");
        }
      }
      `,
      errors: [{ messageId: "missingPassingThis" }],
      output: `
      class Construct {}
      class Target extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class Inherited extends Target {}
      class TestConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          new Inherited(this, "X");
        }
      }
      `,
    },
    // WHEN: allowNonThisAndDisallowScope is false and not passing `this`
    {
      options: [{ allowNonThisAndDisallowScope: false }],
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
          const otherVar = "test";
          new SampleConstruct(otherVar, "ValidId");
        }
      }
      `,
      errors: [{ messageId: "missingPassingThis" }],
      output: `
      class Construct {}
      class SampleConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class TestConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          const otherVar = "test";
          new SampleConstruct(this, "ValidId");
        }
      }
      `,
    },
  ],
});
