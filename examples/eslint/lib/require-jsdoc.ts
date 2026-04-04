import { IBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

// ✅ JSDoc comment for interface property
export interface TestProps {
  /**
   * Description for prop1
   */
  readonly prop1: string;
  /** Description for prop2 */
  readonly prop2: number;
}

export class MyConstruct extends Construct {
  // ✅ JSDoc comment for public property
  /** The S3 bucket created by this construct */
  public readonly bucket: IBucket;

  // ✅ When the property is not public, this rule is not applied
  private readonly bucketName: string;
}

export class SampleClass {
  // ✅ When class is not a construct, this rule is not applied
  public readonly bucket: IBucket;
}

export interface MyConstructProps {
  // ❌ Must write JSDoc comment
  readonly bucket: IBucket;
}

export class _MyConstruct extends Construct {
  // ❌ Must write JSDoc comment
  public readonly bucket: IBucket;
  // ❌ Must write JSDoc comment
  readonly _bucket: IBucket;
}
