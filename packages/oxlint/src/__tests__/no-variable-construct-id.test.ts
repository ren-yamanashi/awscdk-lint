import { RuleTester } from "corsa-oxlint";

import { noVariableConstructId } from "../rules/no-variable-construct-id";

const ruleTester = new RuleTester({
  languageOptions: { sourceType: "module" },
});

ruleTester.run("no-variable-construct-id", noVariableConstructId, {
  valid: [
    {
      code: `
      class Construct {}
      class TargetConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class SampleConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          new TargetConstruct(this, "SampleId");
        }
      }
      `,
    },
    {
      code: `
      class Construct {}
      class TargetConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class SampleConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          new TargetConstruct(this, \`SampleId\`);
        }
      }
      `,
    },
    {
      code: `
      class Construct {}
      class TargetConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class SampleConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          const items = ['a', 'b', 'c'];
          for (const item of items) {
            new TargetConstruct(this, item);
          }
        }
      }
    `,
    },
    {
      code: `
      class Construct {}
      class TargetConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class SampleConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          const items = ['a', 'b', 'c'];
          while (items.length > 0) {
            new TargetConstruct(this, items.pop()!);
          }
        }
      }
    `,
    },
    {
      code: `
      class Construct {}
      class TargetConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class SampleConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          const items = ['a', 'b', 'c'];
          items.forEach(item => {
            new TargetConstruct(this, item);
          });
        }
      }
    `,
    },
    {
      code: `
      class Construct {}
      class TargetConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class SampleConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          const items = ['a', 'b', 'c'];
          items.map(item => {
            new TargetConstruct(this, item);
            return item;
          });
        }
      }
    `,
    },
    {
      code: `
      class Construct {}
      class TargetConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class SampleConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          this.myMethod('id', 1);
          this.myMethod('id', 2);
          ['a', 'b', 'c'].map(item => this.myMethod(item, 3));
        }
        myMethod(id: string, num: number) {
          return new TargetConstruct(this, id + num);
        }
      }
    `,
    },
    {
      code: `
      class Construct {}
      class TargetConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class SampleConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          const myArrowFunction = (id: string, num: number) => {
            return new TargetConstruct(this, id + num);
          };
          myArrowFunction('id', 1);
          myArrowFunction('id', 2);
          ['a', 'b', 'c'].map(item => myArrowFunction(item, 3));
        }
      }
    `,
    },
    {
      code: `
      class Construct {}
      class TargetConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class SampleConstruct extends Construct {
        myArrowFunction = (id: string, num: number) => {
          return new TargetConstruct(this, id + num);
        };
        constructor(scope: Construct, id: string) {
          super(scope, id);
          this.myArrowFunction('id', 1);
          this.myArrowFunction('id', 2);
          ['a', 'b', 'c'].map(item => this.myArrowFunction(item, 3));
        }
      }
    `,
    },
    {
      code: `
      class Construct {}
      class TargetConstruct extends Construct {
        constructor(scope: Construct, validId: string) {
          super(scope, validId);
        }
      }
      class SampleConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          new TargetConstruct(this, id);
        }
      }
      `,
    },
    {
      code: `
      class Construct {}
      class TargetConstruct {
        constructor(scope: Construct, id: string) {}
      }
      class SampleConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          new TargetConstruct(this, id);
        }
      }
      `,
    },
    {
      code: `
      class Construct {}
      class TargetConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      function createResource(scope: Construct, id: string) {
        new TargetConstruct(scope, id);
      }
      `,
    },
    {
      code: `
      class Construct {}
      class TargetConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class NotAConstruct {
        create(scope: Construct, id: string) {
          new TargetConstruct(scope, id);
        }
      }
      `,
    },
  ],
  invalid: [
    {
      code: `
      class Construct {}
      class TargetConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class SampleConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          new TargetConstruct(this, id);
        }
      }
      `,
      errors: [{ messageId: "invalidConstructId" }],
    },
    {
      code: `
      class Construct {}
      class TargetConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class SampleConstruct extends Construct {
        constructor(scope: Construct, id: string, props: { name: string}) {
          super(scope, id);
          new TargetConstruct(this, props.name);
        }
      }
      `,
      errors: [{ messageId: "invalidConstructId" }],
    },
    {
      code: [
        "class Construct {}",
        "class TargetConstruct extends Construct {",
        "  constructor(scope: Construct, id: string) {",
        "    super(scope, id);",
        "  }",
        "}",
        "class SampleConstruct extends Construct {",
        "  constructor(scope: Construct, id: string) {",
        "    super(scope, id);",
        "    new TargetConstruct(this, `${id}Bucket`);",
        "  }",
        "}",
      ].join("\n"),
      errors: [{ messageId: "invalidConstructId" }],
    },
    {
      code: `
      class Construct {}
      class TargetConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class SampleConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          new TargetConstruct(this, id + "Bucket");
        }
      }
      `,
      errors: [{ messageId: "invalidConstructId" }],
    },
    {
      code: `
      const getId = () => "SampleId";
      class Construct {}
      class TargetConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class SampleConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          new TargetConstruct(this, getId());
        }
      }
      `,
      errors: [{ messageId: "invalidConstructId" }],
    },
    {
      code: `
      class Construct {}
      class TargetConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      const id = "OutsideId";
      const instance = new TargetConstruct(new Construct(), id);
      `,
      errors: [{ messageId: "invalidConstructId" }],
    },
  ],
});
