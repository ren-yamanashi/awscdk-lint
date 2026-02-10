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

<Playground link="https://eslint-online-playground.netlify.app/#eNq9Vb2S2jAQfhWNm9wx2M6QjjT5IeUlmVCeKXz2GnQIySPJAYahTJdHSF4uT5LVj22ZGNJdA/but7vfrj6tT5FWheAVXSfPSvBoHp0yTkgWFWJXUwbyS62p4CqL5sR6jE/ncg3amLLo03L2ejbLomnrZPTJeB69600WrTrfTpQNgzbwMxwwyYXzGyjBGlPTwZ4aXiKNAKe0pIWtrmUDnVkKoRcUgSZKycJHnPH3nPFoamwpFzF2ixmaQsdK58U2Vk1V0UOiFfZOd7WQmpzIxxZEzqSSYmcH4k04i7cZ76AfmmILAS7fq7gotzHOITXPCicQ4pem6ijc4jIOB4ssWK4UeTj2VHBcwEsVkLMn0hET8g7PsoZ5j5gSWs6JmRhf37cHqJoaPNT4721V40hT8ufXD/KeMbGHktCK6A0gxy5dFpGcl2ixTeCbGx7JJRAuNMnrGhlC6dJx2Pvp3OkNVVOMezg6QxYNq/7+SZYb0bDSpmkUjFR2ta6mdq9BwJUK/FVfwNPv+umTW0NA2wNMTtQUSgoFBYpRrpPu+vQCcp72iN+51/T5QjklVJQDMsbwXhAe7LKGAVoN0+pjDaqQtNaxc4RglNRX1qwpH6aNa2uMUXWIGAoO6eQNs/8drbtH0++gUZVIwOWwswdtr1iS4O35D8ZLr8KVouxymEzSCYb128GrG50d97FsLVzirkCwz2vPeEFVbqRLBGfHG+KxYHvzsNL1leC2WB9hlgxIKfpd5M14kr4ylEsb6nsMCKzsIuqCTBc3mA+v1wuz9sVHGJtHZzS/K3MZ8BrUCM/XcPH9MOp0u7hd+jYwi0r4vgC7JnhB4eLD8q+kTQaWa1Dhp6LHXQGMq/0G9IpzsJ1HEeFnIQR0e+L8F8xfc9k=" />
