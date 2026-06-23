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
  ],
});
