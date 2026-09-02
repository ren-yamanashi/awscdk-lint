import { RuleTester } from "corsa-oxlint";

import { pascalCaseConstructId } from "../rules/pascal-case-construct-id";

const ruleTester = new RuleTester({
  languageOptions: { sourceType: "module" },
});

ruleTester.run("pascal-case-construct-id", pascalCaseConstructId, {
  valid: [
    {
      code: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      const test = new TestClass('test');
      `,
    },
    {
      code: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      const test = new TestClass('test', {sample: 'sample'});`,
    },
    {
      code: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      const test = new TestClass('test', ['sample']);`,
    },
    {
      code: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      const test = new TestClass('test', 1);
      `,
    },
    {
      code: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      const test = new TestClass('test', 'ValidId');`,
    },
    {
      code: `
      class SampleConstruct {
        constructor(public id: string) {}
      }
      const test = new SampleConstruct('test', 'ValidId');`,
    },
    {
      code: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, validId: string) {
          super(props, validId);
        }
      }
      const test = new TestClass("test", "invalid_id");`,
    },
    {
      code: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      const test = new TestClass('test', \`ValidId\`);`,
    },
    {
      code: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      const suffix = 'x';
      const test = new TestClass('test', \`bucket-\${suffix}\`);`,
    },
  ],
  invalid: [
    {
      code: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      const test = new TestClass("test", "invalid_id");`,
      errors: [{ messageId: "invalidConstructId" }],
      output: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      const test = new TestClass("test", "InvalidId");`,
    },
    {
      code: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      const test = new TestClass('test', 'invalidId');`,
      errors: [{ messageId: "invalidConstructId" }],
      output: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      const test = new TestClass('test', 'InvalidId');`,
    },
    {
      code: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      const test = new TestClass('test', \`template_bucket\`);`,
      errors: [{ messageId: "invalidConstructId" }],
      output: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      const test = new TestClass('test', \`TemplateBucket\`);`,
    },
    {
      code: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      const test = new TestClass('test', "my.bucket");`,
      errors: [{ messageId: "invalidConstructId" }],
      output: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      const test = new TestClass('test', "MyBucket");`,
    },
    {
      code: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      const test = new TestClass('test', "123bucket");`,
      errors: [{ messageId: "invalidConstructId" }],
      output: null,
    },
    {
      code: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      class ParentConstruct extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
          new TestClass(props, "Logs");
          new TestClass(props, "logs");
        }
      }`,
      errors: [{ messageId: "invalidConstructId" }],
      output: null,
    },
    {
      code: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      class ParentConstruct extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
          new TestClass(props, "myBucket");
          new TestClass(props, "my_bucket");
          new TestClass(props, "my-bucket");
          new TestClass(props, "my bucket");
          new TestClass(props, "my.bucket");
        }
      }`,
      errors: [
        { messageId: "invalidConstructId" },
        { messageId: "invalidConstructId" },
        { messageId: "invalidConstructId" },
        { messageId: "invalidConstructId" },
        { messageId: "invalidConstructId" },
      ],
      output: null,
    },
    {
      code: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      class ParentConstruct extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
          new TestClass(props, "my-bucket");
        }
      }`,
      errors: [{ messageId: "invalidConstructId" }],
      output: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      class ParentConstruct extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
          new TestClass(props, "MyBucket");
        }
      }`,
    },
    {
      code: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      class FirstConstruct extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
          new TestClass(props, "my-bucket");
        }
      }
      class SecondConstruct extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
          new TestClass(props, "my_bucket");
        }
      }`,
      errors: [{ messageId: "invalidConstructId" }, { messageId: "invalidConstructId" }],
      output: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      class FirstConstruct extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
          new TestClass(props, "MyBucket");
        }
      }
      class SecondConstruct extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
          new TestClass(props, "MyBucket");
        }
      }`,
    },
    {
      code: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      class ParentConstruct extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
          new TestClass(props, "Logs");
          ["a"].forEach(() => {
            new TestClass(props, "logs");
          });
        }
      }`,
      errors: [{ messageId: "invalidConstructId" }],
      output: null,
    },
    {
      code: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      class ParentConstruct extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
          new TestClass(props, "logs");
          ["a"].forEach(() => {
            new TestClass(props, "Logs");
          });
        }
      }`,
      errors: [{ messageId: "invalidConstructId" }],
      output: null,
    },
    {
      code: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      class ParentConstruct extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
          new TestClass(props, "Logs");
          ["a"].forEach(function () {
            new TestClass(props, "logs");
          });
        }
      }`,
      errors: [{ messageId: "invalidConstructId" }],
      output: null,
    },
    {
      code: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      class ParentConstruct extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
          new TestClass(props, "logs");
          ["a"].forEach(function () {
            new TestClass(props, "Logs");
          });
        }
      }`,
      errors: [{ messageId: "invalidConstructId" }],
      output: null,
    },
    {
      code: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      class ParentConstruct extends Construct {
        private readonly logs = new TestClass(undefined, "Logs");
        constructor(props: any, id: string) {
          super(props, id);
          new TestClass(props, "logs");
        }
      }`,
      errors: [{ messageId: "invalidConstructId" }],
      output: null,
    },
    {
      code: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      class NotAConstruct {
        constructor(name: string, label: string) {}
      }
      class ParentConstruct extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
          new NotAConstruct("x", "Logs");
          new TestClass(props, "logs");
        }
      }`,
      errors: [{ messageId: "invalidConstructId" }],
      output: null,
    },
    {
      code: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      class ParentConstruct extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
          ["a"].forEach(() => {
            new TestClass(props, "my-bucket");
          });
        }
      }`,
      errors: [{ messageId: "invalidConstructId" }],
      output: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      class ParentConstruct extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
          ["a"].forEach(() => {
            new TestClass(props, "MyBucket");
          });
        }
      }`,
    },
  ],
});
