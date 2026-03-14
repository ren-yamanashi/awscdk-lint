---
title: eslint-plugin-awscdk - prevent-construct-id-collision
titleTemplate: ":title"
---

<script setup>
import NextRecommendedItem from '../../components/NextRecommendedItem.vue'
import Playground from '../../components/Playground.vue'
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

<Playground link="https://eslint-online-playground.netlify.app/#eNqFVUtv2zAM/iuEsUPSxUmb3tJ1GLb2UGAvrNgudYGqNpOqVSRDkvtAEGCX3Xbccftz/SWjJD/z6iWOzY/Ux48UuYisSZWc8tnw1igZTaJFIgGSKFXznAvUX3LLlTRJNAFvcTbL9Ayt+5REp+fj/fE4iQaVUfBrZ7koTYdJdFnb5iorBFaOn/GRgqwYv6FRonBnBth1ITOi0cIZq3nqT7e6wPqzVsqecAI6L6PT0mNJv8tERgP3bZRrvEdpY0qZwhSpjXlGL0JwQycOrSEB+DxX2sIC3hfpHVpYwlSrOQVlDyZOs7uYMhy5/4ZyO0pkjf9QBW1c6nNIQIImEh89OBXMGPj01LiQFigz0wri5a4DKN2jQuU4aRAD4NkEnBxy1q+qY4ocS6iz9/2pzjAawfPfX/CRW9RMwNkJqMIaniGoKTAQSuUBKPGhTL1nb7gZUBrhNYnWov1gmrNrgS4clz7aVOlTlt4EGHXBWXZApaAgZ5lrE//HNcWwBPZ6xGjeh+O36yd7y85DH7i9AULlglkEUSZXUmln5YX0AQ0cO14skKFmdQ9ql0s6xyGJF/QauJPHu9USb5Do6tXCYZbh45Wj7HDUeA3zf7/b4nfVgueff4AJYu4A/sZBqtHl1Kg/gJQVhopNyZQdW6p8MIDxAA5bmm7WM4nO2RzranaV3cbPi+gJGnJuzgZuTIEtzQRdFk7i7h/R4w0c0uP1612qrdDZItp3nzJbr7KrPfUwXR261sZRMt3KQ7yD8sYWeEnAq6rAgSxRDbMFjeDSDutJ2oyRYKnmwbvwOroN86AeHRlOuUS62eTeTI8SHKK2HazphrVPOZpU89zGwdAG08j6KooZl92wce4/xjTJCNEdT0SHFcI/a1q9C5dxJ1Ez1Eh7Yk6DCzM/bYdDmqEvYMp+mNJ2MX5P7O2N9sitWRTlLCRjzX1TtAquaW0QuO4zP6nJ84VpHzYFaq2a7eK2Rfi97B9RXXOW3rEZruxGJ3fwrhaad0uiDO9PMHfkZMpxZWmu18hFcB1t2muwwW0BbC7fDugWY7sXNwJa+24Lor3e2oDqbkTL/ziMylQ=" />
