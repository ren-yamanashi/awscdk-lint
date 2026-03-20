/* eslint-disable awscdk/require-jsdoc */
import { CognitoUserPoolsAuthorizer } from "aws-cdk-lib/aws-apigateway";
import { Environment } from "aws-cdk-lib/aws-appconfig";
import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";
import { MetricFilter } from "aws-cdk-lib/aws-logs";
import { Bucket, IBucket } from "aws-cdk-lib/aws-s3/lib/bucket";
import { Construct } from "constructs";

export class MyConstruct extends Construct {
  // ✅ Can use interface public field
  public readonly bucket: IBucket;

  // ✅ Can use construct private field
  private readonly _bucket: Bucket;

  // ✅ Constructs that are not AWS resource constructs (e.g. `DockerImageAsset`) can be used
  public readonly asset: DockerImageAsset;

  // ✅ When there is no read-only resource interface, Construct types (e.g. `MetricFilter`) can be used
  public readonly metricFilter: MetricFilter;

  // ❌ Shouldn't use a cdk Resource class
  public readonly __bucket: Bucket;

  // ❌ Shouldn't use a class
  public readonly buckets: Bucket[];

  // ❌ Shouldn't use a cdk Resource class array (generics type)
  public readonly _buckets: Array<Bucket>;

  // ❌ Shouldn't use a cdk Resource class
  // CognitoUserPoolsAuthorizer is extends Authorizer and implements IAuthorizer. This case should be specified IAuthorizer.
  public readonly authorizer: CognitoUserPoolsAuthorizer;

  // ❌ Shouldn't use a cdk Resource class
  // Environment is extends EnvironmentBase and EnvironmentBase implements IEnvironment. This case should be specified IEnvironment.
  public readonly env: Environment;

  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}

export class MyClass {
  // ✅ when not a cdk Resource
  public _bucket: Bucket;
}
