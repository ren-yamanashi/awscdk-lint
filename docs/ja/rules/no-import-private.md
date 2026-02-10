---
title: eslint-plugin-awscdk - no-import-private
titleTemplate: ":title"
---

<script setup>
import NotRecommendedItem from '../../components/NotRecommendedItem.vue'
</script>

# no-import-private

<NotRecommendedItem japanese />

このルールは、異なる階層レベルの `private` ディレクトリからの import を禁止します。

`private` ディレクトリは、親ディレクトリ内でのみ使用される内部実装を格納することを目的としています。  
異なる階層からの import を禁止することで、適切なモジュール化とカプセル化を促進します。

---

#### 🔧 使用方法

```js
// eslint.config.mjs
export default defineConfig([
  {
    // ... some configs
    rules: {
      "awscdk/no-import-private": "error",
    },
  },
]);
```

#### ✅ 適切な例

```ts
// src/constructs/my-construct.ts

// ✅ 同じ階層レベルの `private` ディレクトリからの import
import { MyConstruct } from "./private/my-construct";
```

#### ❌ 不適切な例

```ts
// src/constructs/my-construct.ts

// ❌ 異なる階層レベルの `private` ディレクトリからの import
import { MyConstruct } from "../private/my-construct";
import { MyConstruct } from "../my-app/private/my-construct";
```
