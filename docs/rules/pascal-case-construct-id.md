---
title: eslint-plugin-awscdk - pascal-case-construct-id
titleTemplate: ":title"
---

<script setup>
import RecommendedItem from '../components/RecommendedItem.vue'
import FixableItem from '../components/FixableItem.vue'
import Playground from '../components/Playground.vue'
</script>

# pascal-case-construct-id

<RecommendedItem />
<FixableItem />

This rule enforces writing Construct IDs in PascalCase.

Enforcing a consistent naming convention helps developers manage logical IDs more easily, and as a result, helps reduce the risk of unintentional logical ID collisions.

---

#### 🔧 How to use

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

#### ✅ Correct Example

```ts
import { Bucket } from "aws-cdk-lib/aws-s3";

// ✅ Can use PascalCase
const bucket = new Bucket(this, "MyBucket");
```

#### ❌ Incorrect Example

```ts
import { Bucket } from "aws-cdk-lib/aws-s3";

// ❌ Shouldn't use camelCase
const bucket = new Bucket(this, "myBucket");

// ❌ Shouldn't use snake_case
const bucket = new Bucket(this, "my_bucket");

// ❌ Shouldn't use kebab-case
const bucket = new Bucket(this, "my-bucket");
```

<Playground link="https://eslint-online-playground.netlify.app/#eNqNVMtu2zAQ/BWCl6aGJRXuLb0UdXpsGzTHMAhoau0wokiBjyaB4WNv/YT25/olXVKyJLtWkostcWaH3OGOttQ7YfRabvJ7ZzQ9p1umCWFUmLqRCuy3xkujHaPnJCER89xuwMclRj9fLd4tFozO96CSq4hcd9B7Rm96rDZlULAv/AqPKHIEfgdnVIh7trRV0CUeY8Rz3kqRdvc2QL9sjfEXEomxylnRVezwd8c0nce1ouFOcJUJ7iDDtlEqCJ/JMvcOW5d1Y6wnW/IpiAo82ZG1NTXK8QeXibLKsLciPjvs6gPTTBcF+fv7J1lyTYIDcpnkl6jOtIaHTufM30k3R5kvT+0Co2/76j+/yNWdCarUb3zSELyGaYn6NRJO8wpuY5MTGrerl0UqWPFVcmpCJBtE0F1wSmqf97M02Nkieys/tq/FPY4Ubt5bXsJaalim8sH4jtyqjgu8O5T1Tw04YWXjsxYYk/HqLlXYSH0omzVpMcMbRUZ3o/CYSvA4PKj03x/r7DoO1EGjLreASalBl1CmectznKUXOF2Q1pgvl5IymxUzLBuigslAegT7s59Sa+lxxG/SJTRcVHwDR1GO3rSx2OcvlTFawo8LaKKSFhKOMv6/oVFBcQ9unNqBN0E47fUz1AlwPDgnCaOQTjD6xB9JJBPxM0F3/wACHLe7" />
