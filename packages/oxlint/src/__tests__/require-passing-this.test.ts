import { RuleTester } from "corsa-oxlint";

import { requirePassingThis } from "../rules/require-passing-this";

const ruleTester = new RuleTester({
  languageOptions: { sourceType: "module" },
});

ruleTester.run("require-passing-this", requirePassingThis, {
  valid: [
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
    {
      code: `
      class Construct {}
      class SampleConstruct {
        constructor(scope: Construct, id: string) {}
      }
      class TestConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          new SampleConstruct(scope, "ValidId");
        }
      }
      `,
    },
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
  ],
  invalid: [
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
