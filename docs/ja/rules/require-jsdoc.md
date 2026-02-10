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

<Playground link="https://eslint-online-playground.netlify.app/#eNqlVEtu2zAQvQqhVWtYUuHsnE3RuosWSBrUBbqIgkKiRg5tiWRJKolheNldj9BerifpkNTXn3SRjWxx3hvNmxm+XWA0Fbxgq2itBQ/mwS7hhCQBFZVkJajP0jDBdRLMiYvYmEnVCow9SoIPy9mb2SwJpm2wZJmN3DahiyS462KVyOsSWuI1PGGSg+AX0KKs7Tc9LKt5jmUMcNooRt3XjaqhO1ZCmAVDoGVpRRvGHp/7hAdTexYr+FEzBeFa54JGRqNeVkmhDNmRj+9qugFD9qRQosIk6aMOab4JUVFs/2vUcpnwjvAe+4Il0AEFW+mPsGEITTg8OTDjBlSRUiBX2452o4TUvqtxTP7+/kk+LReCEmx9BdyQQqgBUSIalNk6+GRClhck8wUbQTIgWgJlBYPc8cw9EIWtrBVSJ7ElKUhzwcttQ5u3gl2dvoQ/v8hVrQ15VMzAuJpRhu/HKbDHnVpaploPlRKcNPBcD1r2vGxZZyWjR5q/oqpeN8V6DOrNtiiXaUzQJveCmyQv132Y6IT8gZpv98Bd/9vqCdbGhWnSTH2xCne9DaRSljg49ynFHlDUYdHXaQVzYjefr3yzcaFBl7geUXd9+2X2kXYp3/rXeO2XstvfHArGAUeC9H6FG7DPOiQYPU5rthI0VUya0AeGYLw3N2W9YnycNpTuMMTrhIjxHcFy0rp0v11Zr25tU0ZCdaTAzyaH3F3xKMKb/B9M410FWpp25jSZxBOk9e7UrCgGu9pPZWvhdn4IbvJaA/Kaxhbj3QiUEr2DWUfyz7vXlzhGmdJNuoID/7Xd9ezWNB0tCXJ4WIC0tXDK4MCYj0diM5S4UXpotT3uDOD0tJ6BngkOLPQMYuiYQ4DrEW56sP8HvbZIrg==" />
