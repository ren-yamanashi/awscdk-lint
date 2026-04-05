/* eslint-disable cdk/require-jsdoc */
/* eslint-disable cdk/require-props-default-doc */
import { IBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

// ✅ Props(interface) name follows the format of `${ConstructName}Props`
export interface MyConstructProps {
  readonly bucket?: IBucket;
}

export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string, props: MyConstructProps) {
    super(scope, id);
    console.log(props.bucket);
  }
}

// ✅ This rule does not apply to interfaces that are not Construct classes
export interface ClassArgs {
  readonly bucket?: string;
}

export class MyClass {
  constructor(props: ClassArgs) {
    console.log(props);
  }
}

// ❌ Props interface name must follow ${ConstructName}Props format
interface Props {
  readonly bucket?: string;
}

export class _MyConstruct extends Construct {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);
    console.log(props.bucket);
  }
}
