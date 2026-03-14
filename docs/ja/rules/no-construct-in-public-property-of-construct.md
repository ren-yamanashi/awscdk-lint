---
title: eslint-plugin-awscdk - no-construct-in-public-property-of-construct
titleTemplate: ":title"
---

<script setup>
import RecommendedItem from '../../components/RecommendedItem.vue'
import Playground from '../../components/Playground.vue'
</script>

# no-construct-in-public-property-of-construct

<RecommendedItem japanese />

このルールは、CDK Construct の `public` プロパティに指定する型として、書き込み可能な CDK Construct 型 (例: `Bucket`) の代わりに読み取り専用リソースのための interface (例: `IBucket`) を指定することを強制します。

AWS リソースを表す Construct (例: `Bucket`) が、読み取り専用リソースのための interface (例: `IBucket`) を implements している場合、Construct の `public` プロパティには、読み取り専用リソースのための interface (例: `IBucket`) を指定することが推奨されます。  
これにより、意図しないリソースの変更を防ぐことができます。

---

#### 🔧 使用方法

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

#### ✅ 適切な例

```ts
import { Construct } from "constructs";
import { IBucket } from "aws-cdk-lib/aws-s3";
import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";
import { MetricFilter } from "aws-cdk-lib/aws-logs";

class MyConstruct extends Construct {
  // ✅ 読み取り専用リソースのための interface (`IBucket` など) を指定している
  public readonly bucket: IBucket;

  // ✅ AWS リソースを表す Construct でない Construct (`DockerImageAsset` など) を指定している
  public readonly asset: DockerImageAsset;

  // ✅ 読み取り専用リソースのための interface が存在しない場合、
  //    AWS リソースを表す Construct 型 (`MetricFilter` など) は指定可能
  public readonly metricFilter: MetricFilter;
}
```

#### ❌ 不適切な例

```ts
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";

class MyConstruct extends Construct {
  // ❌ 読み取り専用リソースのための interface が存在する場合、 AWS リソースを表す Construct は指定不可
  //    (Bucket は `IBucket` を implements しているため、`IBucket` を指定すべき)
  public readonly bucket: Bucket;
}
```

<Playground link="https://eslint-online-playground.netlify.app/#eNqNVc1S2zAQfpUdnxImdjr0ZqYzpaWd4UDbgQMHzBRHXhuBLXkkuZBhcuytj9C+XJ+kK8m/IYEeIIn2+/bnW+3qKTCaSZHzIrrTUgRx8JQIgCRgsqp5ieprbbgUOglicBZrM6kq0NijJPh0cfjm8DAJFp2x5CtruWpNb5PgurdVMmtK7Ihf8JGcbBnPUcuysTE9bNWIjNIY4bRRnLnoRjXYHyspzQknoGVpxVrGhv5vEhEs7NlSyJCqJQ8NMyEXYd2sSs7CWskalVmHMh/skdEkB69qqQw8wcfuHDaQK1k5jdojkucoET309EPD7tEswH8OhPRBhyy7D0mjpf2uSZ0x8UQSXp1WaYHHWr/ERKbC1EK2Qp+hVeczLw2q/exSFp6XCHx0TFaSNzhbD1VSc1BkelS36/9yCX9//4RzTLNQinINXFCoPGWoYYZREcFNW/7NHFgqYIXQaMws16sNiriOunK4uNPL5dNH6ONqMLepgVQhCGng+PKCPGjZKIYwdKALvi3h61k4GeNn2k+zubxFQXkgJcE15eHoXoA+mV6JxUg0s64HZcbdeT2xaoSOJ50d5fbn175gfRf0rWzKzInXRoNcKmgvPUe9K/j3rjl9b2jI6K9XXKoZbY4a4yH+AngWg51PUcy7daEbiuKh1j53noC05DryMeAdCHxoA82sYUF39mztD5JgQmnz+j8ODb6ffdQldSfqN90w2N7SDcp7/3N5tzVWGeZcIBVK9GGsWrD3OiYYPXXr+sIUr03oDWMwDea3sim4mLoNa3cY0rwSYjqtlE7alO6zT2t2ZSueFKojhbTHK5pjzNw2jCLaaq9g2r7ltP212+MHB8sDog2LvF0NZOxz3+XNw+0Cvp4fURPqlN3TdG09NFYbv7S718HRkiDDHydYW0+C2Us6eYGeC2o9lKlBPX5TBtwewG6tX4DuMY4vzk7AaAXvQYxfkzGgu8jB5h8TVKYR" />
