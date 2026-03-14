---
title: eslint-plugin-awscdk - require-props-default-doc
titleTemplate: ":title"
---

<script setup>
import NotRecommendedItem from '../../components/NotRecommendedItem.vue'
import Playground from '../../components/Playground.vue'
</script>

# require-props-default-doc

<NotRecommendedItem japanese />

このルールは、Props (interface) で定義されるオプショナルなプロパティに対して、そのデフォルトの挙動を示す `@default` JSDoc タグを含むドキュメントコメントの記述を強制します。

※ Class のプロパティや、Props でない interface のプロパティには、このルールは適用されません。

---

#### 🔧 使用方法

```js
// eslint.config.mjs
export default defineConfig([
  {
    // ... some configs
    rules: {
      "awscdk/require-props-default-doc": "error",
    },
  },
]);
```

#### ✅ 正しい例

```ts
import { IBucket } from "aws-cdk-lib/aws-s3";

interface MyConstructProps {
  // ✅ オプショナルなプロパティに `@default` タグを含むJSDocコメントが記載されている
  /**
   * @default - S3バケットを紐づけない
   */
  readonly bucket?: IBucket;
}

// ✅ Props ではない interface には、このルールは適用されません
interface Config {
  readonly bucket?: IBucket;
}
```

#### ❌ 不正な例

```ts
import { IBucket } from "aws-cdk-lib/aws-s3";

interface MyConstructProps {
  // ❌ オプショナルなプロパティにJSDocコメント自体がない
  readonly bucket?: IBucket;
}
```

```ts
import { IBucket } from "aws-cdk-lib/aws-s3";

interface MyConstructProps {
  // ❌ JSDocコメントはあるが、`@default` タグが含まれていない
  /** デフォルト値の説明がないJSDocコメント */
  readonly bucket?: IBucket;
}
```

<Playground link="https://eslint-online-playground.netlify.app/#eNqFVMty0zAU/ZU7XoGntpmyaxd0oCxghtIh7OpOq0o3rlpbMpLcNtPJkh2fAD/Hl3Al2Y6TJmGTh++5x+e+znPiLNdqLqv8zmqVHCXPpQIoE66bVtZovrZOamXL5AhCxMccMxU6/6hMPs4O3xwelsnBEKzljY9c9KG3ZXI5xhotuhqHxDN8IpKN4De0uu78OyPsplOCZExw1hnJw9ud6XB8bLR2p5KAPssa3mcs6XNZquTAPysM/uikwaw1urWZwDnrapcJzXNnqXbZtNo4eIZP7zt+jw6WMDe6IUL2aDMu7jOqrvC/LdV1XKpS4VNIkcqhmTOO8GXxgfpF0rg792+JbSsK+Pv7J3yenWoO1NsGlU/idSekqoDB9Umv5hocq2CuDbhbBB3az2rwitG4RR7Y0jSUncKQBRmcaZi9hZsoXFpg1moumUMRciAt/JdBJrSqFz3w3dFQa6gmCv3zy5Ota90vaGS92k+7zolP0jp7QFJc4N7oAdXQSGupP0PRMNMNgkDLjQw64FG6W03pQxseWN1hvlnr1TZZtBWl6ufy/ZZeZmj9QGi0oLQD1raU6TRUqNBQweOILYllBDAYgOO4IcybtL7YCYLQhcVN2DeAJa0p2poS8/EoV2sZI8NGnsS/xR3dJqWOq0udkAr7N47724Mj6zTB2XVat2j79mYxMAXTBZzXXSXVOm3WhocZHQYh1g9jGMxU1qsL34i1Qm1uMK6FQBEON8/pJv+D6R1pTkZlg+WkaZFS2spzyGII7oOj9m1sA9yvAIF7Xm8rsabdxhH9Bo3RK4/ynhM/L18f00hbxu9ZhRsO6zsdswdbDGllIvDhFFuvS3GJG9b7cjyeoaYzt1MzXeF2ALZPbg90R3C6hlsBE+fcgaB5xAPaoAhN9Eex/AeuhUUk" />
