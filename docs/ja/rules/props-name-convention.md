---
title: eslint-plugin-awscdk - props-name-convention
titleTemplate: ":title"
---

<script setup>
import NotRecommendedItem from '../../components/NotRecommendedItem.vue'
import Playground from '../../components/Playground.vue'
</script>

# props-name-convention

<NotRecommendedItem japanese />

CDK Construct クラスの `Props` (interface) 名が `${ConstructName}Props` の形式に従うことを強制します。  
(ここでの `${ConstructName}` は Construct のクラス名を示します)

一貫した命名パターンに従うことで、Construct とその Props (interface) の関係が明確になり、コードの保守性と理解のしやすさが向上します。

---

#### 🔧 使用方法

```js
// eslint.config.mjs
export default defineConfig([
  {
    // ... some configs
    rules: {
      "awscdk/props-name-convention": "error",
    },
  },
]);
```

#### ✅ 適切な例

```ts
import { Construct } from "constructs";
import { IBucket } from "aws-cdk-lib/aws-s3";

// ✅ Props (interface) 名が `${ConstructName}Props` の形式に従っている
interface MyConstructProps {
  readonly bucket?: IBucket;
}

class MyConstruct extends Construct {
  constructor(scope: Construct, id: string, props: MyConstructProps) {
    super(scope, id);
  }
}
```

#### ❌ 不適切な例

```ts
import { Construct } from "constructs";
import { IBucket } from "aws-cdk-lib/aws-s3";

// ❌ Props (interface) 名が `${ConstructName}Props` の形式に従っていない
interface Props {
  readonly bucket?: IBucket;
}

class MyConstruct extends Construct {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);
  }
}
```

<Playground link="https://eslint-online-playground.netlify.app/#eNqtVM1y0zAQfhWNh0PSiR0m3NwDDJQDB0qHHuvO1LHXRo0saSS5bSaTIzceAV6OJ2Ely7aSOuUAl/xov119++3q20VGF4JXtE7uteBRGu0yTkgWFaKRlIH6Ig0VXGdRSlzExkyuajD2KIs+Xq9er1ZZtOiDjK5t5MaH3mTR7RBrRNky6BMv4QmLHAW/ghastXd2sHXLS6QR4LRRtHC3G9XCcKyEMBcUgTZLq8Jn7PFzn/FoYc+WUgmpY543EGPXD8DtRYnR2DdtpFCG7MgHbBcrF4bsSaVE48TwR6jDecYH6Kf3bbGBAJg/6rgoNzGKsLS/NbaPCRlfLsnvn9/Jlb1/RrkBVeUFzImlQirBmHjUxHyzv1WTGyIqcvdqN1C5RNjeJd/h9X06+bwdEC7YjUhBXgrOtmTt2L1Ne57IBKWAJ8e+YLnWYQWC4wBe6kAAV25oXqgZ7oqEdEQsCC1TYifC6wVx6qbPWM37zdGtBF/DJs6Rjz22FwgGCRP1zJWYu8E5sp1yv36cUK5ptfHyOfUmJfOahsK9qFbXzoRY13kjGfx/wf5RJdxt0AybS4aXPO5zF+n38133d3l/tMglVJTbzjB93GYP7qqGCUYfljVbCbpQVJq4C4RgfA9XrK0pPywbS3cY4zNBhH8mXm6kk7fMfQ+0Zje234NGdaIAfarBIUDpXnuS4GP+C8bLXKG7ofboU2dnyzNMG43KzxWDA/epaj1coW0h2Ne1XtT1NO02nUGBUmI0NWtS3eft/BzHKfNik9dwZMlW5S6791GXlkUlPFyAtJx4QeHIq5+PxlZguQEduu+IOwGYntoL0BPBcAUnAYGHnkCEdhwChgex/wNbBF6e" />
