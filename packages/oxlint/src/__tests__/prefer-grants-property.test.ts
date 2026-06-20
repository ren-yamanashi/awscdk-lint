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
  ],
});
