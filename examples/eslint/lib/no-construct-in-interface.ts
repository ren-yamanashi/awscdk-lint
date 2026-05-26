/* eslint-disable awscdk/require-jsdoc */
import { CognitoUserPoolsAuthorizer } from "aws-cdk-lib/aws-apigateway";
import { Environment } from "aws-cdk-lib/aws-appconfig";
import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";
import { MetricFilter } from "aws-cdk-lib/aws-logs";
import { Bucket, IBucket } from "aws-cdk-lib/aws-s3";

export interface MyConstructProps {
  // ✅ Can use an interface
  readonly bucket: IBucket;

  // ✅ Constructs that are not AWS resource constructs (e.g. `DockerImageAsset`) can be used
  readonly asset: DockerImageAsset;

  // ✅ When there is no read-only resource interface, Construct types (e.g. `MetricFilter`) can be used
  readonly metricFilter: MetricFilter;

  // ❌ Shouldn't use a cdk Resource
  readonly _bucket: Bucket;

  // ❌ Shouldn't use a cdk Resource array
  readonly buckets: Bucket[];

  // ❌ Shouldn't use a cdk Resource array (generics type)
  readonly _buckets: Array<Bucket>;

  // ❌ Shouldn't use a cdk Resource
  // CognitoUserPoolsAuthorizer is extends Authorizer and implements IAuthorizer. This case should be specified IAuthorizer.
  readonly authorizer: CognitoUserPoolsAuthorizer;

  // ❌ Shouldn't use a cdk Resource
  // Environment is extends EnvironmentBase and EnvironmentBase implements IEnvironment. This case should be specified IEnvironment.
  readonly env: Environment;
}
