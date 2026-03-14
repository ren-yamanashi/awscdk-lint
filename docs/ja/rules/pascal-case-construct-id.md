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

<Playground link="https://eslint-online-playground.netlify.app/#eNqNVMtu2zAQ/BWCl6aGJRXuLb0UdXpsGzTHMAhoau0wokiBjyaB4WNv/YT25/olXVKyJLtWkostcWaH3OGOttQ7YfRabvJ7ZzQ9p1umCWFUmLqRCuy3xkujHaPnJCER89xuwMclRj9fLd4tFozO96CSq4hcd9B7Rm96rDZlULAv/AqPKHIEfgdnVIh7trRV0CUeY8Rz3kqRdvc2QL9sjfEXEomxylnRVezwd8c0nce1ouFOcJUJ7iDDtlEqCJ/JMvcOW5d1Y6wnW/IpiAo82ZG1NTXK8QeXibLKsLciPjvs6gPTTBcF+fv7J1lyTYIDcpnkl6jOtIaHTufM30k3R5kvT+0Co2/76j+/yNWdCarUb3zSELyGaYn6NRJO8wpuY5MTGrerl0UqWPFVcmpCJBtE0F1wSmqf97M02Nkieys/tq/FPY4Ubt5bXsJaalim8sH4jtyqjgu8O5T1Tw04YWXjsxYYk/HqLlXYSH0omzVpMcMbRUZ3o/CYSvA4PKj03x/r7DoO1EGjLreASalBl1CmectznKUXOF2Q1pgvl5IymxUzLBuigslAegT7s59Sa+lxxG/SJTRcVHwDR1GO3rSx2OcvlTFawo8LaKKSFhKOMv6/oVFBcQ9unNqBN0E47fUz1AlwPDgnCaOQTjD6xB9JJBPxM0F3/wACHLe7" />
