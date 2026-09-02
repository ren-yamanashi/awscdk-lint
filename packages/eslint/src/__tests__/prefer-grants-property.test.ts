import { RuleTester } from "@typescript-eslint/rule-tester";

import { preferGrantsProperty } from "../rules/prefer-grants-property";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts*"],
      },
    },
  },
});

ruleTester.run("prefer-grants-property", preferGrantsProperty, {
  valid: [
    // WHEN: class does not extend Construct
    {
      code: `
      class Topic {
        grantSubscribe() {}
      }
      const topic = new Topic();
      topic.grantSubscribe();
      `,
    },
    // WHEN: class does not have grants property
    {
      code: `
      class Construct {}
      class HttpRoute extends Construct {
        static grantInvoke() {}
      }
      HttpRoute.grantInvoke();
      `,
    },
    // WHEN: grants property type does not end with Grants
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
    // WHEN: grants type does not have the suggested method
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
    // WHEN: method does not start with grant
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
    // WHEN: already using grants property
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
    // WHEN: the call receiver returns a type without a grants property
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
    // WHEN: the call receiver indexes a callee out of a callable object
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
    // WHEN: the receiver indexes a Construct whose index signature yields a non-Construct
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
  ],
  invalid: [
    // WHEN: class has grants property with Grants suffix and method exists
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
    // WHEN: grantPublish is called and grants.publish exists
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
    // WHEN: the receiver is a method call
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
    // WHEN: the receiver is a function call
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
    // NOTE: the Oxlint plugin skips this receiver, see corsa-bind#472
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
  ],
});
