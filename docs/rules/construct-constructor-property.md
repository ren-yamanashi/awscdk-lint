---
title: eslint-plugin-awscdk - construct-constructor-property
titleTemplate: ":title"
---

<script setup>
import RecommendedItem from '../components/RecommendedItem.vue'
import Playground from '../components/Playground.vue'
</script>

# construct-constructor-property

<RecommendedItem />

This rule enforces that CDK Construct `constructor` follows standard property patterns.

All Construct constructors should follow a consistent property pattern to maintain uniformity across the codebase.

Note: Additional parameters are allowed after the first three, as long as the initial parameters follow the prescribed pattern.

#### Enforced Property Patterns

- Naming: `scope, id` or `scope, id, props`
- Types:
  - `scope`: Construct type
  - `id`: string type

---

#### 🔧 How to use

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

#### ✅ Correct Example

```ts
import { Construct } from "constructs";

// ✅ Constructor with "scope, id" parameter names
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

// ✅ Constructor with "scope, id, props" parameter names
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

// ✅ Constructor with "scope, id, props?" parameter names (optional props)
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

// ✅ Constructor with additional parameters after "scope, id, props"
export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string, props: MyConstructProps, resourceName: string) {
    super(scope, id);
  }
}
```

#### ❌ Incorrect Example

```ts
import { Construct } from "constructs";

// ❌ First parameter is not named "scope"
export class MyConstruct extends Construct {
  constructor(myScope: Construct, id: string) {
    super(myScope, id);
  }
}
```

```ts
import { Construct } from "constructs";

// ❌ Second parameter is not named "id"
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

// ❌ Third parameter is not named "props"
export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string, myProps: MyConstructProps) {
    super(scope, id);
  }
}
```

<Playground link="https://eslint-online-playground.netlify.app/#eNqVVM1u2zAMfhVBp7aInSG7ZZcB6wbssK5YdquKwZGZVI0sGZK81ghy3G2PsL3cnmSUZMvOX4chQGyLH8mPHyluqbNcq5VY549WKzqnW6YIYZTrqhYSzOfaCa0so3MSLN7mCrMG548Yfb+YvZrNGJ30RimW3nLXmV4zep9slS4bCb3jDTxjkAPjF7BaNj5nhC0bVSKNEc46I3jI7kwD6dho7a4FAr2XNbzz2OH/jik68WdTLBXdG+6y9KZNVhtdg3Ft7iwKIKpaG0e25F0PITuyMroKqnRHKMgbpvwPngNcKAdmVXAgn9rkeIuBbdTNQFFqJVuybPgG3E1RwZz4UtQaAyFDpqZT8ufXjyGtNuRJuAdfDkeCEyJKRklPligMYVN+Lgtrx7kJqguqtKMyApFR4Rch7nxA+BQ9q8u+37bBfBHq7ZdIF2Udcf79k3wQxjpSFwY5oQ5EWKK0CxTLnj+jCb4AZFGex/tCE/jrgzAvYL0e2I0DIb79pxJVuzjSomo/JjX8V+jm/Ki/B0J1kaJ7FCum0hJyqdcIiG69jDiaYCXOT54u4jCF0dKP39v4OX2M45cmtYSVUIC00H0Y1g4co44dnN0P69oaLDeidlk0jMG83NzKZi3UftisDodZ8WQR0d2GrgVIp2hkeCZaF3e+3r1CbW5wDqoKewNluKx5jlfwH5hO7BUuJ2wGrpmrq+kVug17pms3GhP3U9Ei3O+He98mbENd8E2xhoNN6NWJW6VfX8GR0RK+X0PtYyku8CrurchjSX0EWTiw46U34M4ATqv9AvSMET0zdM269XwCMd5tY0Ca091f8nQm+A==" />
