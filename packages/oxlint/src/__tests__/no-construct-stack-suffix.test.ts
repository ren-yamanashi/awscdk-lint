import { RuleTester } from "corsa-oxlint";

import { noConstructStackSuffix } from "../rules/no-construct-stack-suffix";

const ruleTester = new RuleTester({
  languageOptions: { sourceType: "module" },
});

ruleTester.run("no-construct-stack-suffix", noConstructStackSuffix, {
  valid: [
    {
      code: `
      class TestConstruct extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      new TestConstruct("test", "ValidId");
      `,
    },
    {
      code: `
      class Stack {}
      class TestStack extends Stack {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      const test = new TestStack("test", "ValidId");
      `,
    },
    {
      code: `
      class TestClass {
        constructor(props: any, id: string) {}
      }
      const test = new TestClass("test", "SampleConstruct");
      `,
    },
    {
      code: `
      class TestClass {
        constructor(props: any, id: string) {}
      }
      class Sample {
        constructor() {
          const test = new TestClass("test", "SampleConstruct");
        }
      }`,
    },
    {
      code: `
      class TestClass {
        constructor(props: any, validId: string) {}
      }
      const test = new TestClass("test", "SampleConstruct");
      `,
    },
    {
      code: `
      class Construct {}
      class SampleConstruct extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      new SampleConstruct({ name: "sample" }, "SampleConstruct");`,
      options: [{ disallowedSuffixes: ["Stack"] }],
    },
    {
      code: `
      class Stack {}
      class SampleStack extends Stack {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      new SampleStack({ name: "sample" }, "SampleStack");`,
      options: [{ disallowedSuffixes: ["Construct"] }],
    },
  ],
  invalid: [
    {
      code: `
      class Construct {}
      class SampleConstruct extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      new SampleConstruct({ name: "sample" }, "SampleConstruct");`,
      errors: [{ messageId: "invalidConstructId" }],
    },
    {
      code: `
      class Stack {}
      class SampleStack extends Stack {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      new SampleStack({ name: "sample" }, "SampleStack");`,
      errors: [{ messageId: "invalidConstructId" }],
    },
    {
      code: `
      class Construct {}
      class SampleConstruct extends Construct {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      new SampleConstruct({ name: "sample" }, "SampleConstruct");`,
      options: [{ disallowedSuffixes: ["Construct"] }],
      errors: [{ messageId: "invalidConstructId" }],
    },
    {
      code: `
      class Stack {}
      class SampleStack extends Stack {
        constructor(props: any, id: string) {
          super(props, id);
        }
      }
      new SampleStack({ name: "sample" }, "SampleStack");`,
      options: [{ disallowedSuffixes: ["Stack"] }],
      errors: [{ messageId: "invalidConstructId" }],
    },
  ],
});
