import { RuleTester } from "@typescript-eslint/rule-tester";

import { noConstructInPublicPropertyOfConstruct } from "../rules/no-construct-in-public-property-of-construct";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts*"],
      },
    },
  },
});

ruleTester.run(
  "no-construct-in-public-property-of-construct",
  noConstructInPublicPropertyOfConstruct,
  {
    valid: [
      {
        name: "field type is not class (string)",
        code: `
          class Construct {}
          class TestClass extends Construct {
            public test: string;
          }
        `,
      },
      {
        name: "field type is not class (interface)",
        code: `
          class Construct {}
          interface ITest {
            value: string;
          }
          class TestClass extends Construct {
            public test: ITest;
          }
        `,
      },
      {
        name: "field type is not class (type alias)",
        code: `
          class Construct {}
          type TestType = {
            value: string;
          };
          class TestClass extends Construct {
            public test: TestType;
          }
        `,
      },
      {
        name: "field is private",
        code: `
          class Construct {}
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
          class TestClass extends Construct {
            private test: Bucket;
          }
        `,
      },
      {
        name: "field is protected",
        code: `
          class Construct {}
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
          class TestClass extends Construct {
            protected test: Bucket;
          }
        `,
      },
      {
        name: "field has no type annotation",
        code: `
          class Construct {}
          class TestClass extends Construct {
            public test;
          }
        `,
      },
      {
        name: "class does not extend Construct",
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
          class TestClass {
            public test: Bucket;
          }
        `,
      },
      {
        name: "class extends Resource but only implements IResource interface",
        code: `
          class Construct {}
          interface IResource {
            resourceId: string;
          }
          class Resource {
            resourceId: string;
            constructor() {
              this.resourceId = "resource-id";
            }
          }
          export class MetricFilter extends Resource {
            readonly metricName: string;
            constructor() {
              super();
            }
          }
          class TestClass extends Construct {
            public test: MetricFilter;
          }
        `,
      },
    ],
    invalid: [
      {
        name: "public field type is class that extends Resource (Bucket extends BucketBase)",
        code: `
          class Construct {}
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
          class TestClass extends Construct {
            public test: Bucket;
          }
        `,
        errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      },
      {
        name: "public field type is class that extends Resource (BucketBase)",
        code: `
          class Construct {}
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
          class TestClass extends Construct {
            public test: BucketBase;
          }
      `,
        errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      },
      {
        name: "public field type is class that extends Resource (FargateService implements IFargateService)",
        code: `
          class Construct {}
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
          class TestClass extends Construct {
            public test: FargateService;
          }
        `,
        errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      },
      {
        name: "public field type is class that extends Resource (FargateService implements ecs.IFargateService)",
        code: `
          class Construct {}
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
          class TestClass extends Construct {
            public test: FargateService;
          }
        `,
        errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      },
      {
        name: "public field type is class that extends a base class implementing a matching interface (S3OriginAccessControl)",
        code: `
          class Construct {}
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
          class TestClass extends Construct {
            public test: S3OriginAccessControl;
          }
        `,
        errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      },
      {
        name: "public field type is class with BaseV{number} pattern (TableBaseV2)",
        code: `
          class Construct {}
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
          class TestClass extends Construct {
            public test: TableBaseV2;
          }
        `,
        errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      },
      {
        name: "constructor public property type is class that extends Resource (Bucket)",
        code: `
          class Construct {}
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
          class TestClass extends Construct {
            constructor(public test: Bucket) {
              super();
            }
          }
        `,
        errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      },
      {
        name: "public field type is array of class that extends Resource (Bucket[])",
        code: `
          class Construct {}
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
          class TestClass extends Construct {
            public buckets: Bucket[];
          }
        `,
        errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      },
      {
        name: "constructor public property type is array of class that extends Resource (Bucket[])",
        code: `
          class Construct {}
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
          class TestClass extends Construct {
            constructor(public buckets: Bucket[]) {
              super();
            }
          }
        `,
        errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      },
      {
        name: "public field type is Array generic type wrapping class that extends Resource (Array<Bucket>)",
        code: `
          class Construct {}
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
          class TestClass extends Construct {
            public buckets: Array<Bucket>;
          }
        `,
        errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      },
      {
        name: "public field type is Readonly utility type wrapping class that extends Resource",
        code: `
          class Construct {}
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
          class TestClass extends Construct {
            public readonly bucket: Readonly<Bucket>;
          }
        `,
        errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      },
      {
        name: "public field type is Partial utility type wrapping class that extends Resource",
        code: `
          class Construct {}
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
          class TestClass extends Construct {
            public bucket: Partial<Bucket>;
          }
        `,
        errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      },
      {
        name: "public field type is custom type alias wrapping class that extends Resource (MyWrapper<Bucket>)",
        code: `
          class Construct {}
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
          class TestClass extends Construct {
            public bucket: MyWrapper<Bucket>;
          }
        `,
        errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      },
      {
        name: "constructor public property type is Array generic type wrapping class that extends Resource (Array<Bucket>)",
        code: `
          class Construct {}
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
          class TestClass extends Construct {
            constructor(public buckets: Array<Bucket>) {
              super();
            }
          }
        `,
        errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      },
      {
        name: "constructor public property type is Readonly utility type wrapping class that extends Resource",
        code: `
          class Construct {}
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
          class TestClass extends Construct {
            constructor(public readonly bucket: Readonly<Bucket>) {
              super();
            }
          }
        `,
        errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      },
      {
        name: "public field type is nested generics (Promise<Array<Bucket>>)",
        code: `
          class Construct {}
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
          class TestClass extends Construct {
            public bucket: Promise<Array<Bucket>>;
          }
        `,
        errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      },
      {
        name: "public field type is Tuple type",
        code: `
          class Construct {}
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
          class TestClass extends Construct {
            public buckets: [Bucket, Bucket];
          }
        `,
        errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      },
      {
        name: "public field type is Class in Union type",
        code: `
          class Construct {}
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
          class TestClass extends Construct {
            public bucket: Bucket | { bucketName: string };
          }
        `,
        errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      },
      {
        name: "public field type is two-dimensional array of class that extends Resource (Bucket[][])",
        code: `
          class Construct {}
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
          class TestClass extends Construct {
            public buckets: Bucket[][];
          }
        `,
        errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      },
      {
        name: "public field type is Optional type (Bucket | undefined)",
        code: `
          class Construct {}
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
          class TestClass extends Construct {
            public bucket: Bucket | undefined;
          }
        `,
        errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      },
      {
        name: "public field type is Optional type (Bucket | null)",
        code: `
          class Construct {}
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
          class TestClass extends Construct {
            public bucket: Bucket | null;
          }
        `,
        errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      },
      {
        name: "public field type is Class in Intersection type",
        code: `
          class Construct {}
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
          class TestClass extends Construct {
            public bucket: Bucket & { customProp: string };
          }
        `,
        errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      },
      {
        name: "public field type is Required utility type wrapping class that extends Resource",
        code: `
          class Construct {}
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
          class TestClass extends Construct {
            public bucket: Required<Bucket>;
          }
        `,
        errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      },
      {
        name: "public field type is NonNullable utility type wrapping class that extends Resource",
        code: `
          class Construct {}
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
          class TestClass extends Construct {
            public bucket: NonNullable<Bucket>;
          }
        `,
        errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      },
      {
        name: "public field type is interface generic type wrapping class that extends Resource (Wrapper<Bucket>)",
        code: `
          class Construct {}
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
          class TestClass extends Construct {
            public bucket: Wrapper<Bucket>;
          }
        `,
        errors: [{ messageId: "invalidPublicPropertyOfConstruct" }],
      },
    ],
  }
);
