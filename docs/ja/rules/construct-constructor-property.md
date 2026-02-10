---
title: eslint-plugin-awscdk - construct-constructor-property
titleTemplate: ":title"
---

<script setup>
import RecommendedItem from '../../components/RecommendedItem.vue'
import Playground from '../../components/Playground.vue'
</script>

# construct-constructor-property

<RecommendedItem japanese />

このルールは、CDK Construct の `constructor` が、以下の標準的なルールに従うことを強制します。

#### 強制されるプロパティパターン

- 命名: `scope, id` または `scope, id, props`
- 型:
  - `scope`: Construct 型
  - `id`: string 型

---

#### 🔧 使用方法

```ts
// eslint.config.mjs
export default defineConfig([
  {
    // ... some configs
    rules: {
      "awscdk/construct-constructor-property": "error",
    },
  },
]);
```

#### ✅ 適切な例

```ts
import { Construct } from "constructs";

// ✅ "scope, id" プロパティ名を持つ constructor
export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}
```

```ts
import { Construct } from "constructs";

export interface MyConstructProps {
  bucketName: string;
}

// ✅ "scope, id, props" プロパティ名を持つ constructor
export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string, props: MyConstructProps) {
    super(scope, id);
  }
}
```

```ts
import { Construct } from "constructs";

export interface MyConstructProps {
  bucketName?: string;
}

// ✅ "scope, id, props" プロパティ名を持つ constructor (props プロパティがオプショナル)
export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string, props?: MyConstructProps) {
    super(scope, id);
  }
}
```

```ts
import { Construct } from "constructs";

export interface MyConstructProps {
  bucketName: string;
}

// ✅ "scope, id, props" の後に追加プロパティを持つ constructor
export class MyConstruct extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: MyConstructProps,
    resourceName: string
  ) {
    super(scope, id);
  }
}
```

#### ❌ 不適切な例

```ts
import { Construct } from "constructs";

// ❌ 最初のプロパティ名が "scope" でない
export class MyConstruct extends Construct {
  constructor(myScope: Construct, id: string) {
    super(myScope, id);
  }
}
```

```ts
import { Construct } from "constructs";

// ❌ 2番目のプロパティ名が "id" でない
export class MyConstruct extends Construct {
  constructor(scope: Construct, myId: string) {
    super(scope, myId);
  }
}
```

```ts
import { Construct } from "constructs";

export interface MyConstructProps {
  bucketName: string;
}

// ❌ 3番目のプロパティ名が "props" でない
export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string, myProps: MyConstructProps) {
    super(scope, id);
  }
}
```

```ts
import { Construct } from "constructs";

// ❌ 最初のプロパティが "Construct" 型でない
export class MyConstruct extends Construct {
  constructor(scope: unknown, id: string) {
    super(scope, id);
  }
}
```

```ts
import { Construct } from "constructs";

// ❌ 2番目のプロパティが "string" 型でない
export class MyConstruct extends Construct {
  constructor(scope: Construct, id: number) {
    super(scope, id.toString());
  }
}
```

<Playground link="https://eslint-online-playground.netlify.app/#eNqVVM1u2zAMfhVBp7aInSG7ZZcB6wbssK5YdquKwZGZVI0sGZK81ghy3G2PsL3cnmSUZMvOX4chQGyLH8mPHyluqbNcq5VY549WKzqnW6YIYZTrqhYSzOfaCa0so3MSLN7mCrMG548Yfb+YvZrNGJ30RimW3nLXmV4zep9slS4bCb3jDTxjkAPjF7BaNj5nhC0bVSKNEc46I3jI7kwD6dho7a4FAr2XNbzz2OH/jik68WdTLBXdG+6y9KZNVhtdg3Ft7iwKIKpaG0e25F0PITuyMroKqnRHKMgbpvwPngNcKAdmVXAgn9rkeIuBbdTNQFFqJVuybPgG3E1RwZz4UtQaAyFDpqZT8ufXjyGtNuRJuAdfDkeCEyJKRklPligMYVN+Lgtrx7kJqguqtKMyApFR4Rch7nxA+BQ9q8u+37bBfBHq7ZdIF2Udcf79k3wQxjpSFwY5oQ5EWKK0CxTLnj+jCb4AZFGex/tCE/jrgzAvYL0e2I0DIb79pxJVuzjSomo/JjX8V+jm/Ki/B0J1kaJ7FCum0hJyqdcIiG69jDiaYCXOT54u4jCF0dKP39v4OX2M45cmtYSVUIC00H0Y1g4co44dnN0P69oaLDeidlk0jMG83NzKZi3UftisDodZ8WQR0d2GrgVIp2hkeCZaF3e+3r1CbW5wDqoKewNluKx5jlfwH5hO7BUuJ2wGrpmrq+kVug17pms3GhP3U9Ei3O+He98mbENd8E2xhoNN6NWJW6VfX8GR0RK+X0PtYyku8CrurchjSX0EWTiw46U34M4ATqv9AvSMET0zdM269XwCMd5tY0Ca091f8nQm+A==" />
