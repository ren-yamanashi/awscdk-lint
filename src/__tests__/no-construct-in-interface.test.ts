import { RuleTester } from "@typescript-eslint/rule-tester";

import { noConstructInInterface } from "../rules/no-construct-in-interface";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts*"],
      },
    },
  },
});

ruleTester.run("no-construct-in-interface", noConstructInInterface, {
  valid: [
    {
      name: "property type is not class (string)",
      code: `
      interface TestInterface {
        test: string;
      }
      `,
    },
    {
      name: "property type is not class (type alias)",
      code: `
      type TestType = {
        test: string;
      };
      interface TestInterface {
        test: TestType;
      }
      `,
    },
    {
      name: "property type is not class (undefined)",
      code: `
      interface TestInterface {
        test: undefined;
      }
      `,
    },
    {
      name: "property type is class but not Resource type",
      code: `
      class TestClass {}
      interface TestInterface {
        test: TestClass;
      }
      `,
    },
    {
      name: `property type is class that extends Resource but does not implement matching interface`,
      code: `
      class Resource {}
      export abstract class BaseLoadBalancer extends Resource {
        constructor() {
          super();
        }
      }
      interface MyConstructProps {
        bucket: BaseLoadBalancer;
      }
      `,
    },
    {
      name: `property type is array of class that extends Resource but does not implement matching interface`,
      code: `
      class Resource {}
      export abstract class BaseLoadBalancer extends Resource {
        constructor() {
          super();
        }
      }
      interface MyConstructProps {
        bucket: BaseLoadBalancer[];
      }
      `,
    },
    {
      name: `property type is class that extends Resource but implements non-matching interface`,
      code: `
      class Resource {}
      interface IVersion {
        version: string;
      }
      export class EdgeFunction extends Resource implements IVersion {
        constructor() {
          super();
        }
      }
      interface MyConstructProps {
        bucket: EdgeFunction;
      }
      `,
    },
    {
      name: `property type is interface (not construct class) even if there is a class implementing it in module`,
      code: `
      class Resource {}

      declare module baseService {
        interface IService {
          serviceArn: string;
        }
        export abstract class BaseService extends Resource implements IService {
          abstract readonly serviceArn: string;
          constructor() {
            super();
          }
        }
      }

      declare module ecs {
        export interface IFargateService extends baseService.IService {}
        export class FargateService extends baseService.BaseService implements IFargateService {
          readonly serviceArn: string;
          constructor() {
            super();
          }
        }
      }
      interface MyConstructProps {
        bucket: ecs.IFargateService;
      }
      `,
    },
  ],
  invalid: [
    {
      name: "property type is class that extends Resource (Bucket extends BucketBase)",
      code: `
      class Resource {}
      interface IBucket {
        bucketName: string;
      }
      export abstract class BucketBase extends Resource implements IBucket {
        abstract readonly bucketName: string;
        constructor() {
          super();
        }
      }
      export class Bucket extends BucketBase {
        readonly bucketName: string;
        constructor() {
          super();
          this.bucketName = "test-bucket";
        }
      }
      interface MyConstructProps {
        bucket: Bucket;
      }
      `,
      errors: [{ messageId: "invalidInterfaceProperty" }],
    },
    {
      name: "property type is class that extends Resource (BucketBase)",
      code: `
      class Resource {}
      interface IBucket {
        bucketName: string;
      }
      export abstract class BucketBase extends Resource implements IBucket {
        abstract readonly bucketName: string;
        constructor() {
          super();
        }
      }
      interface MyConstructProps {
        bucket: BucketBase;
      }
      `,
      errors: [{ messageId: "invalidInterfaceProperty" }],
    },
    {
      name: "property type is class that extends Resource (EmailIdentity extends EmailIdentityBase)",
      code: `
      class Resource {}
      interface IEmailIdentity {
        emailIdentityName: string;
      }
      export abstract class EmailIdentityBase extends Resource implements IEmailIdentity {
        abstract readonly emailIdentityName: string;
        constructor() {
          super();
        }
      }
      export class EmailIdentity extends EmailIdentityBase {
        constructor() {
          super();
        }
      }
      interface MyConstructProps {
        bucket: EmailIdentity;
      }
      `,
      errors: [{ messageId: "invalidInterfaceProperty" }],
    },
    {
      name: "property type is class that extends Resource (FargateService implements IFargateService)",
      code: `
      class Resource {}
      interface IService {
        serviceArn: string;
      }
      interface IFargateService extends IService {}
      export abstract class BaseService extends Resource implements IService {
        abstract readonly serviceArn: string;
        constructor() {
          super();
        }
      }
      export class FargateService extends BaseService implements IFargateService {
        readonly serviceArn: string;
        constructor() {
          super();
        }
      }
      interface MyConstructProps {
        bucket: FargateService;
      }
      `,
      errors: [{ messageId: "invalidInterfaceProperty" }],
    },
    {
      name: "property type is class that extends Resource (FargateService implements ecs.IFargateService)",
      code: `
      class Resource {}
      interface IService {
        serviceArn: string;
      }
      declare module ecs {
        export interface IFargateService extends IService {}
      }
      export abstract class BaseService extends Resource implements IService {
        abstract readonly serviceArn: string;
        constructor() {
          super();
        }
      }
      export class FargateService extends BaseService implements ecs.IFargateService {
        readonly serviceArn: string;
        constructor() {
          super();
        }
      }
      interface MyConstructProps {
        bucket: FargateService;
      }
      `,
      errors: [{ messageId: "invalidInterfaceProperty" }],
    },
    {
      name: "property type is class defined in module that extends Resource (ecs.FargateService)",
      code: `
      class Resource {}
      interface IService {
        serviceArn: string;
      }
      export interface IFargateService extends IService {}
      export abstract class BaseService extends Resource implements IService {
        abstract readonly serviceArn: string;
        constructor() {
          super();
        }
      }

      declare module ecs {
        export class FargateService extends BaseService implements IFargateService {
          readonly serviceArn: string;
          constructor() {
            super();
          }
        }
      }
      interface MyConstructProps {
        bucket: ecs.FargateService;
      }
      `,
      errors: [{ messageId: "invalidInterfaceProperty" }],
    },
    {
      name: `
      property type is class that extends a base class implementing a matching interface
      (S3OriginAccessControl extends OriginAccessControlBase)`,
      code: `
      class Resource {}
      interface IOriginAccessControl {
        originAccessControlId: string;
      }
      export abstract class OriginAccessControlBase extends Resource implements IOriginAccessControl {
        abstract readonly originAccessControlId: string;
        constructor() {
          super();
        }
      }
      export class S3OriginAccessControl extends OriginAccessControlBase {
        readonly originAccessControlId: string;
        constructor() {
          super();
          this.originAccessControlId = "test-id";
        }
      }
      interface MyConstructProps {
        originAccessControl: S3OriginAccessControl;
      }
      `,
      errors: [{ messageId: "invalidInterfaceProperty" }],
    },
    {
      name: "property type is class with BaseV{number} pattern (TableBaseV2)",
      code: `
      class Resource {}
      interface ITableV2 {
        tableName: string;
      }
      export class TableBaseV2 extends Resource implements ITableV2 {
        readonly tableName: string;
        constructor() {
          super();
          this.tableName = "test-table";
        }
      }
      interface MyConstructProps {
        table: TableBaseV2;
      }
      `,
      errors: [{ messageId: "invalidInterfaceProperty" }],
    },
    {
      name: "property type is array of class that extends Resource (Bucket[])",
      code: `
      class Resource {}
      interface IBucket {
        bucketName: string;
      }
      export abstract class BucketBase extends Resource implements IBucket {
        abstract readonly bucketName: string;
        constructor() {
          super();
        }
      }
      export class Bucket extends BucketBase {
        readonly bucketName: string;
        constructor() {
          super();
          this.bucketName = "test-bucket";
        }
      }
      interface MyConstructProps {
        bucket: Bucket[];
      }
      `,
      errors: [{ messageId: "invalidInterfaceProperty" }],
    },
    {
      name: "property type is Array generics type wrapping class that extends Resource (Array<Bucket>)",
      code: `
      class Resource {}
      interface IBucket {
        bucketName: string;
      }
      export abstract class BucketBase extends Resource implements IBucket {
        abstract readonly bucketName: string;
        constructor() {
          super();
        }
      }
      export class Bucket extends BucketBase {
        readonly bucketName: string;
        constructor() {
          super();
          this.bucketName = "test-bucket";
        }
      }
      interface MyConstructProps {
        buckets: Array<Bucket>;
      }
      `,
      errors: [{ messageId: "invalidInterfaceProperty" }],
    },
    {
      name: "property type is Readonly utility type wrapping class that extends Resource",
      code: `
      class Resource {}
      interface IBucket {
        bucketName: string;
      }
      export abstract class BucketBase extends Resource implements IBucket {
        abstract readonly bucketName: string;
        constructor() {
          super();
        }
      }
      export class Bucket extends BucketBase {
        readonly bucketName: string;
        constructor() {
          super();
          this.bucketName = "test-bucket";
        }
      }
      interface MyConstructProps {
        bucket: Readonly<Bucket>;
      }
      `,
      errors: [{ messageId: "invalidInterfaceProperty" }],
    },
    {
      name: "property type is Partial utility type wrapping class that extends Resource",
      code: `
      class Resource {}
      interface IBucket {
        bucketName: string;
      }
      export abstract class BucketBase extends Resource implements IBucket {
        abstract readonly bucketName: string;
        constructor() {
          super();
        }
      }
      export class Bucket extends BucketBase {
        readonly bucketName: string;
        constructor() {
          super();
          this.bucketName = "test-bucket";
        }
      }
      interface MyConstructProps {
        bucket: Partial<Bucket>;
      }
      `,
      errors: [{ messageId: "invalidInterfaceProperty" }],
    },
    {
      name: "property type is custom type alias wrapping class that extends Resource (MyWrapper<Bucket>)",
      code: `
      class Resource {}
      interface IBucket {
        bucketName: string;
      }
      export abstract class BucketBase extends Resource implements IBucket {
        abstract readonly bucketName: string;
        constructor() {
          super();
        }
      }
      export class Bucket extends BucketBase {
        readonly bucketName: string;
        constructor() {
          super();
          this.bucketName = "test-bucket";
        }
      }
      type MyWrapper<T> = T;
      interface MyConstructProps {
        bucket: MyWrapper<Bucket>;
      }
      `,
      errors: [{ messageId: "invalidInterfaceProperty" }],
    },
    {
      name: "property type is interface generics type wrapping class that extends Resource (Wrapper<Bucket>)",
      code: `
      class Resource {}
      interface IBucket {
        bucketName: string;
      }
      export abstract class BucketBase extends Resource implements IBucket {
        abstract readonly bucketName: string;
        constructor() {
          super();
        }
      }
      export class Bucket extends BucketBase {
        readonly bucketName: string;
        constructor() {
          super();
          this.bucketName = "test-bucket";
        }
      }
      interface Wrapper<T> {
        value: T;
      }
      interface MyConstructProps {
        bucket: Wrapper<Bucket>;
      }
      `,
      errors: [{ messageId: "invalidInterfaceProperty" }],
    },
    {
      name: "property type is some generics type wrapping class that extends Resource",
      code: `
      class Resource {}
      interface IBucket {
        bucketName: string;
      }
      export abstract class BucketBase extends Resource implements IBucket {
        abstract readonly bucketName: string;
        constructor() {
          super();
        }
      }
      export class Bucket extends BucketBase {
        readonly bucketName: string;
        constructor() {
          super();
          this.bucketName = "test-bucket";
        }
      }
      interface MyConstructProps {
        bucket: Promise<Array<Bucket>>;
      }
      `,
      errors: [{ messageId: "invalidInterfaceProperty" }],
    },
    {
      name: "property type is Class included in Tuple type that extends Resource",
      code: `
      class Resource {}
      interface IBucket {
        bucketName: string;
      }
      export abstract class BucketBase extends Resource implements IBucket {
        abstract readonly bucketName: string;
        constructor() {
          super();
        }
      }
      export class Bucket extends BucketBase {
        readonly bucketName: string;
        constructor() {
          super();
          this.bucketName = "test-bucket";
        }
      }
      interface MyConstructProps {
        bucket: [Bucket, Bucket];
      }
      `,
      errors: [{ messageId: "invalidInterfaceProperty" }],
    },
    {
      name: "property type is Class included in Union type that extends Resource",
      code: `
      class Resource {}
      interface IBucket {
        bucketName: string;
      }
      export abstract class BucketBase extends Resource implements IBucket {
        abstract readonly bucketName: string;
        constructor() {
          super();
        }
      }
      export class Bucket extends BucketBase {
        readonly bucketName: string;
        constructor() {
          super();
          this.bucketName = "test-bucket";
        }
      }
      interface MyConstructProps {
        bucket: Bucket | { bucketName: string; };
      }
      `,
      errors: [{ messageId: "invalidInterfaceProperty" }],
    },
    {
      name: "property type is Class two dimension type that extends Resource",
      code: `
      class Resource {}
      interface IBucket {
        bucketName: string;
      }
      export abstract class BucketBase extends Resource implements IBucket {
        abstract readonly bucketName: string;
        constructor() {
          super();
        }
      }
      export class Bucket extends BucketBase {
        readonly bucketName: string;
        constructor() {
          super();
          this.bucketName = "test-bucket";
        }
      }
      interface MyConstructProps {
        bucket: Bucket[][];
      }
      `,
      errors: [{ messageId: "invalidInterfaceProperty" }],
    },
    {
      name: "property type is Class with undefined in Union type",
      code: `
      class Resource {}
      interface IBucket {
        bucketName: string;
      }
      export abstract class BucketBase extends Resource implements IBucket {
        abstract readonly bucketName: string;
        constructor() {
          super();
        }
      }
      export class Bucket extends BucketBase {
        readonly bucketName: string;
        constructor() {
          super();
          this.bucketName = "test-bucket";
        }
      }
      interface MyConstructProps {
        bucket: Bucket | undefined;
      }
      `,
      errors: [{ messageId: "invalidInterfaceProperty" }],
    },
    {
      name: "property type is Class with null in Union type",
      code: `
      class Resource {}
      interface IBucket {
        bucketName: string;
      }
      export abstract class BucketBase extends Resource implements IBucket {
        abstract readonly bucketName: string;
        constructor() {
          super();
        }
      }
      export class Bucket extends BucketBase {
        readonly bucketName: string;
        constructor() {
          super();
          this.bucketName = "test-bucket";
        }
      }
      interface MyConstructProps {
        bucket: Bucket | null;
      }
      `,
      errors: [{ messageId: "invalidInterfaceProperty" }],
    },
    {
      name: "property type is Class in Intersection type",
      code: `
      class Resource {}
      interface IBucket {
        bucketName: string;
      }
      export abstract class BucketBase extends Resource implements IBucket {
        abstract readonly bucketName: string;
        constructor() {
          super();
        }
      }
      export class Bucket extends BucketBase {
        readonly bucketName: string;
        constructor() {
          super();
          this.bucketName = "test-bucket";
        }
      }
      interface MyConstructProps {
        bucket: Bucket & { customProp: string };
      }
      `,
      errors: [{ messageId: "invalidInterfaceProperty" }],
    },
    {
      name: "property type is Required utility type wrapping Class",
      code: `
      class Resource {}
      interface IBucket {
        bucketName: string;
      }
      export abstract class BucketBase extends Resource implements IBucket {
        abstract readonly bucketName: string;
        constructor() {
          super();
        }
      }
      export class Bucket extends BucketBase {
        readonly bucketName: string;
        constructor() {
          super();
          this.bucketName = "test-bucket";
        }
      }
      interface MyConstructProps {
        bucket: Required<Bucket>;
      }
      `,
      errors: [{ messageId: "invalidInterfaceProperty" }],
    },
    {
      name: "property type is NonNullable utility type wrapping Class",
      code: `
      class Resource {}
      interface IBucket {
        bucketName: string;
      }
      export abstract class BucketBase extends Resource implements IBucket {
        abstract readonly bucketName: string;
        constructor() {
          super();
        }
      }
      export class Bucket extends BucketBase {
        readonly bucketName: string;
        constructor() {
          super();
          this.bucketName = "test-bucket";
        }
      }
      interface MyConstructProps {
        bucket: NonNullable<Bucket>;
      }
      `,
      errors: [{ messageId: "invalidInterfaceProperty" }],
    },
  ],
});
