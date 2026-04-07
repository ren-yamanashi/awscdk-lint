import { Stage } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

class SampleClass extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}

export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const bucket = new SampleClass(this, "Sample");

    // ❌ Should pass `this`
    new Bucket(bucket, "SampleBucket");
  }
}

export class _MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // ✅ Can use this
    const bucket = new Bucket(this, "SampleBucket");

    // ✅ when instance of Stage
    new Stage(this, "SampleStage");

    // ✅ when allowNonThisAndDisallowScope is true, can specify non-this value
    new Bucket(bucket, "SampleBucket");

    // ❌ Shouldn't use scope
    new Bucket(scope, "SampleBucket");
  }
}
