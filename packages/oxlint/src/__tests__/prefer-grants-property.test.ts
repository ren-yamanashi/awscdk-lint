import { RuleTester } from "corsa-oxlint";

import { preferGrantsProperty } from "../rules/prefer-grants-property";

const ruleTester = new RuleTester({
  languageOptions: { sourceType: "module" },
});

ruleTester.run("prefer-grants-property", preferGrantsProperty, {
  valid: [
    {
      code: `
      class Topic {
        grantSubscribe() {}
      }
      const topic = new Topic();
      topic.grantSubscribe();
      `,
    },
    {
      code: `
      class Construct {}
      class HttpRoute extends Construct {
        static grantInvoke() {}
      }
      HttpRoute.grantInvoke();
      `,
    },
    {
      code: `
      class Construct {}
      class Topic extends Construct {
        grants = {};
        grantSubscribe() {}
      }
      const topic = new Topic();
      topic.grantSubscribe();
      `,
    },
    {
      code: `
      class Construct {}
      class TopicGrants {
        publish() {}
      }
      class Topic extends Construct {
        grants: TopicGrants = new TopicGrants();
        grantSubscribe() {}
      }
      const topic = new Topic();
      topic.grantSubscribe();
      `,
    },
    {
      code: `
      class Construct {}
      class TopicGrants {}
      class Topic extends Construct {
        grants: TopicGrants = new TopicGrants();
        subscribe() {}
      }
      const topic = new Topic();
      topic.subscribe();
      `,
    },
    {
      code: `
      class Construct {}
      class TopicGrants {
        subscribe() {}
      }
      class Topic extends Construct {
        grants: TopicGrants = new TopicGrants();
      }
      const topic = new Topic();
      topic.grants.subscribe();
      `,
    },
    {
      code: `
      class Construct {}
      class TopicGrants {
        publish() {}
      }
      class Topic extends Construct {
        grants: TopicGrants = new TopicGrants();
        grantPublish() {}
      }
      class Queue extends Construct {
        grants: TopicGrants = new TopicGrants();
        grantPublish() {}
      }
      declare const target: Topic | Queue;
      target.grantPublish();
      `,
    },
    {
      code: `
      class Construct {}
      class TopicGrants {
        publish() {}
      }
      class Topic extends Construct {
        grants: TopicGrants = new TopicGrants();
        grantPublish() {}
      }
      declare const topic: Topic | string;
      topic.grantPublish();
      `,
    },
    {
      code: `
      class Construct {}
      class TopicGrants {
        publish() {}
      }
      class Plain {
        grantPublish() {}
      }
      class Topic extends Construct {
        grants: TopicGrants = new TopicGrants();
        grantPublish() {}
        plain(): Plain {
          return new Plain();
        }
      }
      const topic = new Topic();
      topic.plain().grantPublish();
      `,
    },
    {
      code: `
      class Construct {}
      class TopicGrants {
        publish() {}
      }
      class Plain {
        grantPublish() {}
      }
      class Topic extends Construct {
        grants: TopicGrants = new TopicGrants();
        grantPublish() {}
      }
      const fn = Object.assign((): Topic => new Topic(), { k: (): Plain => new Plain() });
      fn["k"]().grantPublish();
      `,
    },
    {
      code: `
      class Construct {}
      class TopicGrants {
        publish() {}
      }
      class Registry extends Construct {
        grants: TopicGrants = new TopicGrants();
        grantPublish() {}
      }
      interface Registry {
        [key: string]: any;
      }
      declare const registry: Registry;
      registry["x"].grantPublish();
      `,
    },
    {
      code: `
      class Construct {}
      class TopicGrants {
        publish() {}
      }
      class Topic extends Construct {
        grants: TopicGrants = new TopicGrants();
        grantPublish() {}
      }
      class Plain {
        grantPublish() {}
      }
      function ov(value: "b"): Plain;
      function ov(value: "a"): Topic;
      function ov(value: unknown): Topic | Plain {
        return value === "a" ? new Topic() : new Plain();
      }
      ov("b").grantPublish();
      `,
    },
  ],
  invalid: [
    {
      code: `
      class Construct {}
      class TopicGrants {
        subscribe() {}
      }
      class Topic extends Construct {
        grants: TopicGrants = new TopicGrants();
        grantSubscribe() {}
      }
      const topic = new Topic();
      topic.grantSubscribe();
      `,
      errors: [{ messageId: "useGrantsProperty" }],
    },
    {
      code: `
      class Construct {}
      class TopicGrants {
        publish() {}
      }
      class Topic extends Construct {
        grants: TopicGrants = new TopicGrants();
        grantPublish() {}
      }
      const topic = new Topic();
      topic.grantPublish();
      `,
      errors: [{ messageId: "useGrantsProperty" }],
    },
    {
      code: `
      class Construct {}
      class TopicGrants {
        publish() {}
      }
      class Topic extends Construct {
        grants: TopicGrants = new TopicGrants();
        grantPublish() {}
      }
      interface MyConstructProps {
        readonly topic: Topic;
      }
      class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          props.topic.grantPublish();
        }
      }
      `,
      errors: [{ messageId: "useGrantsProperty" }],
    },
    {
      code: `
      class Construct {}
      class TopicGrants {
        publish() {}
      }
      class Topic extends Construct {
        grants: TopicGrants = new TopicGrants();
        grantPublish() {}
      }
      interface MyConstructProps {
        readonly topic?: Topic;
      }
      class MyConstruct extends Construct {
        constructor(scope: Construct, id: string, props: MyConstructProps) {
          super(scope, id);
          props.topic?.grantPublish();
        }
      }
      `,
      errors: [{ messageId: "useGrantsProperty" }],
    },
    {
      code: `
      class Construct {}
      class TopicGrants {
        publish() {}
      }
      class Topic extends Construct {
        grants: TopicGrants = new TopicGrants();
        grantPublish() {}
      }
      declare const topic: Topic | void;
      topic.grantPublish();
      `,
      errors: [{ messageId: "useGrantsProperty" }],
    },
    {
      code: `
      class Construct {}
      class TopicGrants {
        publish() {}
      }
      class Topic extends Construct {
        grants: TopicGrants = new TopicGrants();
        grantPublish() {}
      }
      declare const topic: Topic | null;
      topic.grantPublish();
      `,
      errors: [{ messageId: "useGrantsProperty" }],
    },
    {
      code: `
      class Construct {}
      class TopicGrants {
        publish() {}
      }
      class Topic extends Construct {
        grants: TopicGrants = new TopicGrants();
        grantPublish() {}
      }
      class MyConstruct extends Construct {
        run() {
          this.helper().grantPublish();
        }
        helper(): Topic {
          return new Topic();
        }
      }
      `,
      errors: [{ messageId: "useGrantsProperty" }],
    },
    {
      code: `
      class Construct {}
      class TopicGrants {
        publish() {}
      }
      class Topic extends Construct {
        grants: TopicGrants = new TopicGrants();
        grantPublish() {}
      }
      const makeTopic = (): Topic => new Topic();
      makeTopic().grantPublish();
      `,
      errors: [{ messageId: "useGrantsProperty" }],
    },
    // WHEN: the receiver indexes a Construct whose index signature yields a Construct
    {
      code: `
      class Construct {}
      class TopicGrants {
        publish() {}
      }
      class Registry extends Construct {
        grants: TopicGrants = new TopicGrants();
        grantPublish() {}
      }
      interface Registry {
        [index: number]: Registry;
      }
      declare const registry: Registry;
      registry[0].grantPublish();
      `,
      errors: [{ messageId: "useGrantsProperty" }],
    },
    // WHEN: an overloaded callee resolves to a return type with a grants property
    {
      code: `
      class Construct {}
      class TopicGrants {
        publish() {}
      }
      class Topic extends Construct {
        grants: TopicGrants = new TopicGrants();
        grantPublish() {}
      }
      class Plain {
        grantPublish() {}
      }
      function ov(value: "a"): Topic;
      function ov(value: "b"): Plain;
      function ov(value: unknown): Topic | Plain {
        return value === "a" ? new Topic() : new Plain();
      }
      ov("a").grantPublish();
      `,
      errors: [{ messageId: "useGrantsProperty" }],
    },
    {
      code: `
      class Construct {}
      class TopicGrants {
        publish() {}
      }
      class Topic extends Construct {
        grants: TopicGrants = new TopicGrants();
        grantPublish() {}
      }
      const maybe = (): Topic | undefined => new Topic();
      maybe()?.grantPublish();
      `,
      errors: [{ messageId: "useGrantsProperty" }],
    },
    // WHEN: the receiver is an array element
    {
      code: `
      class Construct {}
      class TopicGrants {
        publish() {}
      }
      class Topic extends Construct {
        grants: TopicGrants = new TopicGrants();
        grantPublish() {}
      }
      declare const topics: Topic[];
      topics[0].grantPublish();
      `,
      errors: [{ messageId: "useGrantsProperty" }],
    },
    {
      code: `
      class Construct {}
      class TopicGrants {
        publish() {}
      }
      class Topic extends Construct {
        grants: TopicGrants = new TopicGrants();
        grantPublish() {}
      }
      declare const p: Promise<Topic>;
      async function run() {
        (await p).grantPublish();
      }
      `,
      errors: [{ messageId: "useGrantsProperty" }],
    },
    // WHEN: the receiver is an array element under a non-literal index
    {
      code: `
      class Construct {}
      class TopicGrants {
        publish() {}
      }
      class Topic extends Construct {
        grants: TopicGrants = new TopicGrants();
        grantPublish() {}
      }
      declare const topics: Topic[];
      declare const index: number;
      topics[index].grantPublish();
      `,
      errors: [{ messageId: "useGrantsProperty" }],
    },
    // WHEN: the receiver is a non-null assertion over a call returning a nullable Construct
    {
      code: `
      class Construct {}
      class TopicGrants {
        publish() {}
      }
      class Topic extends Construct {
        grants: TopicGrants = new TopicGrants();
        grantPublish() {}
      }
      const maybeTopic = (): Topic | undefined => new Topic();
      maybeTopic()!.grantPublish();
      `,
      errors: [{ messageId: "useGrantsProperty" }],
    },
    // WHEN: the receiver is a generic call whose type argument is a Construct
    {
      code: `
      class Construct {}
      class TopicGrants {
        publish() {}
      }
      class Topic extends Construct {
        grants: TopicGrants = new TopicGrants();
        grantPublish() {}
      }
      const identity = <T>(value: T): T => value;
      const topic = new Topic();
      identity(topic).grantPublish();
      `,
      errors: [{ messageId: "useGrantsProperty" }],
    },
  ],
});
