import { Stack } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // ✅ Allowed if the "Construct" and "Stack" suffix are not appended
    new Bucket(this, "MyBucket");

    // ❌ Should not use the "Construct" suffix
    new Bucket(this, "BucketConstruct");

    // ❌ Should not use the suffix "Stack"
    new Stack(this, "MyStack");
  }
}
