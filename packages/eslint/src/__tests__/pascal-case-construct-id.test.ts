import { RuleTester } from "@typescript-eslint/rule-tester";

import { pascalCaseConstructId } from "../rules/pascal-case-construct-id";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts*"],
      },
    },
  },
});

ruleTester.run("pascal-case-construct-id", pascalCaseConstructId, {
  valid: [
    // WHEN: id is empty
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
    // WHEN: id is object
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
    // WHEN: id is array
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
    // WHEN: id is number
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
    // WHEN: id is PascalCase
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
    // WHEN: not extends Construct
    {
      code: `
      class SampleConstruct {
        constructor(public id: string) {}
      }
      const test = new SampleConstruct('test', 'ValidId');`,
    },
    // WHEN: property name is not `id`
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
    // WHEN: id is PascalCase template literal without expressions
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
    // WHEN: id is a template literal with expressions
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
    // WHEN: id is snake_case(double quote)
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
    // WHEN: id is camelCase(single quote)
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
    // WHEN: id is snake_case and the instantiated class inherits its constructor
    {
      code: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      class InheritedClass extends TestClass {}
      const test = new InheritedClass("test", "invalid_id");`,
      errors: [{ messageId: "invalidConstructId" }],
      output: `
      class Construct {}
      class TestClass extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      class InheritedClass extends TestClass {}
      const test = new InheritedClass("test", "InvalidId");`,
    },
    // WHEN: id is snake_case template literal without expressions
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
    // WHEN: id is separated by a non-alphanumeric symbol (e.g. dot)
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
    // WHEN: id starts with digits — reported but not fixable (fix must not diverge)
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
    // WHEN: the converted id is already used by another construct in the same constructor
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
    // WHEN: several case variants of one word are used in the same constructor
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
    // WHEN: the constructor holds no other construct id to collide with
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
    // WHEN: ids converting to the same value live in different constructors
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
  ],
});
