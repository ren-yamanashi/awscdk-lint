import { CfnOutput } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3/lib/bucket";
import { Construct } from "constructs";

export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // ✅ Can use a different name
    new Bucket(this, "MyBucket");

    // ✅ If the target class is not Construct, it does not result in an error
    new CfnOutput(this, "MyClass", {
      value: "This is a CfnOutput with MyClass as the ID",
    });
  }
}

export class MyClass extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // ❌ Shouldn't use the parent class name
    new Bucket(this, "MyClass");

    // ❌ Construct ID should not include the parent class name
    new Bucket(this, "MyClassBucket");
  }
}
