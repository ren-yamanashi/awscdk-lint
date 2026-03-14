---
title: eslint-plugin-awscdk - no-mutable-public-property-of-construct
titleTemplate: ":title"
---

<script setup>
import RecommendedItem from '../../components/RecommendedItem.vue'
import FixableItem from '../../components/FixableItem.vue'
import Playground from '../../components/Playground.vue'
</script>

# no-mutable-public-property-of-construct

<RecommendedItem japanese />
<FixableItem japanese />

このルールは、CDK Construct の `public` プロパティに `readonly` 修飾子を指定することを強制します

CDK Construct は多くの場合、状態を持つ AWS リソースを表します。  
これらの `public` プロパティを `readonly` にすることで、Construct のインスタンス化後に意図しない変更が加えられることを防ぎます。

---

#### 🔧 使用方法

```js
// eslint.config.mjs
export default defineConfig([
  {
    // ... some configs
    rules: {
      "awscdk/no-mutable-public-property-of-construct": "error",
    },
  },
]);
```

#### ✅ 適切な例

```ts
import { Construct } from "constructs";
import { IBucket } from "aws-cdk-lib/aws-s3";
import { Topic } from "aws-cdk-lib/aws-sns";

export class MyConstruct extends Construct {
  // ✅ public プロパティに `readonly` 修飾子が指定されている
  public readonly bucket: IBucket;
  // ✅ public でないプロパティには、このルールは適用されない
  private topic: Topic;
}
```

#### ❌ 不適切な例

```ts
import { Construct } from "constructs";
import { IBucket } from "aws-cdk-lib/aws-s3";

export class MyConstruct extends Construct {
  // ❌ public プロパティに `readonly` 修飾子が指定されていない
  public bucket: IBucket;
}
```

<Playground link="https://eslint-online-playground.netlify.app/#eNqdVEuS0zAQvYrKK0iNbSrswoaCYcGCT8FyPAtZbgdNZEmlDzOpVJbsOAJcjpPQkn9ySJiq2eTT/br7+XU/HzJnmZIt3xZ3Vslskx0qSUiVMdVpLsB80o4raatsQ2Im5Bw1W3AhVGXvvq5frNdVdjUmBa9D5mZIvayy2ynXqcYLGAs/wgM2OUl+AauEDzN7WO1lgzQSnHWGszjdGQ9T2CjlrjkCQ5U1bKg44uexktlViJVS5Z13tBaQa18LznJtlAbj9rlqcxQCm3vmCmdRCd5pZRw5kLdjnBxJa1QX5RlCqMyrSk7Q928820ECpPc2Z80uR1nK8NuiIFhQSXiIJUxQa8mH/TwDVQHZ2GRqFL4syZ9fP0hPmxigjZJiTwb+HCyhBggVQt1DEwpOkXVkthkpIgnU5Wk8fv8cuyfj7TflRUNqmEYmLM4Mx5WAFVy6YjrAWfQ+M4r4uv9b3p2o3UDLJSBBLJ8lH8B917TA2WVbt9dgmeHa5X0iBePSPgu/5XLZNtcxmOMuEbHcJdKhXsTvidazm6DC4kFtYQDt1aG60MQjLQq8uEcwg/taNKWN9lqtyhWWzf4aFobJifu5bj08+OL2ObLHNWjKdnQLJ2+AoE7vptG2sbDKGvh+DTr0kgwXv3w1/Ctp6CCoA5uafcZdAJxX+z/QC8n0dM4CEoNeQKReTwFRxnDIx78YRNFn" />
