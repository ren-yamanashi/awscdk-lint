---
title: eslint-plugin-awscdk - prevent-construct-id-collision
titleTemplate: ":title"
---

<script setup>
import NextRecommendedItem from '../components/NextRecommendedItem.vue'
</script>

# prevent-construct-id-collision

<NextRecommendedItem version="v5.0.0" />

This rule prohibits the use of static strings (string literals) for the IDs of Constructs instantiated within loop processing. This prevents Construct ID collisions.

If you specify a literal string for the IDs of a Construct instantiated within a loop (e.g. `for`, `forEach`, `map`), an attempt will be made to create Constructs with the same ID in every iteration. Since Construct IDs must be unique within a specific scope, this causes deployment errors.

---

#### 🔧 How to use

```js
// eslint.config.mjs
export default defineConfig([
  {
    // ... some configs
    rules: {
      "awscdk/prevent-construct-id-collision": "error",
    },
  },
]);
```

#### ✅ Correct Example

```ts
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";

class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // ✅ Literal ID outside of a loop
    new Bucket(this, "Bucket");

    // ✅ Variable ID inside forEach
    ["Id1", "Id2", "Id3"].forEach((item) => new Bucket(this, item));

    // ✅ Variable ID with template literal inside a loop
    const items = ["a", "b", "c"];
    for (const item of items) {
      new Bucket(this, `${item}Bucket`);
    }
  }
}
```

#### ❌ Incorrect Example

```ts
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";

class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // ❌ Literal ID inside forEach — all iterations create "Bucket", causing collision
    [1, 2, 3].forEach(() => new Bucket(this, "Bucket"));

    // ❌ Literal ID inside for loop — same collision issue
    for (let i = 0; i < 3; i++) {
      new Bucket(this, "Bucket");
    }

    // ❌ Using a template literal without expressions inside a loop - same collision issue
    ["a", "b", "c"].forEach(() => new Bucket(this, `Bucket`));
  }
}
```
