---
title: eslint-plugin-awscdk - no-construct-stack-suffix
titleTemplate: ":title"
---

<script setup>
import RecommendedItem from '../components/RecommendedItem.vue'
import Playground from '../components/Playground.vue'
</script>

# no-construct-stack-suffix

<RecommendedItem />

This rule disallows including the strings "Construct" or "Stack" in Construct IDs and Stack IDs.

Including "Construct" in a Construct ID (and similarly for "Stack" in a Stack ID) is discouraged because it can cause issues that should ideally be contained within the CDK environment to leak into the CloudFormation template and the broader AWS environment.

---

#### 🔧 How to use

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

#### ✅ Correct Example

```ts
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";

export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // ✅ Allowed if the "Construct" and "Stack" suffix are not appended
    const bucket = new Bucket(this, "MyBucket");
  }
}
```

#### ❌ Incorrect Example

```ts
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Stack } from "aws-cdk-lib";

export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // ❌ Should not use the "Construct" suffix
    const bucket = new Bucket(this, "BucketConstruct");

    // ❌ Should not use the suffix "Stack"
    new Stack(this, "MyStack");
  }
}
```

## Options

```ts
type Options = {
  disallowedSuffixes: Array<"Construct" | "Stack">;
};

const defaultOptions: Options = {
  disallowedSuffixes: ["Construct", "Stack"],
};
```

### disallowedSuffixes

An array of suffixes to disallow. Can include "Construct", "Stack", or both.

With: `{ disallowedSuffixes: ["Construct"] }`

#### ✅ Correct Example

```ts
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";

export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // ✅ Allowed if the "Construct" suffix are not appended
    new Stack(this, "MyStack");
  }
}
```

#### ❌ Incorrect Example

```ts
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Stack } from "aws-cdk-lib";

export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // ❌ Should not use the "Construct" suffix
    const bucket = new Bucket(this, "BucketConstruct");
  }
}
```

<Playground link="https://eslint-online-playground.netlify.app/#eNq9Vb2S2jAQfhWNm9wx2M6QjjT5IeUlmVCeKXz2GnQIySPJAYahTJdHSF4uT5LVj22ZGNJdA/but7ufVt+uT5FWheAVXSfPSvBoHp0yTkgWFWJXUwbyS62p4CqL5sR6jE/ncg3amLLo03L2ejbLomnrZPTJeB69600WrTrfTpQNgzbwMxwwyYXzGyjBGlPTwZ4aXiKNAKe0pIWtrmUDnVkKoRcUgSZKycJHnPH3nPFoamwpFzGeFjM0hY6VzottrJqqoodEKzw73dVCanIiH1sQOZNKip1tiDdhL95mvIN+aIotBLh8r+Ki3MbYh9Q8K+xAiF+aqqNwi8s4HCyyYLlS5OHYU8F2AS9VQM7eSEdMyDu8yxrmPWJKaDknpmN8fd9eoGpq8FDjv7dVjSNNyZ9fP8h7xsQeSkIrojeAHLt0WURyXqLFHgLfXPNILoFwoUle18gQSpeOw953505vqJpi3MPRGbJoWPX3T7LciIaVNk2jYKSyq3U1tXsNAq5U4K/6Ap5+d54+uTUEtD3A5ERNoaRQUKAY5TrpxqcXkPO0V/zOvabPF8opoaIckDGG94LwYJc1DNBqmFYfa1CFpLWOnSMEo6S+smZN+TBtXFtjjKpDxFBwSCdvmP3vaN09mvMODqoSCbgcdvai7YglCU7PfzBeehWuFGWXw2SSTjCs3w5e3ejsuI9la+ESdwWCfV57xwuqciNdIjg73hCPBdvJw0rXV4LbYn2EWTIgpeh3kTfjTfrKUC5tqD9jQGBlF1EXZE5xg/lwvF6YtS8+wtg8OqP5XZlhwDGoEZ6v4eL7YdTpdnG79G1gFpXwfQF2TfCCwsWH5V9Jmwws16DCT0WPuwIYV/sN6BVnOLqjgMH6HkWE340Q0C2S819HNH4J" />
