import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // ✅ Literal ID outside of a loop
    new Bucket(this, "Bucket");

    // ✅ Variable ID inside forEach
    ["Id1", "Id2", "Id3"].forEach((item) => new Bucket(this, item));

    // ✅ Variable ID with template literal inside a loop
    const items = ["a", "b", "c"];
    for (const item of items) {
      new Bucket(this, `${item}Bucket`);
    }

    // ❌ Literal ID inside forEach — all iterations create "Bucket", causing collision
    [1, 2, 3].forEach(() => new Bucket(this, "SameBucket"));

    // ❌ Literal ID inside for loop — same collision issue
    for (let i = 0; i < 3; i++) {
      new Bucket(this, "SameBucket");
    }

    // ❌ Using a template literal without expressions inside a loop - same collision issue
    ["a", "b", "c"].forEach(() => new Bucket(this, `Bucket`));
  }
}
