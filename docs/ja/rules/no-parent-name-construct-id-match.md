---
title: eslint-plugin-awscdk - no-parent-name-construct-id-match
titleTemplate: ":title"
---

<script setup>
import RecommendedItem from '../../components/RecommendedItem.vue'
import Playground from '../../components/Playground.vue'
</script>

# no-parent-name-construct-id-match

<RecommendedItem japanese />

このルールでは、Construct ID に 親クラスの名前を指定することを禁止します。

Construct ID に、親クラス名と一致する (または含む) 文字列を指定すると、CloudFormation リソースの階層が不明瞭になるため推奨されません。

---

#### 🔧 使用方法

```js
// eslint.config.mjs
export default defineConfig([
  {
    // ... some configs
    rules: {
      "awscdk/no-parent-name-construct-id-match": "error",
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

    // ✅ 親クラスと異なる名前を指定している
    const bucket = new Bucket(this, "MyBucket");

    // ✅ 親クラス名を含むコンストラクト ID を指定しているが、完全に一致していない
    const bucket = new Bucket(this, "MyConstructBucket");
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

    // ❌ 親クラスと同じ名前を指定している
    const bucket = new Bucket(this, "MyConstruct");
  }
}
```

## オプション

```ts
type Options = {
  disallowContainingParentName: boolean;
};

const defaultOptions: Options = {
  disallowContainingParentName: false,
};
```

### `disallowContainingParentName`

`true` の場合、親クラス名を含むコンストラクト ID を使用することを禁止します。  
`false` の場合、親クラス名を含むコンストラクト ID の使用は許可されますが、親クラス名と完全に一致するコンストラクト ID の使用は禁止します。

`{ disallowContainingParentName: true }` とした場合

#### ✅ 適切な例

```ts
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";

export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // ✅ 親クラスと異なる名前を指定している
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

    // ❌ 親クラスと同じ名前を指定している
    const bucket = new Bucket(this, "MyConstruct");

    // ❌ 親クラス名を含む名前を指定している
    const bucket = new Bucket(this, "MyConstructBucket");
  }
}
```

<Playground link="https://eslint-online-playground.netlify.app/#eNqFVDty2zAQvQqGlewRpYzTKU0mVgoXdjxJkcJ0AYNLCRYIcIBlZI1GZbocIblcTuIFwJ9kSW702X37xdu3TdAJowu5mDw7o5NZss00Y1kiTFlJBfZbhdJolyUzFjzeh9wuAL0pS77+uPpwdZUl49ap5JP3PDSuj1ny2PlKk9cK2sA7eKEkB87v4Iyqfc0Ie6p1Tm0McA6tFKE62ho6szUG55KAPspZ0UTs6HOX6WTsbVNt0opb0JhqXkJKk1O2WmAq87TkKJYTdLQDWVbGItuy6xbAdqywpgyLaUy0k0+Z7qBfarGCAY6vXSryVUr7mPrfjjZB+EzDS4gQijvHbjfX4ZtWATp3g4Jh210xY0f0ThXMesSYyXzG/Db04qJ9HFdX0EC9/yJU9I7plP3/+5tdc81qB4yzXBYF+FUwv4rYNS6Bxf30lWO4hnUz4QiX0o1pwNtNNGTJmyo/l6CpgONKmTU1jFxq6vI+pL7z5aRjBVfUyCiHgtcKmQNEP8m4L81u5s7/a8L32gtbC50LGukJ/FT5mV67tR1v+t+fwepv5swtTa1ypg3S03CBasMCP473cK6uB8VqREbiIjERnJIaJ93d9YyLnpZCn+Pf6fMB1WhlUgP1S+E94RpwzDoMQLefFjcVOGFlhWl0DMFE2XtVL6TeT5tWwZgSkwmxz+T2BYdtjR78vHuDuokFUpWSeA55uM3JhM7tHUzD64K0yAVVubycXlJYLyvN6ZCz6/1YthZuSWQI3OQNrz9vmHrAPFzycAeefufePeQIB08NvC8xUR37SC9eYK3pNa4x00OfOaEof0Hfuph2xmj0n4+eeES5iosVX8CByHsmRMFslTkEZkkOv+ZQ+b1pIeFA/d/Sx2dQHMEN9bzHnQAcZ9YZ6AnnQGlPIIaaPQR0N7l7BeToYQw=" />
