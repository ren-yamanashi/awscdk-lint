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

<Playground link="https://eslint-online-playground.netlify.app/#eNqFVc1u00AQfpWRhURSxQkqt4AQgnLgAK1axKWuFGd3nG7j7K521m2jKEduPAK8HE/C7PonTtrAJY53vvl25psfbxJPwuhCLcZ3ZHQyTTaZBsgSYVZWlejOrVdGU5ZMIVqCzedugT4cZcmnq9NXp6dZMmqNpZoHy3Vjep0lN51tZWRVYuv4FR+Z5MB4iWTKKtxZw+aVlhxGD0feKRFv967C7tgZ488UA4MXOdF4bPl3m+lkFM4m2qT3uVP5vMSU02aqSvhUybEnTl2trHEeNvCxNcEWCmdWUY/miKV4k+kO+qESS+zh8gdKhVymLMMk/CcWgPGZxsfoobRHV+QC4cu6u+bCGUu1vg5zaXS5BtT3yhm9Qu1pCpcojJNvQ+56MYL6+Y6Jex7k8wVOGxubOO3uWlHmRP0rgcVHLamXa7y/y9O4AXeGZcIOMQIlW/4R2BD09Ekaw7ZPqLLYcATHYVQhGCYT+PPrB1xFHigVC5KXBCLXMEeoCGWN0/jQyDvwt4pGrG79miVPyL43Vd2jgcK4Xn6fzwgeFFNpKI2x0HYC1UwBPIjpw/US1zdgCjif36HwY66BU0iDmDK/7Soz7NJ9Jt7Ziw0TbeuzWYg5wGJZ2tB//4Rvt9hX/SXBTMlZlBedX4eEtPEhJ7IoVKE4Makcx8U1D0F7JuhneUS9wxLw1TvVBrF9Y34jMJUnJTEIEITiku5iOKLroKJQTI8rW+aeQ43FpeGRWFiZWsvYs/sKsT5bHlekkmdl3C2n3XzWlnbg3tevk7uDwZRYKI0cJbvvxrMB16x9B0/7tH5tkYRT1qe1oQ/mAb8oqwU30h5tauNhynPPiP2553DyqozPLqzBdch3L1Eac2HNintLoowLbDzm5fQfTNOCBS9snkhevScnkxN22+3eZtrZ2MX+HFsNDzvzZviGi2BzseQCHXwbgjb1nm0XenTLEon3Z2gDkxY8L/sfjaeCBobQLdT/DOxwRwDPa/0P6BFjb1MfQfR3fh/Qden2LxNygF4=" />
