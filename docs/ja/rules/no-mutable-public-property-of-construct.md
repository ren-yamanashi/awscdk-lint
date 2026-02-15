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

<Playground link="https://eslint-online-playground.netlify.app/#eNqdVMuS0zAQ/BWVT5Ba21S4hQsFy4EDj4Ljeg+yPA7ayJJKD3ZTqRy58Qnwc3wJI/klh4St2kse6p6Zdo/ah8xZpmTLt8WdVTLbZIdKElJlTHWaCzCftONK2irbkIgEzFGzBReOquzd1/WL9brKrkZQ8DogNwP0sspuJ6xTjRcwFn6EB2xyAn4Bq4QPM3ta7WWDMhKedYazON0ZD9OxUcpdcySGKmvYUHHEz2Mls6twVkqVd97RWkCufS04y7VRGozb56rN0Qhs7pkrnEUneKeVceRA3o7n5Ehao7poz3CEzryq5ER9/8azHSREem9z1uxytKUMvy0aggWVhIdYwgS1lnzYzzPQFZCNTaZG48uS/Pn1g/SyiQHaKCn2ZNDPwRJqgFAh1D00oeCUWUdlm1EiikBfnqbj98+xezLeflNeNKSGaWSi4sxwXAlYwaUrpgs4m94jo4mv+7/l3YnbDbRcAgrE8tnygdx3TQucXbZ1ew2WGa5d3gMpGZf2Wfgtl8u2uY6HOe4SGctdohzqRfyeZD27CS4sHtQWBjBeHboLTbykRYE37hHOkL4WQ2ljvFarcoVlc76GhSE4aT/XraeHXNw+R/W4Bk3Zjm7h5A0Q3OnTNMY2FlZZA9+vQYdekuHil6+Gfy0NHQR1YNOwz7wLhPNu/4d6AUzyd4GRRjklRJfCPT3+Bd2sxzc=" />
