import { IBucket } from "aws-cdk-lib/aws-s3";

export interface MyConstructProps {
  // ✅ `@default` JSDoc comment for optional property
  /**
   * @default - No S3 bucket
   */
  readonly bucket?: IBucket;
}

// ✅ This rule does not apply to interfaces that are not Props
export interface Config {
  /** sample jsdoc */
  readonly bucket?: IBucket;
}

export interface _MyConstructProps {
  // ❌ Must write `@default` JSDoc comment
  /** sample jsdoc */
  readonly bucket?: IBucket;
}

export interface StackProps {
  // ❌ Must write `@default` JSDoc comment
  /** Some description without default value */
  readonly bucket?: IBucket;
}
