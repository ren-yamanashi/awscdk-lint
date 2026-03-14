---
title: eslint-plugin-awscdk - no-construct-stack-suffix
titleTemplate: ":title"
---

<script setup>
import RecommendedItem from '../../components/RecommendedItem.vue'
import Playground from '../../components/Playground.vue'
</script>

# no-construct-stack-suffix

<RecommendedItem japanese />

このルールは Construct ID および Stack ID に、 "Construct" または "Stack" という文字列を含めることを禁止します。

Construct ID に "Construct" という文字列が含まれていると、CDK の世界で止めるべき問題が CloudFormation テンプレートおよび AWS の世界に漏れてしまうため、好ましくありません。(Stack ID についても同様です)

---

#### 🔧 使用方法

```ts
// eslint.config.mjs
export default defineConfig([
  {
    // ... some configs
    rules: {
      "awscdk/no-construct-stack-suffix": "error",
    },
  },
]);
```

#### ✅ 適切な例

```ts
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";

export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // ✅ "Construct" および "Stack" 文字列が含まれていない
    const bucket = new Bucket(this, "MyBucket");
  }
}
```

#### ❌ 不適切な例

```ts
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";

export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // ❌ "Construct" 文字列が含まれている
    const bucket = new Bucket(this, "BucketConstruct");

    // ❌ "Stack" 文字列が含まれている
    new Stack(this, "MyStack");
  }
}
```

## オプション

```ts
type Options = {
  disallowedSuffixes: Array<"Construct" | "Stack">;
};

const defaultOptions: Options = {
  disallowedSuffixes: ["Construct", "Stack"],
};
```

### disallowedSuffixes

禁止する suffix の配列。"Construct"、"Stack"、または両方を含めることができます。

`{ disallowedSuffixes: ["Construct"] }` とした場合

#### ✅ 適切な例

```ts
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";

export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // ✅ "Construct" 文字列が含まれていない
    new Stack(this, "MyStack");
  }
}
```

#### ❌ 不適切な例

```ts
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Stack } from "aws-cdk-lib";

export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // ❌ "Construct" 文字列が含まれている
    const bucket = new Bucket(this, "BucketConstruct");
  }
}
```

<Playground link="https://eslint-online-playground.netlify.app/#eNq9Vb2S2jAQfhWNm9wx2M6QjjT5IeUlmVCeKXz2GnQIySPJAYahTJdHSF4uT5LVj22ZGNJdA/but7ufVt+uT5FWheAVXSfPSvBoHp0yTkgWFWJXUwbyS62p4CqL5sR6jE/ncg3amLLo03L2ejbLomnrZPTJeB69600WrTrfTpQNgzbwMxwwyYXzGyjBGlPTwZ4aXiKNAKe0pIWtrmUDnVkKoRcUgSZKycJHnPH3nPFoamwpFzGeFjM0hY6VzottrJqqoodEKzw73dVCanIiH1sQOZNKip1tiDdhL95mvIN+aIotBLh8r+Ki3MbYh9Q8K+xAiF+aqqNwi8s4HCyyYLlS5OHYU8F2AS9VQM7eSEdMyDu8yxrmPWJKaDknpmN8fd9eoGpq8FDjv7dVjSNNyZ9fP8h7xsQeSkIrojeAHLt0WURyXqLFHgLfXPNILoFwoUle18gQSpeOw953505vqJpi3MPRGbJoWPX3T7LciIaVNk2jYKSyq3U1tXsNAq5U4K/6Ap5+d54+uTUEtD3A5ERNoaRQUKAY5TrpxqcXkPO0V/zOvabPF8opoaIckDGG94LwYJc1DNBqmFYfa1CFpLWOnSMEo6S+smZN+TBtXFtjjKpDxFBwSCdvmP3vaN09mvMODqoSCbgcdvai7YglCU7PfzBeehWuFGWXw2SSTjCs3w5e3ejsuI9la+ESdwWCfV57xwuqciNdIjg73hCPBdvJw0rXV4LbYn2EWTIgpeh3kTfjTfrKUC5tqD9jQGBlF1EXZE5xg/lwvF6YtS8+wtg8OqP5XZlhwDGoEZ6v4eL7YdTpdnG79G1gFpXwfQF2TfCCwsWH5V9Jmwws16DCT0WPuwIYV/sN6BVnOLqjgMH6HkWE340Q0C2S819HNH4J" />
