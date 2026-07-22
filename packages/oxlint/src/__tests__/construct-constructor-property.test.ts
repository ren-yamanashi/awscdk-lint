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
      export class MyConstruct {
        constructor(invalidProperty: any) {}
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
  ],
});
