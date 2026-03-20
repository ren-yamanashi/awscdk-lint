/* eslint-disable awscdk/construct-constructor-property */
/* eslint-disable awscdk/require-jsdoc */
import { App, Stack, Stage } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

class SampleClass extends Construct {
  constructor(scope: Construct, validId: string) {
    super(scope, validId);
  }
}

export interface MyConstructProps {
  readonly stage: string;
  readonly environments: Record<string, string>;
}

export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string, props: MyConstructProps) {
    super(scope, id);

    // ✅ Can use a literal
    new Bucket(this, "Bucket");

    // ✅ When property name is not "id"
    new SampleClass(this, id + "BucketConstruct");

    // ✅ Can use a loop variable
    for (const [key] of Object.entries(props.environments)) {
      new Bucket(this, `${key}Bucket`);
    }

    Object.keys(props.environments).forEach((key) => {
      new Bucket(this, `${key}Bucket`);
    });

    // ❌ Shouldn't use a parameter as a construct ID
    new Bucket(this, id);

    // ❌ Shouldn't combine a parameter into a template string
    new Bucket(this, `${id}Bucket`);

    // ❌ Shouldn't combine a parameter into any expression
    new Bucket(this, id + "Bucket");

    // ❌ Shouldn't use a prop straight-up either
    new Bucket(this, `${props.stage}Bucket`);
  }
}

export class MyStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    // ❌ Shouldn't use a parameter as a construct ID
    new MyConstruct(this, id + "MyConstruct2", {
      environments: { staging: "value" },
      stage: id,
    });
  }
}

// ✅ Can use variable stack ID
const app = new App({});
new MyStack(app, 1 + "MyStack");
app.synth();

// ✅ when instance of Stage
new Stage(app, 1 + "StageConstruct");
