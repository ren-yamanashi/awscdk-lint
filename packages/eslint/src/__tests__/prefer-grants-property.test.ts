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
  ],
});
