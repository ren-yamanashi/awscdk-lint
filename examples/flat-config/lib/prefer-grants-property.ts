import { Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Topic } from "aws-cdk-lib/aws-sns";
import { Construct } from "constructs";

export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const role = new Role(this, "MyRole", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });
    const topic = new Topic(this, "MyTopic");

    // ✅ Using grants property
    topic.grants.subscribe(role);

    // ❌ Using grant* method
    topic.grantSubscribe(role);
  }
}
