/* eslint-disable cdk/require-jsdoc */
import { IBucket } from "aws-cdk-lib/aws-s3";

export interface MyConstructProps {
  // ✅ Can use readonly
  readonly bucket: IBucket;

  // ❌ Shouldn't use mutable
  _bucket: IBucket;
}
