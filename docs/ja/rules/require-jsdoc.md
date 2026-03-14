---
title: eslint-plugin-awscdk - require-jsdoc
titleTemplate: ":title"
---

<script setup>
import NotRecommendedItem from '../../components/NotRecommendedItem.vue'
import Playground from '../../components/Playground.vue'
</script>

# require-jsdoc

<NotRecommendedItem japanese />

このルールは、Props (interface) のプロパティと、CDK Construct の public プロパティに JSDoc の記載を強制します。

プロパティに JSDoc コメントを追加することで、各プロパティが何を表しているのかが明確になり、コードの保守性と理解のしやすさが向上します。

---

#### 🔧 使用方法

```js
// eslint.config.mjs
export default defineConfig([
  {
    // ... some configs
    rules: {
      "awscdk/require-jsdoc": "error",
    },
  },
]);
```

#### ✅ 適切な例

```ts
import { IBucket } from "aws-cdk-lib/aws-s3";

interface MyConstructProps {
  // ✅ Props のプロパティに JSDoc コメントが記載されている
  /** リソースに指定するS3バケット */
  readonly bucket: IBucket;
}
```

```ts
import { Construct } from "constructs";
import { IBucket } from "aws-cdk-lib/aws-s3";

class MyConstruct extends Construct {
  // ✅ Construct の public プロパティに JSDoc コメントが記載されている
  /** Constructで作成されたS3バケット */
  public readonly bucket: IBucket;

  // ✅ public でないプロパティには、このルールは適用されない
  private readonly bucketName: string;
}
```

#### ❌ 不適切な例

```ts
import { IBucket } from "aws-cdk-lib/aws-s3";

interface MyConstructProps {
  // ❌ Props のプロパティに JSDoc コメントが記載されていない
  readonly bucket: IBucket;
}
```

```ts
import { Construct } from "constructs";
import { IBucket } from "aws-cdk-lib/aws-s3";

class MyConstruct extends Construct {
  // ❌ Construct の public プロパティに JSDoc コメントが記載されていない
  public readonly bucket: IBucket;
}
```

<Playground link="https://eslint-online-playground.netlify.app/#eNqlVEtu2zAQvQqhVWvYVuHsnE3RuosWSBrUBbqIgkKiRg5tiWRJKolheNldj9BerifpkNSH8iddZCNbnPdG82aGbxcZTQUv2Gq61oJH82iXcEKSiIpKshLUZ2mY4DqJ5sRFbMykagXGHiXRh+XszWyWROM2WLLMRm6b0EUS3XWxSuR1CS3xGp4wyUHwC2hR1vabHpbVPMcyApw2ilH3daNq6I6VEGbBEGhZWtGGscfnPuHR2J7FCn7UTMFkrXNBp0ajXlZJoQzZkY/varoBQ/akUKLCJOmjntB8M0FFsf2vUctlwjvCe+wLlkADCrbSH2HDEJpweHJgxg2oIqVArrYd7UYJqX1X45j8/f2TfFouBCXY+gq4IYVQAVEiGpTZOvhoRJYXJPMFG0EyIFoCZQWD3PHMPRCFrawVUkexJSlIc8HLbUObt4Jdnb6EP7/IVa0NeVTMwLCaQYbvxymwx51aWqZah0oJThp4roOWPS9b1lnJ6JHmr6iq102xHoN6sy3KZRoTtMm94CbJy3UfJjohP1Dz7R64639bPcHauDBNmrEvVuGut4FUyhIH5z6l2AOKOiz6Oq1gTuzm85VvNi406BLXY9pd336ZfaRdyrf+NV77pez2N4eCccCRIL1f4Qbss4YEo4dpzVaCpopJM/GBEIz35qasV4wP006kO5zgdULE8I5gOWldut+urFe3tikDoXqqwM8mh9xd8ekUb/J/MI13FWhp2pnTaBSPkNa7U7OiGOxqP5Wthdv5IbjJaw3IaxpajHcjUEr0DmYdyT/vXl/iGGVKN+kKDvzXdtezW9N0tCTK4WEB0tbCKYMDYz4eic1Q4kbp0Gp73BnA6Wk9Az0TDFfvJCDw2DOI0FJDgGsiXoVo/w+nplLe" />
