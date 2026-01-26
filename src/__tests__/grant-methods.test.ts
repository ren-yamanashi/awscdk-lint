import { RuleTester } from "@typescript-eslint/rule-tester";

import { grantMethods } from "../rules/grant-methods";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts*"],
      },
    },
  },
});

ruleTester.run("grant-methods", grantMethods, {
  valid: [
    // WHEN: class does not have grants property
    {
      code: `
      class HttpRoute {
        static grantInvoke() {}
      }
      HttpRoute.grantInvoke();
      `,
    },
    // WHEN: grants property type does not end with Grants
    {
      code: `
      class Topic {
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
      class TopicGrants {
        publish() {}
      }
      class Topic {
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
      class TopicGrants {}
      class Topic {
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
      class TopicGrants {
        subscribe() {}
      }
      class Topic {
        grants: TopicGrants = new TopicGrants();
      }
      const topic = new Topic();
      topic.grants.subscribe();
      `,
    },
  ],
  invalid: [
    // WHEN: class has grants property with Grants suffix and method exists
    {
      code: `
      class TopicGrants {
        subscribe() {}
      }
      class Topic {
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
      class TopicGrants {
        publish() {}
      }
      class Topic {
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
