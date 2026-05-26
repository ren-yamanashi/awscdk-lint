import { propsNameConvention } from "../rules/props-name-convention";
import { createRuleTester } from "./create-rule-tester";

const ruleTester = createRuleTester();

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
  ],
  invalid: [
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
  ],
});
