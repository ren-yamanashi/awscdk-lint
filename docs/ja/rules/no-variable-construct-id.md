---
title: eslint-plugin-awscdk - no-variable-construct-id
titleTemplate: ":title"
---

<script setup>
import RecommendedItem from '../../components/RecommendedItem.vue'
import Playground from '../../components/Playground.vue'
</script>

# no-variable-construct-id

<RecommendedItem japanese />

このルールは、Construct ID に変数を使用することを禁止します。

Construct ID に変数を使用することは、以下の問題を引き起こす可能性があるため適切ではありません  
(for, while, forEach, map などのループ処理と arrow function または constructor 以外の class method の中に定義されたリソースは対象外です)

- 不要な重複
- パラメータ変更時のリソース再作成
- ID の一意性を重視するあまり、不要な文字列を混在させてしまう

---

#### 🔧 使用方法

```js
// eslint.config.mjs
export default defineConfig([
  {
    // ... some configs
    rules: {
      "awscdk/no-variable-construct-id": "error",
    },
  },
]);
```

#### ✅ 適切な例

```ts
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";

export interface MyConstructProps {
  environments: Record<string, string>;
}

class MyConstruct extends Construct {
  constructor(scope: Construct, id: string, props: MyConstructProps) {
    super(scope, id);

    // ✅ 文字列リテラルを指定している
    new Bucket(this, "Bucket");

    // ✅ ループ変数内では Construct ID に変数を指定可能
    for (const [key, value] of Object.entries(props.environments)) {
      new Bucket(this, `${key}Bucket`);
    }

    // ✅ Arrow function の内では Construct ID に変数を指定可能
    const myArrowFunction = (id: string) => new Bucket(this, id);
  }

  // ✅ Class method の内では Construct ID に変数を指定可能
  myClassMethod(id: string) {
    return new Bucket(this, id);
  }
}
```

#### ❌ 不適切な例

```ts
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";

export interface MyConstructProps {
  readonly stage: string;
}

class MyConstruct extends Construct {
  constructor(scope: Construct, id: string, props: MyConstructProps) {
    super(scope, id);

    // ❌ Construct ID に constructor の id プロパティを直接指定している
    //    (Construct ID に変数を直接指定している)
    new Bucket(this, id);

    // ❌ Construct ID に変数を含むテンプレート文字列を指定している
    new Bucket(this, `${props.stage}Bucket`);
  }
}
```

<Playground link="https://eslint-online-playground.netlify.app/#eNqFVc1u00AQfpWRhURSxQkqt4AQgnLgAK1axKWuVGd3nG7j7Fo767ZRlCM3HgFejidhdv2TTZrAJY53vvl25psfrxNHwuhCzcf3ZHQyTdaZBsgSYZaVKtGeV04ZTVkyhWDxNpfbOTp/lCWfrk5fnZ5myagzlmrmLdet6XWW3PS2pZF1iZ3jV3xikj3jJZIpa39nA5vVWnIYEY6cVSLc7myN/bE1xp0pBnovsqL12PDvJtPJyJ9NtEkfcqvyWYkpp81UtXCpkmNHnLpaVsY6WMPHzgQbKKxZBj3aI5biTaZ76IdaLDDC5Y+UCrlIWYaJ/08sAOMzjU/BQ2mHtsgFwpdVf82FNRU1+lrMpdHlClA/KGv0ErWjKVyiMFa+9bnr+Qia5zsmjjzI5XOctjY2cdr9taLMieIrgcVHLSnKNdzf52nsgDujYsIeMQIlO/4RVD7o6bM0hl2fUF1hy+Edh0EFb5hM4M+vH3AVeKBULEheEohcwwyhJpQNTuNjK+/A3SkasbrNa5Y8I/veVnWHBgpjo/w+nxE8KqbSUBpTQdcJ1DB58CCkD9cLXN2AKeB8do/CjbkGViENQsr8tq3MsE/3QLy3L9ZMtGnObn3MHhbK0oX++yd8u8NY9ZcEt0reBnnRupVPSBvnc6IKhSoUJyaV5bi45j5oxwRxlkfU2y8BX71VbRDaN+Q3AlM7UhK9AF4oLuk2hiO6DmryxXS4rMrccaihuDQ8Egsr02gZenZXIdZnw+OKVPKsjPvltJ3PxtIN3PvmdXK/N5gSC6WRo2T37Xi24IY1dnC0S+tWFZKwqnJpY4jBPOAXZT3nRtqhTatwmPLcM2J37jmcvC7Dsw9rcO3z3UmUxlxYs+TekijDAhuPeTn9B9O2YMELmyeSV+/JyeSE3ba7t512NvaxH2Jr4H5n3gzfcBGqXCy4QHvfBq9Ns2e7hR7cskTiwxlWnkkLnpfdj8ZzQT2D7xaKPwNb3BHAYa3/AT1ijBvnICBa5UcQ8UchBvRtvPkLK3uKjg==" />
