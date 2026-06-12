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
  ],
});
