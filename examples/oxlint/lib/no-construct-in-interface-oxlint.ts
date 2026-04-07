/* eslint-disable awscdk/require-jsdoc */
import { Bucket, IBucket } from "aws-cdk-lib/aws-s3";

export interface MyConstructProps {
  // ✅ Can use an interface
  readonly bucket: IBucket;

  // ❌ Shouldn't use a cdk Resource
  readonly _bucket: Bucket;

  // ❌ Shouldn't use a cdk Resource array
  readonly buckets: Bucket[];
}
