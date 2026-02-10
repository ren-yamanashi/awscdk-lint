---
title: eslint-plugin-awscdk - pascal-case-construct-id
titleTemplate: ":title"
---

<script setup>
import RecommendedItem from '../../components/RecommendedItem.vue'
import FixableItem from '../../components/FixableItem.vue'
import Playground from '../../components/Playground.vue'
</script>

# pascal-case-construct-id

<RecommendedItem japanese />
<FixableItem japanese />

このルールは、Construct ID を PascalCase で記述することを強制します

一貫した命名規則を強制することで、開発者が論理 ID を管理しやすくし、結果として意図しない論理 ID の衝突リスクを低減するのに役立ちます

---

#### 🔧 使用方法

```js
// eslint.config.mjs
export default defineConfig([
  {
    // ... some configs
    rules: {
      "awscdk/pascal-case-construct-id": "error",
    },
  },
]);
```

#### ✅ 適切な例

```ts
import { Bucket } from "aws-cdk-lib/aws-s3";

// ✅ PascalCase
const bucket = new Bucket(this, "MyBucket");
```

#### ❌ 不適切な例

```ts
import { Bucket } from "aws-cdk-lib/aws-s3";

// ❌ camelCase
const bucket = new Bucket(this, "myBucket");

// ❌ snake_case
const bucket = new Bucket(this, "my_bucket");

// ❌ kebab-case
const bucket = new Bucket(this, "my-bucket");
```

<Playground link="https://eslint-online-playground.netlify.app/#eNqNVMty0zAU/RWNNpRMbDNhVzYMKUugQ5dVpyPLN6lqWfLoQdvJZMmOT4Cf40u4kh3bCTVlk9g65x7pHt3jHfVOGL2R2/zeGU3P6Y5pQhgVpmmlAvul9dJox+g5SUjEPLdb8HGJ0Y9XqzerFaPLA6hkGZHrHnrL6M2ANaYKCg6Fn+ERRU7Ar+CMCnHPjlYGXeExJjznrRRpd28DDMvWGH8hkRirnBV9xR5/90zTZVwrWu4EV5ngDjJsG6WC8Jmscu+wddm0xnqyIx+CqMGTPdlY06Acf3CZqOoMeyvis8Ou3jHNdFGQ3z+/kzXXJDggl0l+jepMa3jodc78nXRLlPn01C0w+nqo/vWDXN2ZoCr9yicNwRuYl2j+R8JpXsNtbHJG47Z8WaSGkpfJqRmRbBRBd8EpqX0+zNJoZ4ccrHzfvRb3OFK4+WB5BRupYZ3KR+N7cqc6LfDuWNY/teCEla3POmBKxqu7VGEr9bFs1qbFDG8UGf2NwmMqwePwoNL/cKyz6zhQR4263AImpQFdQZXmLc9xll7g9EHaYL5cSspiUSywbIwKJgPpERzO/pxaR48jfpMuoeWi5ls4iXL0povFIX+pjNEKvl1AG5W0kHCS8b8NjQqKe3DT1I68GcLzXv+DOgNOMjjDGAKdOhkJySP8CtD9HxbsrYs=" />
