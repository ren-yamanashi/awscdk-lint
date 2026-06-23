import { RuleTester } from "corsa-oxlint";

import { preventConstructIdCollision } from "../rules/prevent-construct-id-collision";

const ruleTester = new RuleTester({
  languageOptions: { sourceType: "module" },
});

ruleTester.run("prevent-construct-id-collision", preventConstructIdCollision, {
  valid: [
    {
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
    {
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
    {
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
    {
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
    {
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
    {
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
    {
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
    {
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
  ],
  invalid: [
    {
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
    {
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
    {
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
    {
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
    {
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
  ],
});
