---
title: eslint-plugin-awscdk - prefer-grants-property
titleTemplate: ":title"
---

<script setup>
import RecommendedItem from '../components/RecommendedItem.vue'
import Playground from '../components/Playground.vue'
</script>

# prefer-grants-property

<RecommendedItem />

Historically, L2 constructs that represent resources with access controls have used `grant*` methods (e.g., `topic.grantPublish(role)`). AWS CDK has introduced a new pattern using Grants classes, and a more convenient `grants` property has been added.

While `grant*` methods are still available, they are now discouraged as stated in [PR#35782](https://github.com/aws/aws-cdk/pull/35782):

> The grantPublish etc methods on the L2 are now no longer recommended (though they will not be deprecated immediately to not disrupt existing code too much).

This rule enforces using the `grants` property instead of `grant*` methods for AWS CDK L2 constructs that support the new Grants class pattern.

---

#### 🔧 How to use

```ts
// eslint.config.mjs
export default defineConfig([
  {
    // ... some configs
    rules: {
      "awscdk/prefer-grants-property": "error",
    },
  },
]);
```

#### ✅ Correct Example

```ts
import { Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Topic } from "aws-cdk-lib/aws-sns";

const role = new Role(stack, "MyRole", {
  assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
});
const topic = new Topic(stack, "MyTopic");

// ✅ Use grants property
topic.grants.subscribe(role);
topic.grants.publish(role);
```

#### ❌ Incorrect Example

```ts
import { Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Topic } from "aws-cdk-lib/aws-sns";

const role = new Role(stack, "MyRole", {
  assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
});
const topic = new Topic(stack, "MyTopic");

// ❌ Avoid using grant* methods when grants property is available
topic.grantSubscribe(role);
topic.grantPublish(role);
```

<Playground link="https://eslint-online-playground.netlify.app/#eNqFVM1y0zAQfhWNTkkmdphyC8MMA+VY6LRwqntQ5E2qVpY0Wrlt6OTIjUeAl+NJWMm/SRt6SWztt9/ufvq8TzygtGatNvktWsOX/KkwjBVc2sopDf6rC8oaLPiSpUiMBeE3EOJRwT9fnrw5OSn4vAtqtYqRqzb0tuDXfayyZa2hS/wCj0RyELwAtLqONRvYqjYltTHCYfBKpurB19Afe2vDqSJgzEIv24wd/e4Kw+fxbOEESqEzKRAyGpuoahkyVeYBaXRVOesDe2IXVsOcXYK/VxLOvTJSOaHZjq29rYhePGAmy7uMZl3EZyWqgr8rTE/wzTolj+MxCjrGf+p6GXL69hpoYeAxgaUWiOxsO6SQjGBKHJGkm+oJrJ/QHTtYDog5U+WSRSXNZtpdLNYOWmiMT6lqPE48zJMk7D0z8JDUmYQbhXNq82wbX0nsjoUx6q+uoPy4XSb4oYwT8oioVqXIRSV+WEOC5OS2gk/bu9ztVw5Jy6Z00nVUO71TZhIopiwW7O/vn+w70mBs44UJyJyniXzYNohElzehHOsVSq9WMInzdXX3IK5eaYU3PWCo8+fXuM6MVRBubPmM4vK1GucHFUiBzrOAWplA8rRf6GDSJtKZ5UPzurg98FUJa2WArp3SB2u14IZ1nBBwnzZsHcTeXciawBhMhj7X9UaZfdrMpcOMrpUQ+96ldkSt03/f1uQqTrw3KOYeyBEVuRrKZIo8py/0FUzrvzVtLUz7ZzZbzChtWEDth0LBvveX2Bp4XBzX03d0CU7IO7GBgwUZtWmWTbfVUlrBS7g/BReZyO9wsDmfCxoZtAiA41044I4AXtb6P9AjwbFxXgSMVtcRxHhRjQGdkfnuH3NGLLc=" />
