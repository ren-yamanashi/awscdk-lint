import { RuleTester } from "corsa-oxlint";

import { constructConstructorProperty } from "../rules/construct-constructor-property";

const ruleTester = new RuleTester({
  languageOptions: { sourceType: "module" },
});

ruleTester.run("construct-constructor-property", constructConstructorProperty, {
  valid: [
    {
      code: `
      class Construct {}
      interface MyConstructProps {}

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      `,
    },
    {
      code: `
      class Construct {}
      interface MyConstructProps {}

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
        }
      }
      `,
    },
    {
      code: `
      class Construct {}
      interface MyConstructProps {}

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props?: MyConstructProps) {
          super(scope, id);
        }
      }
      `,
    },
    {
      code: `
      class Construct {}
      interface MyConstructProps {}

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps = {}) {
          super(scope, id);
        }
      }
      `,
    },
    {
      code: `
      class Construct {}

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string = "resource") {
          super(scope, id);
        }
      }
      `,
    },
    {
      code: `
      class Construct {}

      export class MyConstruct extends Construct {
        constructor(scope: Construct = new Construct(), id: string) {
          super(scope, id);
        }
      }
      `,
    },
    {
      code: `
      class Construct {}
      interface MyConstructProps {}

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps, resourceName: string) {
          super(scope, id);
        }
      }
      `,
    },
    {
      code: `
      class Construct {}
      interface MyConstructProps {}

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, private readonly props: MyConstructProps) {
          super(scope, id);
        }
      }
      `,
    },
    {
      code: `
      class Construct {}
      interface MyConstructProps {}

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, private readonly props: MyConstructProps = {}) {
          super(scope, id);
        }
      }
      `,
    },
    {
      code: `
      export class MyConstruct {
        constructor(invalidProperty: any) {}
      }
      `,
    },
    {
      code: `
      class Construct {}
      interface AppProps {}
      class App extends Construct {
        constructor(props?: AppProps) {
          super();
        }
      }

      export class MyApp extends App {
        constructor(props?: AppProps) {
          super(props);
        }
      }
      `,
    },
    {
      code: `
      class Construct {}
      class Stack extends Construct {}

      export class MyConstruct extends Construct {
        constructor(scope: Stack, id: string) {
          super(scope, id);
        }
      }
      `,
    },
    {
      code: `
      class Construct {}
      class Stack extends Construct {}
      class MyStack extends Stack {}

      export class MyConstruct extends Construct {
        constructor(scope: MyStack, id: string) {
          super(scope, id);
        }
      }
      `,
    },
  ],
  invalid: [
    {
      code: `
      class Construct {}

      export class MyConstruct extends Construct {
        constructor(scope: Construct) {
          super(scope, "id");
        }
      }
      `,
      errors: [{ messageId: "invalidConstructorProperty" }],
    },
    {
      code: `
      class Construct {}

      export class MyConstruct extends Construct {
        constructor(myScope: Construct, id: string) {
          super(myScope, id);
        }
      }
      `,
      errors: [{ messageId: "invalidConstructorProperty" }],
    },
    {
      code: `
      class Construct {}

      export class MyConstruct extends Construct {
        constructor(scope: any, id: string) {
          super(scope, id);
        }
      }
      `,
      errors: [{ messageId: "invalidConstructorType" }],
    },
    {
      code: `
      class Construct {}

      export class MyConstruct extends Construct {
        constructor(scope: Construct, myId: string) {
          super(scope, myId);
        }
      }
      `,
      errors: [{ messageId: "invalidConstructorProperty" }],
    },
    {
      code: `
      class Construct {}

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: any) {
          super(scope, id);
        }
      }
      `,
      errors: [{ messageId: "invalidConstructorIdType" }],
    },
    {
      code: `
      class Construct {}
      interface MyConstructProps {}

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, myProps: MyConstructProps) {
          super(scope, id);
        }
      }
      `,
      errors: [{ messageId: "invalidConstructorProperty" }],
    },
    {
      code: `
      class Construct {}
      interface MyConstructProps {}

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, myProps: MyConstructProps, resourceName: string) {
          super(scope, id);
        }
      }
      `,
      errors: [{ messageId: "invalidConstructorProperty" }],
    },
    {
      code: `
      class Construct {}
      interface MyConstructProps {}

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, myProps: MyConstructProps = {}) {
          super(scope, id);
        }
      }
      `,
      errors: [{ messageId: "invalidConstructorProperty" }],
    },
    {
      code: `
      class Construct {}
      interface MyConstructProps {
        readonly bucketName?: string;
      }

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, { bucketName }: MyConstructProps = {}) {
          super(scope, id);
        }
      }
      `,
      errors: [{ messageId: "invalidConstructorProperty" }],
    },
    {
      code: `
      class Construct {}
      interface MyConstructProps {}

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string);
        constructor(scope: Construct, id: string, props: MyConstructProps);
        constructor(parent: Construct, name: string, opts?: MyConstructProps) {
          super(parent, name);
        }
      }
      `,
      errors: [
        { messageId: "invalidConstructorProperty" },
        { messageId: "invalidConstructorProperty" },
        { messageId: "invalidConstructorProperty" },
      ],
    },
    {
      code: `
      class Construct {}
      class Stack extends Construct {}

      export class BadStack extends Stack {
        constructor(myScope: Construct, myId: string) {
          super(myScope, myId);
        }
      }
      `,
      errors: [
        { messageId: "invalidConstructorProperty" },
        { messageId: "invalidConstructorProperty" },
      ],
    },
  ],
});
