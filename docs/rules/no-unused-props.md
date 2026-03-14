---
title: eslint-plugin-awscdk - no-unused-props
titleTemplate: ":title"
---

<script setup>
import RecommendedItem from '../components/RecommendedItem.vue'
import Playground from '../components/Playground.vue'
</script>

# no-unused-props

<RecommendedItem />

This rule enforces that all properties defined in CDK Construct props interface are actually used within the constructor.

When developing CDK Constructs, it's common to define props interface with multiple properties, but developers may forget to use some of these properties in the Construct implementation, which leads to dead code.

This rule helps you detect unused properties defined in the `Props` interface.

---

#### 🔧 How to use

```js
// eslint.config.mjs
export default defineConfig([
  {
    // ... some configs
    rules: {
      "awscdk/no-unused-props": "error",
    },
  },
]);
```

#### ✅ Correct Example

```ts
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";

interface MyConstructProps {
  readonly bucketName: string;
  readonly enableVersioning: boolean;
}

export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string, props: MyConstructProps) {
    super(scope, id);

    // ✅ All props properties are used
    new Bucket(this, "MyBucket", {
      bucketName: props.bucketName,
      versioned: props.enableVersioning,
    });
  }
}
```

#### ❌ Incorrect Example

```ts
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";

interface MyConstructProps {
  readonly bucketName: string;
  readonly enableVersioning: boolean;
  readonly unusedProp: string; // ❌ This property is never used
}

export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string, props: MyConstructProps) {
    super(scope, id);

    new Bucket(this, "MyBucket", {
      bucketName: props.bucketName,
      versioned: props.enableVersioning,
    });
  }
}
```

<Playground link="https://eslint-online-playground.netlify.app/#eNrFVc1OGzEQfhVrT4CySUVvQZX6A4ceoKitemFR5XgnqcFrW7YXiFCOvfUR2pfrk3T8sxvnD5Daihw2ieeb8cz3zc7cF84yJad8NryyShbj4r6ShFQFU43mAswH7biStirGJFi8zVEzA+ePquLk0+GLw8OqGHRGwSfecpFML6visrc1qm4FdI5ncIdB1owfwSrR+jsjbNLKGtPIcNYZzsLtzrTQHxul3DFHoPeyhiWPBT4XlSwG/mwkVdnK1kJdaqO0HTqLFfNGK+PIPXmHhWJM5siCTI1qAg3pCBk4qmQPfduya8hw9NaWrL4usfqR/22xbsRXcjQirx7+BMzvn9/xemMALz+5o41Gmp7ky6UDM6UMyOm8z//cFxf1MkBrJcWcTELGZ7SBMfEUyhnml9lB0omAL2Asco/WMZkoJYBKhCGBlYS7UDsT1Nr8MoIygqxtRl+4uadOmT3sMY339ogB4XWXxoAELcYbBex3HWdbDSmGd9wPxHpDIu6NEDFGeIJxHCyhBohXOiIl3CbN9tw3bgco2ek8HmCjdBeRFZZiiyxPUqsRchNJAiwhYta5S8iFzxS/EoFPbYVfP8h7yf6uGb7+x27IYPFl8hf0YYIoWMJnpLnTY07wtwTkLUmy2VB5wv+sozZYeLylnrtRcFCBFSjksB/LyxEVLd3MeR3/jq7WZlMNUy4BC0f35YRK4Bg1d3B2Nayba7DMcO3KaMjBOOPORTvjcjVsqcNhiaMPEWn0JX0xHdqK8N2ntXfh610p1A6x31XToPBQB16GQ5zPj2CSHlNcVag3Lp2Dg9EBui23TuolNPa5b4vWwQ3uIAT3OofRjp7rqyPuGTBGLXeT3zXxebl/hEJqyq7pDNY2q+c3enfrMLhVRQ03x6B9NpLhBFtduZui+AiCOrD5El3idgC26/UAdIcxb76tgGwj7kDkuzUH9K/C4g9S6+vq" />
