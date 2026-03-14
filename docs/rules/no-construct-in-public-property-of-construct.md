---
title: eslint-plugin-awscdk - no-construct-in-public-property-of-construct
titleTemplate: ":title"
---

<script setup>
import RecommendedItem from '../components/RecommendedItem.vue'
import Playground from '../components/Playground.vue'
</script>

# no-construct-in-public-property-of-construct

<RecommendedItem />

This rule enforces specifying interfaces for read-only resources (e.g. `IBucket`) for `public` properties of a CDK Construct.

When AWS resource Constructs (e.g. `Bucket`) implement interfaces for read-only resources (e.g. `IBucket`), it is recommended to specify the read-only resource interface (e.g. `IBucket`) for Construct `public` properties to help prevent unintended resource modifications.

---

#### 🔧 How to use

```js
// eslint.config.mjs
export default defineConfig([
  {
    // ... some configs
    rules: {
      "awscdk/no-construct-in-public-property-of-construct": "error",
    },
  },
]);
```

#### ✅ Correct Example

```ts
import { Construct } from "constructs";
import { IBucket } from "aws-cdk-lib/aws-s3";
import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";
import { MetricFilter } from "aws-cdk-lib/aws-logs";

class MyConstruct extends Construct {
  // ✅ Read-only interfaces (e.g. `IBucket`) can be used
  public readonly bucket: IBucket;

  // ✅ Constructs that are not AWS resource constructs (e.g. `DockerImageAsset`) can be used
  public readonly asset: DockerImageAsset;

  // ✅ When there is no read-only resource interface, Construct types (e.g. `MetricFilter`) can be used
  public readonly metricFilter: MetricFilter;
}
```

#### ❌ Incorrect Example

```ts
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";

class MyConstruct extends Construct {
  // ❌ When a read-only resource interface exists, Construct types (e.g. `Bucket`) should not be used
  public readonly bucket: Bucket;
}
```

<Playground link="https://eslint-online-playground.netlify.app/#eNqNVc1S2zAQfpUdnxImdjr0ZqYzpaWd4UDbgQMHzBRHXhuBLXkkuZBhcuytj9C+XJ+kK8m/IYEeIIn2+/bnW+3qKTCaSZHzIrrTUgRx8JQIgCRgsqp5ieprbbgUOglicBZrM6kq0NijJPh0cfjm8DAJFp2x5CtruWpNb5PgurdVMmtK7Ihf8JGcbBnPUcuysTE9bNWIjNIY4bRRnLnoRjXYHyspzQknoGVpxVrGhv5vEhEs7NlSyJCqJQ8NMyEXYd2sSs7CWskalVmHMh/skdEkB69qqQw8wcfuHDaQK1k5jdojkucoET309EPD7tEswH8OhPRBhyy7D0mjpf2uSZ0x8UQSXp1WaYHHWr/ERKbC1EK2Qp+hVeczLw2q/exSFp6XCHx0TFaSNzhbD1VSc1BkelS36/9yCX9//4RzTLNQinINXFCoPGWoYYZREcFNW/7NHFgqYIXQaMws16sNiriOunK4uNPL5dNH6ONqMLepgVQhCGng+PKCPGjZKIYwdKALvi3h61k4GeNn2k+zubxFQXkgJcE15eHoXoA+mV6JxUg0s64HZcbdeT2xaoSOJ50d5fbn175gfRf0rWzKzInXRoNcKmgvPUe9K/j3rjl9b2jI6K9XXKoZbY4a4yH+AngWg51PUcy7daEbiuKh1j53noC05DryMeAdCHxoA82sYUF39mztD5JgQmnz+j8ODb6ffdQldSfqN90w2N7SDcp7/3N5tzVWGeZcIBVK9GGsWrD3OiYYPXXr+sIUr03oDWMwDea3sim4mLoNa3cY0rwSYjqtlE7alO6zT2t2ZSueFKojhbTHK5pjzNw2jCLaaq9g2r7ltP212+MHB8sDog2LvF0NZOxz3+XNw+0Cvp4fURPqlN3TdG09NFYbv7S718HRkiDDHydYW0+C2Us6eYGeC2o9lKlBPX5TBtwewG6tX4DuMY4vzk7AaAXvQYxfkzGgu8jB5h8TVKYR" />
