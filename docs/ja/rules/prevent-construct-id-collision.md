---
title: eslint-plugin-awscdk - prevent-construct-id-collision
titleTemplate: ":title"
---

<script setup>
import NextRecommendedItem from '../../components/NextRecommendedItem.vue'
</script>

# prevent-construct-id-collision

<NextRecommendedItem version="v5.0.0" japanese />

このルールは、ループ処理内でインスタンス化する Construct の ID に静的な文字列 (リテラル文字列) を使用することを禁止します。これにより、Construct ID の衝突を防止します。

ループ処理内 (`for`, `forEach`, `map` 等) でインスタンス化する Construct の ID にリテラル文字列 を指定すると、すべての反復処理で同じ ID を持つ Construct が作成されようとします。Construct ID は特定のスコープ内で一意である必要があるため、これはデプロイエラーの原因となります。

---

#### 🔧 使用方法

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

#### ✅ 適切な例

```ts
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";

class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // ✅ ループ外でのリテラル ID は問題なし
    new Bucket(this, "Bucket");

    // ✅ forEach 内で変数を ID に使用している
    ["Id1", "Id2", "Id3"].forEach((item) => new Bucket(this, item));

    // ✅ ループ内でテンプレートリテラルに変数を含めている
    const items = ["a", "b", "c"];
    for (const item of items) {
      new Bucket(this, `${item}Bucket`);
    }
  }
}
```

#### ❌ 不適切な例

```ts
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";

class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // ❌ forEach 内でリテラル ID を使用 — すべてのイテレーションで "Bucket" が作成され衝突する
    [1, 2, 3].forEach(() => new Bucket(this, "Bucket"));

    // ❌ for ループ内でリテラル ID を使用 — 同様に衝突する
    for (let i = 0; i < 3; i++) {
      new Bucket(this, "Bucket");
    }

    // ❌ ループ内で式を含まないテンプレートリテラルを使用 - 同様に衝突する
    ["a", "b", "c"].forEach(() => new Bucket(this, `Bucket`));
  }
}
```
