import { RuleTester } from "@typescript-eslint/rule-tester";

import { noUnusedProps } from "../rules/no-unused-props";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts*"],
      },
    },
  },
});

ruleTester.run("no-unused-props", noUnusedProps, {
  valid: [
    {
      name: "All properties are used directly",
      code: `
      class Construct {}

      interface MyConstructProps {
        bucketName: string;
      }

      class MyConstruct extends Construct {
        private myProps: MyConstructProps;
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          console.log(props.bucketName);
        }
      }
      `,
    },
    {
      name: "Properties are used via destructuring",
      code: `
      class Construct {}

      interface MyConstructProps {
        bucketName: string;
        versioned: boolean;
      }

      class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          const { bucketName, versioned } = props;
          console.log(bucketName, versioned);
        }
      }
      `,
    },
    {
      name: "Props is assigned to private variable and all properties are used",
      code: `
      class Construct {}

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
      }

      export class MyConstruct extends Construct {
        private props: MyConstructProps;
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          this.props = props;
          console.log(this.props.bucketName, this.props.enableVersioning);
        }
      }
      `,
    },
    {
      name: "Individual properties are assigned to instance variables",
      code: `
      class Construct {}

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
      }

      export class MyConstruct extends Construct {
        private bucketName: string;
        private enableVersioning: boolean;
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          this.bucketName = props.bucketName;
          this.enableVersioning = props.enableVersioning;
          console.log(this.bucketName, this.enableVersioning);
        }
      }
      `,
    },
    {
      name: "Optional properties are used conditionally",
      code: `
      class Construct {}

      interface MyConstructProps {
        bucketName: string;
        enableVersioning?: boolean;
      }

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          console.log(props.bucketName, props.enableVersioning || false);
        }
      }
      `,
    },
    {
      name: "Constructor has no props parameter",
      code: `
      class Construct {}

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string) {
          super(scope, id);
        }
      }
      `,
    },
    {
      name: "Class does not extend Construct",
      code: `
      class Construct {}

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
      }

      export class MyClass {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          console.log(scope, id); // No usage of props
        }
      }
      `,
    },
    {
      name: "Props is used in nested object access",
      code: `
      class Construct {}

      interface MyConstructProps {
        config: {
          bucketName: string;
          enableVersioning: boolean;
        };
      }

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          console.log(props.config.bucketName, props.config.enableVersioning);
        }
      }
      `,
    },
    {
      name: "Properties are used via optional chaining",
      code: `
      class Construct {}

      interface MyConstructProps {
        bucketName?: string;
        enableVersioning?: boolean;
      }

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          console.log(props.bucketName ?? "default-name", props.enableVersioning ?? false);
        }
      }
      `,
    },
    {
      name: "Some properties are unused but class is abstract",
      code: `
      class Construct {}
      export interface BaseConstructProps {
        readonly bucketName: string;
      }
      abstract class BaseConstruct extends Construct {
        constructor(scope: Construct, id: string, props: BaseConstructProps) {
          super(scope, id);
        }
      }
  `,
    },
    {
      name: "Props are used in super call",
      code: `
      class Construct {}

      interface BaseConstructProps {
        bucketName: string;
      }

      class BaseConstruct extends Construct {
        constructor(scope: Construct, id: string, props: BaseConstructProps) {
          super(scope, id);
          console.log(props);
        }
      }

      interface MyConstructProps extends BaseConstructProps {
        version: string;
      }

      class MyConstruct extends BaseConstruct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id, props);
        }
      }
  `,
    },
    {
      name: "Props is assigned to instance variable and used in other methods",
      code: `
      class Construct {}

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
      }

      export class MyConstruct extends Construct {
        private props: MyConstructProps;

        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          this.props = props;
        }

        private createBucket() {
          console.log(this.props.bucketName, this.props.enableVersioning);
        }
      }
      `,
    },
    {
      name: "Props is assigned to instance variable and used in public method",
      code: `
      class Construct {}

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
      }

      export class MyConstruct extends Construct {
        private readonly props: MyConstructProps;

        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          this.props = props;
        }

        public getBucketName(): string {
          return this.props.bucketName;
        }

        protected isVersioningEnabled(): boolean {
          return this.props.enableVersioning;
        }
      }
      `,
    },
    {
      name: "Props is assigned to instance variable with different name and used in methods",
      code: `
      class Construct {}

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
      }

      export class MyConstruct extends Construct {
        private readonly config: MyConstructProps;

        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          this.config = props;
        }

        private log() {
          console.log(this.config.bucketName, this.config.enableVersioning);
        }
      }
      `,
    },
    {
      name: "Props is passed to private method in constructor",
      code: `
      class Construct {}

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
      }

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          this.log(props);
        }

        private log(props: MyConstructProps) {
          console.log(props.bucketName, props.enableVersioning);
        }
      }
      `,
    },
    {
      name: "Props properties are passed to private method in constructor",
      code: `
      class Construct {}

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
      }

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          this.createBucket(props.bucketName, props.enableVersioning);
        }

        private log(name: string, versioned: boolean) {
          console.log(name, versioned);
        }
      }
      `,
    },
    {
      name: "Props is passed to multiple private methods",
      code: `
      class Construct {}

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
      }

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          this.logBucketName(props);
          this.logVersioning(props.enableVersioning);
        }

        private logBucketName(props: MyConstructProps) {
          console.log(props.bucketName);
        }

        private logVersioning(enabled: boolean) {
          console.log("Versioning:", enabled);
        }
      }
      `,
    },
    {
      name: "Props is used as a whole in external function",
      code: `
      function logProps(props: any) {
        console.log(props);
      }

      class Construct {}

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
        extraProp: string;
      }

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          logProps(props);
        }
      }
      `,
    },
    {
      name: "Props is passed to L2 Construct",
      code: `
      class Construct {}

      interface BucketProps {
        bucketName: string;
        versioned: boolean;
      }

      class Bucket extends Construct {
        constructor(scope: Construct, id: string, props: BucketProps) {
          super(scope, id);
          console.log(props);
        }
      }

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
      }

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          new Bucket(this, "MyBucket", {
            bucketName: props.bucketName,
            versioned: props.enableVersioning
          });
        }
      }
      `,
    },
    {
      name: "Props is passed to Ignored Construct",
      code: `
      class Construct {}

      class CfnOutput extends Construct {
        constructor(scope: Construct, id: string, props: any) {
          super(scope, id);
          console.log(props);
        }
      }

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
      }

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          new CfnOutput(this, "Props", {
            bucketName: props.bucketName,
            versioned: props.enableVersioning
          });
        }
      }
      `,
    },
    {
      name: "Props is assigned to a variable and all properties are used via the alias",
      code: `
      class Construct {}

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
      }

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          const myProps = props;
          console.log(myProps.bucketName, myProps.enableVersioning);
        }
      }
      `,
    },
    {
      name: "Props assigned to private variable and that variable is used",
      code: `
      class Construct {}

      interface MyConstructProps {
        bucketName: string;
      }

      class MyConstruct extends Construct {
        private myProps: MyConstructProps;
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          this.myProps = props;
          console.log(this.myProps);
        }
      }
      `,
    },
    {
      name: "Props assigned to private variable and that private variable's property is used",
      code: `
      class Construct {}

      interface MyConstructProps {
        bucketName: string;
      }

      class MyConstruct extends Construct {
        private myProps: MyConstructProps;
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          this.myProps = props;
          console.log(this.myProps.bucketName);
        }
      }
      `,
    },
  ],
  invalid: [
    {
      name: "All properties are unused",
      code: `
      class Construct {}

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
      }

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
        }
      }
      `,
      errors: [{ messageId: "unusedProp" }, { messageId: "unusedProp" }],
    },
    {
      name: "Some properties are unused",
      code: `
      class Construct {}

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
        unusedProp: string;
      }

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          console.log(props.bucketName, props.enableVersioning);
        }
      }
      `,
      errors: [{ messageId: "unusedProp" }],
    },
    {
      name: "Only some properties are used via destructuring",
      code: `
      class Construct {}

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
        unusedProp: string;
      }

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          const { bucketName, enableVersioning } = props;
          console.log(bucketName, enableVersioning);
        }
      }
      `,
      errors: [{ messageId: "unusedProp" }],
    },
    {
      name: "Props is assigned to private variable but some properties are unused",
      code: `
      class Construct {}

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
        unusedProp: string;
      }

      export class MyConstruct extends Construct {
        private myProps: MyConstructProps;

        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          this.myProps = props;
          console.log(this.myProps.bucketName, this.myProps.enableVersioning);
        }
      }
      `,
      errors: [{ messageId: "unusedProp" }],
    },
    {
      name: "Alias destructuring with some properties unused",
      code: `
      class Construct {}

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
        unusedProp: string;
      }

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          const { bucketName: bn, enableVersioning: ev } = props;
          console.log(bn, ev);
        }
      }
      `,
      errors: [{ messageId: "unusedProp" }],
    },
    {
      name: "Props is assigned to instance variable but some properties are not used in any method",
      code: `
      class Construct {}

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
        unusedProp: string;
      }

      export class MyConstruct extends Construct {
        private myProps: MyConstructProps;

        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          this.myProps = props;
        }

        private log() {
          console.log(this.myProps.bucketName, this.myProps.enableVersioning);
        }
      }
      `,
      errors: [{ messageId: "unusedProp" }],
    },
    {
      name: "Props is assigned to instance variable but unused it",
      code: `
      class Construct {}

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
      }

      export class MyConstruct extends Construct {
        private myProps: MyConstructProps;

        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          this.myProps = props;
        }
      }
      `,
      errors: [{ messageId: "unusedProp" }, { messageId: "unusedProp" }],
    },
    {
      name: "Props is passed to private method but some properties are not used",
      code: `
      class Construct {}

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
        unusedProp: string;
      }

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          this.log(props);
        }

        private log(myProps: MyConstructProps) {
          console.log(myProps.bucketName, myProps.enableVersioning);
        }
      }
      `,
      errors: [{ messageId: "unusedProp" }],
    },
    {
      name: "Only some props properties are passed to private method",
      code: `
      class Construct {}

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
        unusedProp: string;
      }

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          this.createBucket(props.bucketName, props.enableVersioning);
        }

        private log(name: string, versioned: boolean) {
          console.log(name, versioned);
        }
      }
      `,
      errors: [{ messageId: "unusedProp" }],
    },
    {
      name: "Props is assigned to a variable but only some properties are used via the alias",
      code: `
      class Construct {}

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
        unusedProp: string;
      }

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          const myProps = props;
          console.log(myProps.bucketName, myProps.enableVersioning);
        }
      }
      `,
      errors: [{ messageId: "unusedProp" }],
    },
    {
      name: "Some Props properties are unused as a whole in external function",
      code: `
      function logProps(props: { bucketName: string; enableVersioning: boolean; }) {
        console.log(props.bucketName, props.enableVersioning);
      }

      class Construct {}

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
        unusedProp: string;
      }

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          logProps({ bucketName: props.bucketName, enableVersioning: props.enableVersioning });
        }
      }
      `,
      errors: [{ messageId: "unusedProp" }],
    },
    {
      name: "Props is passed to L2 Construct",
      code: `
      class Construct {}

      interface BucketProps {
        bucketName: string;
        versioned: boolean;
      }

      class Bucket extends Construct {
        constructor(scope: Construct, id: string, props: BucketProps) {
          super(scope, id);
          console.log(props);
        }
      }

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
        unusedProp: string;
      }

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          new Bucket(this, "MyBucket", {
            bucketName: props.bucketName,
            versioned: props.enableVersioning
          });
        }
      }
      `,
      errors: [{ messageId: "unusedProp" }],
    },
    {
      name: "Props is passed to Ignored Construct",
      code: `
      class Construct {}

      class CfnOutput extends Construct {
        constructor(scope: Construct, id: string, props: any) {
          super(scope, id);
          console.log(props);
        }
      }

      interface MyConstructProps {
        bucketName: string;
        enableVersioning: boolean;
        unusedProp: string;
      }

      export class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          new CfnOutput(this, "Props", {
            bucketName: props.bucketName,
            versioned: props.enableVersioning
          });
        }
      }
      `,
      errors: [{ messageId: "unusedProp" }],
    },
  ],
});
