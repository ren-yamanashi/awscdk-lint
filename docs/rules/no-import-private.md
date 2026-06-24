---
title: awscdk-lint - no-import-private
titleTemplate: ":title"
---

<script setup>
import NotRecommendedItem from '../components/NotRecommendedItem.vue'
</script>

# no-import-private

<NotRecommendedItem />

This rule disallows importing modules from `private` directories at different hierarchical levels.

The private directory is intended to contain internal implementation that should only be used within its parent directory.  
By disallowing imports from a different hierarchy, it promotes proper modularization and encapsulation.

---

#### 🔧 How to use

::: code-group

```ts [Oxlint]
// oxlint.config.ts
export default defineConfig({
  // ... some configs
  rules: {
    "awscdk/no-import-private": "error",
  },
});
```

```js [ESLint]
// eslint.config.mjs
export default defineConfig({
  // ... some configs
  rules: {
    "awscdk/no-import-private": "error",
  },
});
```

:::

#### ✅ Correct Example

```ts
// src/constructs/my-construct.ts
import { MyConstruct } from "./private/my-construct";
```

#### ❌ Incorrect Example

```ts
// src/constructs/my-construct.ts
import { MyConstruct } from "../private/my-construct";
import { MyConstruct } from "../my-app/private/my-construct";
```
