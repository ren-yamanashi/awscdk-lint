import { RuleTester } from "@typescript-eslint/rule-tester";

import { constructConstructorProperty } from "../rules/construct-constructor-property";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts*"],
      },
    },
  },
});

ruleTester.run("construct-constructor-property", constructConstructorProperty, {
  valid: [
    {
      name: 'constructor has "scope, id" signature',
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
      name: 'constructor has "scope, id, props" signature',
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
      name: 'constructor has "scope, id, props" signature with optional props',
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
      name: 'constructor has "scope, id, props" signature with default value props',
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
      name: 'constructor has "scope, id" signature with default value id',
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
      name: 'constructor has "scope, id" signature with default value scope',
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
      name: 'constructor has "scope, id, props" signature with parameter property props',
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
      name: 'constructor has "scope, id, props" signature with parameter property and default value props',
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
      name: 'constructor has more than 3 parameters but first three are "scope, id, props"',
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
      name: "class does not extend Construct",
      code: `
      export class MyConstruct {
        constructor(invalidProperty: any) {}
      }
      `,
    },
    {
      name: "class extends App, whose constructor takes props instead of scope and id",
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
      name: "first parameter is typed as Stack",
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
      name: "first parameter is typed as a Stack subclass",
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
      name: "constructor has less than 2 parameters",
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
      name: 'constructor has 2 parameters but first is not named "scope"',
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
      name: 'constructor has 2 parameters but first (scope) type is not "Construct"',
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
      name: 'constructor has 2 parameters but second is not named "id"',
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
      name: 'constructor has 2 parameters but second (id) type is not "string"',
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
      name: 'constructor has 3 parameters but third parameter is not named "props"',
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
      name: 'constructor has more than 3 parameters but third is not named "props"',
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
      name: 'constructor has 3 parameters but third with default value is not named "props"',
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
      name: "constructor has 3 parameters but third with default value is destructured",
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
      name: "constructor overload signatures are valid but implementation signature has invalid property names",
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
      name: "class extending Stack has invalid constructor property names",
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
