/* oxlint-disable awscdk/require-jsdoc-oxlint */
import { IBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class MyConstruct extends Construct {
  // ✅ Can use readonly
  public readonly bucket: IBucket;

  // ❌ Shouldn't use mutable
  public _bucket: IBucket;
}

export class MyClass {
  // ✅ when not a construct of stack
  public _bucket: IBucket;
}
