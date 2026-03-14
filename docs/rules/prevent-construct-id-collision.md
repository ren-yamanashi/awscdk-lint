---
title: eslint-plugin-awscdk - prevent-construct-id-collision
titleTemplate: ":title"
---

<script setup>
import NextRecommendedItem from '../components/NextRecommendedItem.vue'
import Playground from '../components/Playground.vue'
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

<Playground link="https://eslint-online-playground.netlify.app/#eNqFVUtv2zAM/iuEsUPSxUmb3tJ1GLb2UGAvrNgudYGqNpOqVSRDkvtAEGCX3Xbccftz/SWjJD/z6iWOzY/Ux48UuYisSZWc8tnw1igZTaJFIgGSKFXznAvUX3LLlTRJNAFvcTbL9Ayt+5REp+fj/fE4iQaVUfBrZ7koTYdJdFnb5iorBFaOn/GRgqwYv6FRonBnBth1ITOi0cIZq3nqT7e6wPqzVsqecAI6L6PT0mNJv8tERgP3bZRrvEdpY0qZwhSpjXlGL0JwQycOrSEB+DxX2sIC3hfpHVpYwlSrOQVlDyZOs7uYMhy5/4ZyO0pkjf9QBW1c6nNIQIImEh89OBXMGPj01LiQFigz0wri5a4DKN2jQuU4aRAD4NkEnBxy1q+qY4ocS6iz9/2pzjAawfPfX/CRW9RMwNkJqMIaniGoKTAQSuUBKPGhTL1nb7gZUBrhNYnWov1gmrNrgS4clz7aVOlTlt4EGHXBWXZApaAgZ5lrE//HNcWwBPZ6xGjeh+O36yd7y85DH7i9AULlglkEUSZXUmln5YX0AQ0cO14skKFmdQ9ql0s6xyGJF/QauJPHu9USb5Do6tXCYZbh45Wj7HDUeA3zf7/b4nfVgueff4AJYu4A/sZBqtHl1Kg/gJQVhopNyZQdW6p8MIDxAA5bmm7WM4nO2RzranaV3cbPi+gJGnJuzgZuTIEtzQRdFk7i7h/R4w0c0uP1612qrdDZItp3nzJbr7KrPfUwXR261sZRMt3KQ7yD8sYWeEnAq6rAgSxRDbMFjeDSDutJ2oyRYKnmwbvwOroN86AeHRlOuUS62eTeTI8SHKK2HazphrVPOZpU89zGwdAG08j6KooZl92wce4/xjTJCNEdT0SHFcI/a1q9C5dxJ1Ez1Eh7Yk6DCzM/bYdDmqEvYMp+mNJ2MX5P7O2N9sitWRTlLCRjzX1TtAquaW0QuO4zP6nJ84VpHzYFaq2a7eK2Rfi97B9RXXOW3rEZruxGJ3fwrhaad0uiDO9PMHfkZMpxZWmu18hFcB1t2muwwW0BbC7fDugWY7sXNwJa+24Lor3e2oDqbkTL/ziMylQ=" />
