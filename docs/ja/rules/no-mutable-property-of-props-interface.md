---
title: eslint-plugin-awscdk - no-mutable-property-of-props-interface
titleTemplate: ":title"
---

<script setup>
import RecommendedItem from '../../components/RecommendedItem.vue'
import FixableItem from '../../components/FixableItem.vue'
import Playground from '../../components/Playground.vue'
</script>

# no-mutable-property-of-props-interface

<RecommendedItem japanese />
<FixableItem japanese />

このルールは、CDK Construct または Stack の `Props` (interface) のプロパティに、`readonly` 修飾子を指定することを強制します

意図しない副作用を防ぐため、Props のプロパティには `readonly` 修飾子を指定することが推奨されます。

---

#### 🔧 使用方法

```js
// eslint.config.mjs
export default defineConfig([
  {
    // ... some configs
    rules: {
      "awscdk/no-mutable-property-of-props-interface": "error",
    },
  },
]);
```

#### ✅ 適切な例

```ts
import { IBucket } from "aws-cdk-lib/aws-s3";

interface MyConstructProps {
  // ✅ Props のプロパティに readonly 修飾子が指定されている
  readonly bucket: IBucket;
}
```

```ts
import { IBucket } from "aws-cdk-lib/aws-s3";

// ✅ Props ではない interface に対しては、このルールは適用されない
interface MyInterface {
  bucket: IBucket;
}
```

#### ❌ 不適切な例

```ts
import { IBucket } from "aws-cdk-lib/aws-s3";

interface MyConstructProps {
  // ❌ Props のプロパティに readonly 修飾子が指定されていない
  bucket: IBucket;
}
```

<Playground link="https://eslint-online-playground.netlify.app/#eNqFVM1y0zAQfhWNT5CpbSbc0gsD5dAD0AFuVQ+KtU7UyJJGkptmMjly4xHg5XgSVpLjnzSBS2Jrv/3207e73mfeVVrVYlU8Oq2yRbanihCaVboxQoL9YrzQytFsQWIkxDyzK/DhiGYfv83fzOc0uzoGpViGyH0Xekuzhz7WaN5KOCZ+hmckOQl+BadlG2om2LJVHGWMcM5bUcXq3rbQH1ut/Y1AYMhytuoyDvh7oCq7Cmel0nnTeraUkBurDVi/y3Udn10ulAdbswoK79AI0RhtPdmT2/dttQFPDqS2ukF2tnV5xTc5XrUMzw4veU0VVfAcU3oi8mn3Ac1DnZW/CzWSh2VJ/vz6QSwwrpXckU6KAEeYBcKk1FvgAdlDnpgUPOlYHAXFkont908S+DsSoVBkrEezQYwjbq1byckSet6QL9QFcrSNqk7r97VwxGJ/CNfIpLQnzBgU5vW4QjgHxYVaka3w60HGWW9u++doy/KlAmwbOIk5RT+kQ2dS5NiUd+m1fMRqmNp3j0MtFGAbMH1oYQdOrOME76a0fmfAVVYYn6fAGIxDcCfbFfo9oc1NPMxxNhAxnQ2Uw1oZ/3tZr+7D9ScXdYUFXMEGzQQeB7kocCz/g+k2tMbFdXEFZ7NyhmnDDuLKITwEe+3n2BI87M7D62tsgmHVhq3g5BsRvEn7dlzsmEYzDk83YAKTqnAgpx+Pl4YGBsk8uPHnYMBdAJz3+h/QC8Hx4JwFjNb9AgIdTEt+QhFNDGN8+AuWYdv5" />
