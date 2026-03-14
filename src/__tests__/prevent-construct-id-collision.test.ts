import { RuleTester } from "@typescript-eslint/rule-tester";

import { preventConstructIdCollision } from "../rules/prevent-construct-id-collision";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts*"],
      },
    },
  },
});

ruleTester.run("prevent-construct-id-collision", preventConstructIdCollision, {
  valid: [
    // WHEN: Construct ID is a literal outside of a loop
    {
      name: "literal ID outside of loop is valid",
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class MyConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          new Bucket(this, "MyBucket");
        }
      }
      `,
    },
    // WHEN: Construct ID is a variable inside a forEach loop
    {
      name: "variable ID in forEach is valid",
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class MyConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          ["Id1", "Id2", "Id3"].forEach((item) => new Bucket(this, item));
        }
      }
      `,
    },
    // WHEN: Construct ID is a variable inside a map
    {
      name: "variable ID in map is valid",
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class MyConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          ["Id1", "Id2", "Id3"].map((item) => new Bucket(this, item));
        }
      }
      `,
    },
    // WHEN: Construct ID is a variable inside a for...of loop
    {
      name: "variable ID in for...of is valid",
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class MyConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          const items = ["a", "b", "c"];
          for (const item of items) {
            new Bucket(this, item);
          }
        }
      }
      `,
    },
    // WHEN: Construct ID is a variable inside a for loop
    {
      name: "variable ID in for loop is valid",
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class MyConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          const items = ["a", "b", "c"];
          for (let i = 0; i < items.length; i++) {
            new Bucket(this, items[i]);
          }
        }
      }
      `,
    },
    // WHEN: Construct ID is a template literal with expressions inside a loop
    {
      name: "template literal with expressions in forEach is valid",
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class MyConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          ["Id1", "Id2", "Id3"].forEach((item) => new Bucket(this, \`\${item}Bucket\`));
        }
      }
      `,
    },
    // WHEN: Construct ID is a variable inside a while loop
    {
      name: "variable ID in while loop is valid",
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class MyConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          const items = ["a", "b", "c"];
          while (items.length > 0) {
            new Bucket(this, items.pop()!);
          }
        }
      }
      `,
    },
    // WHEN: Class does not extend Construct
    {
      name: "non-Construct class in loop is valid",
      code: `
      class Construct {}
      class NotConstruct {
        constructor(scope: Construct, id: string) {}
      }
      class MyConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          [1, 2, 3].forEach(() => new NotConstruct(this, "SameId"));
        }
      }
      `,
    },
    // WHEN: Constructor parameter name is not "id"
    {
      name: "non-id parameter name in loop is valid",
      code: `
      class Construct {}
      class TargetConstruct extends Construct {
        constructor(scope: Construct, validId: string) {
          super(scope, validId);
        }
      }
      class MyConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          [1, 2, 3].forEach(() => new TargetConstruct(this, "SameId"));
        }
      }
      `,
    },
    // WHEN: Literal ID inside an arrow function assigned to a variable (not an iteration callback)
    {
      name: "literal ID in non-iteration arrow function is valid",
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class MyConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          const createBucket = () => new Bucket(this, "MyBucket");
          createBucket();
        }
      }
      `,
    },
    // WHEN: Literal ID inside a class method (not a loop)
    {
      name: "literal ID in class method is valid",
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class MyConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
        createBucket() {
          return new Bucket(this, "MyBucket");
        }
      }
      `,
    },
    // WHEN: Construct ID uses a function expression callback in iteration (with variable)
    {
      name: "variable ID in forEach with function expression is valid",
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class MyConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          ["Id1", "Id2"].forEach(function(item) { new Bucket(this, item); });
        }
      }
      `,
    },
    // WHEN: Less than 2 arguments
    {
      name: "less than 2 arguments is valid",
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class MyConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          [1, 2, 3].forEach(() => new Bucket(this));
        }
      }
      `,
    },
  ],
  invalid: [
    // WHEN: Literal ID inside forEach
    {
      name: "literal ID in forEach is invalid",
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class MyConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          [1, 2, 3].forEach(() => new Bucket(this, "Bucket"));
        }
      }
      `,
      errors: [{ messageId: "preventConstructIdCollision", data: { constructId: "Bucket" } }],
    },
    // WHEN: Literal ID inside map
    {
      name: "literal ID in map is invalid",
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class MyConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          [1, 2, 3].map(() => new Bucket(this, "Bucket"));
        }
      }
      `,
      errors: [{ messageId: "preventConstructIdCollision", data: { constructId: "Bucket" } }],
    },
    // WHEN: Literal ID inside for...of loop
    {
      name: "literal ID in for...of is invalid",
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class MyConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          const items = [1, 2, 3];
          for (const item of items) {
            new Bucket(this, "Bucket");
          }
        }
      }
      `,
      errors: [{ messageId: "preventConstructIdCollision", data: { constructId: "Bucket" } }],
    },
    // WHEN: Literal ID inside for...in loop
    {
      name: "literal ID in for...in is invalid",
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class MyConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          const obj = { a: 1, b: 2 };
          for (const key in obj) {
            new Bucket(this, "Bucket");
          }
        }
      }
      `,
      errors: [{ messageId: "preventConstructIdCollision", data: { constructId: "Bucket" } }],
    },
    // WHEN: Literal ID inside for loop
    {
      name: "literal ID in for loop is invalid",
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class MyConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          for (let i = 0; i < 3; i++) {
            new Bucket(this, "Bucket");
          }
        }
      }
      `,
      errors: [{ messageId: "preventConstructIdCollision", data: { constructId: "Bucket" } }],
    },
    // WHEN: Literal ID inside while loop
    {
      name: "literal ID in while loop is invalid",
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class MyConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          let i = 0;
          while (i < 3) {
            new Bucket(this, "Bucket");
            i++;
          }
        }
      }
      `,
      errors: [{ messageId: "preventConstructIdCollision", data: { constructId: "Bucket" } }],
    },
    // WHEN: Literal ID inside do...while loop
    {
      name: "literal ID in do...while loop is invalid",
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class MyConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          let i = 0;
          do {
            new Bucket(this, "Bucket");
            i++;
          } while (i < 3);
        }
      }
      `,
      errors: [{ messageId: "preventConstructIdCollision", data: { constructId: "Bucket" } }],
    },
    // WHEN: Template literal without expressions inside forEach
    {
      name: "template literal without expressions in forEach is invalid",
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class MyConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          [1, 2, 3].forEach(() => new Bucket(this, \`Bucket\`));
        }
      }
      `,
      errors: [{ messageId: "preventConstructIdCollision", data: { constructId: "Bucket" } }],
    },
    // WHEN: Literal ID inside flatMap
    {
      name: "literal ID in flatMap is invalid",
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class MyConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          [[1], [2]].flatMap(() => [new Bucket(this, "Bucket")]);
        }
      }
      `,
      errors: [{ messageId: "preventConstructIdCollision", data: { constructId: "Bucket" } }],
    },
    // WHEN: Literal ID inside reduce
    {
      name: "literal ID in reduce is invalid",
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class MyConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          [1, 2, 3].reduce((acc, item) => { new Bucket(this, "Bucket"); return acc; }, []);
        }
      }
      `,
      errors: [{ messageId: "preventConstructIdCollision", data: { constructId: "Bucket" } }],
    },
    // WHEN: Literal ID inside function expression callback in forEach
    {
      name: "literal ID in forEach with function expression is invalid",
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class MyConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          [1, 2, 3].forEach(function() { new Bucket(this, "Bucket"); });
        }
      }
      `,
      errors: [{ messageId: "preventConstructIdCollision", data: { constructId: "Bucket" } }],
    },
    // WHEN: Literal ID inside nested loop (forEach inside for)
    {
      name: "literal ID in nested loop is invalid",
      code: `
      class Construct {}
      class Bucket extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      class MyConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
          for (let i = 0; i < 3; i++) {
            [1, 2, 3].forEach(() => new Bucket(this, "Bucket"));
          }
        }
      }
      `,
      errors: [{ messageId: "preventConstructIdCollision", data: { constructId: "Bucket" } }],
    },
  ],
});
