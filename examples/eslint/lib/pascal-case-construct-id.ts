import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    // ✅ Can use PascalCase
    new Bucket(this, "MyBucket");

    // ❌ Shouldn't use camelCase
    new Bucket(this, "myBucket");

    // ❌ Shouldn't use snake_case
    new Bucket(this, "my_bucket");

    // ❌ Shouldn't use kebab-case
    new Bucket(this, "my-bucket");
  }
}
