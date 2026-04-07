/* eslint-disable awscdk/require-props-default-doc */
/* eslint-disable awscdk/require-jsdoc */
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

interface MyConstructProps {
  readonly bucketName: string;
  readonly enableVersioning?: boolean;
}

export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string, props: MyConstructProps) {
    super(scope, id);

    // ✅ All props properties are used
    new Bucket(this, "MyBucket", {
      bucketName: props.bucketName,
      versioned: props.enableVersioning ?? false,
    });
  }
}

interface _MyConstructProps {
  readonly bucketName: string;
  readonly enableVersioning: boolean;
  readonly unusedProp: string; // ❌ This property is never used
}

export class _MyConstruct extends Construct {
  constructor(scope: Construct, id: string, props: _MyConstructProps) {
    super(scope, id);

    new Bucket(this, "MyBucket", {
      bucketName: props.bucketName,
      versioned: props.enableVersioning,
    });
  }
}
