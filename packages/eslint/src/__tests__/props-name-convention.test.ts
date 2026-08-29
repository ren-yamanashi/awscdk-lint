import { RuleTester } from "@typescript-eslint/rule-tester";

import { propsNameConvention } from "../rules/props-name-convention";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts*"],
      },
    },
  },
});

ruleTester.run("props-name-convention", propsNameConvention, {
  valid: [
    {
      // WHEN: Props interface name follows ${ConstructName}Props format
      code: `
        class Construct {}
        interface MyConstructProps {
          readonly bucket?: string;
        }
        class MyConstruct extends Construct {
          constructor(scope: Construct, id: string, props: MyConstructProps) {
            super(scope, id);
          }
        }
      `,
    },
    {
      // WHEN: Class is not a Construct
      code: `
        interface Props {
          readonly bucket?: string;
        }
        class NotConstruct {
          constructor(props: Props) {}
        }
      `,
    },
    {
      // WHEN: Class has no props parameter
      code: `
        class Construct {}
        class MyConstruct extends Construct {
          constructor(scope: Construct, id: string) {
            super(scope, id);
          }
        }
      `,
    },
    {
      // WHEN: props parameter is a parameter property with a valid interface name
      code: `
        class Construct {}
        interface MyConstructProps {
          readonly bucket?: string;
        }
        class MyConstruct extends Construct {
          constructor(scope: Construct, id: string, private readonly props: MyConstructProps) {
            super(scope, id);
          }
        }
      `,
    },
    {
      // WHEN: props parameter has a default value with a valid interface name
      code: `
        class Construct {}
        interface MyConstructProps {
          readonly bucket?: string;
        }
        class MyConstruct extends Construct {
          constructor(scope: Construct, id: string, props: MyConstructProps = {}) {
            super(scope, id);
          }
        }
      `,
    },
    {
      // WHEN: Class extends Stack (this rule applies to Construct classes only)
      code: `
        class Construct {}
        class Stack extends Construct {}
        interface WrongProps {
          readonly bucket?: string;
        }
        class MyStack extends Stack {
          constructor(scope: Construct, id: string, props: WrongProps) {
            super(scope, id);
          }
        }
      `,
    },
    {
      // WHEN: Class extends a user-defined Stack base class (the whole Stack subtree is out of scope)
      code: `
        class Construct {}
        class Stack extends Construct {}
        class MyBaseStack extends Stack {}
        interface WrongProps {
          readonly bucket?: string;
        }
        class MyStack extends MyBaseStack {
          constructor(scope: Construct, id: string, props: WrongProps) {
            super(scope, id);
          }
        }
      `,
    },
  ],
  invalid: [
    {
      // WHEN: constructor has an overload signature and the implementation takes wrongly named props
      code: `
        class Construct {}
        interface Props {
          readonly bucket?: string;
        }
        class MyConstruct extends Construct {
          constructor(scope: Construct, id: string);
          constructor(scope: Construct, id: string, props?: Props) {
            super(scope, id);
          }
        }
      `,
      errors: [
        {
          messageId: "invalidPropsName",
          data: {
            interfaceName: "Props",
            expectedName: "MyConstructProps",
          },
        },
      ],
    },
    {
      // WHEN: Props interface name does not follow ${ConstructName}Props format
      code: `
        class Construct {}
        interface Props {
          readonly bucket?: string;
        }
        class MyConstruct extends Construct {
          constructor(scope: Construct, id: string, props: Props) {
            super(scope, id);
          }
        }
      `,
      errors: [
        {
          messageId: "invalidPropsName",
          data: {
            interfaceName: "Props",
            expectedName: "MyConstructProps",
          },
        },
      ],
    },
    {
      // WHEN: Props interface name has wrong prefix
      code: `
        class Construct {}
        interface WrongProps {
          readonly bucket?: string;
        }
        class MyConstruct extends Construct {
          constructor(scope: Construct, id: string, props: WrongProps) {
            super(scope, id);
          }
        }
      `,
      errors: [
        {
          messageId: "invalidPropsName",
          data: {
            interfaceName: "WrongProps",
            expectedName: "MyConstructProps",
          },
        },
      ],
    },
    {
      // WHEN: parameter property props has a wrong interface name
      code: `
        class Construct {}
        interface WrongProps {
          readonly bucket?: string;
        }
        class MyConstruct extends Construct {
          constructor(scope: Construct, id: string, private readonly props: WrongProps) {
            super(scope, id);
          }
        }
      `,
      errors: [
        {
          messageId: "invalidPropsName",
          data: {
            interfaceName: "WrongProps",
            expectedName: "MyConstructProps",
          },
        },
      ],
    },
    {
      // WHEN: default value props has a wrong interface name
      code: `
        class Construct {}
        interface WrongProps {
          readonly bucket?: string;
        }
        class MyConstruct extends Construct {
          constructor(scope: Construct, id: string, props: WrongProps = {}) {
            super(scope, id);
          }
        }
      `,
      errors: [
        {
          messageId: "invalidPropsName",
          data: {
            interfaceName: "WrongProps",
            expectedName: "MyConstructProps",
          },
        },
      ],
    },
  ],
});
