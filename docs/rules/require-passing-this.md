---
title: eslint-plugin-awscdk - require-passing-this
titleTemplate: ":title"
---

<script setup>
import RecommendedItem from '../components/RecommendedItem.vue'
import FixableItem from '../components/FixableItem.vue'
import Playground from '../components/Playground.vue'
</script>

# require-passing-this

<RecommendedItem />
<FixableItem />

This rule enforces passing `this` as the scope when creating new Construct instances within a Construct.

When creating AWS CDK resources, passing `this` as the scope to child Constructs is crucial for maintaining the correct resource hierarchy.  
Passing other values as the scope (especially the `scope` variable received by the parent's constructor) can lead to:

- Incorrect resource hierarchy in the generated CloudFormation template
- Unexpected resource naming

---

#### 🔧 How to use

```js
// eslint.config.mjs
export default defineConfig([
  {
    // ... some configs
    rules: {
      "awscdk/require-passing-this": "error",
    },
  },
]);
```

#### ✅ Correct Example

```ts
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";

export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const sample = new SampleConstruct(this, "Sample");

    // ✅ Using `this` as scope is always allowed.
    new Bucket(this, "SampleBucket");

    // ✅ `sample` (an instance of a Construct) is allowed as scope.
    new OtherConstruct(sample, "Child");
  }
}
```

#### ❌ Incorrect Example

```ts
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";

export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // ❌ Shouldn't use the parent's `scope` variable,
    new Bucket(scope, "SampleBucket");
  }
}
```

## Options

```ts
type Options = {
  allowNonThisAndDisallowScope: boolean;
};

const defaultOptions: Options = {
  allowNonThisAndDisallowScope: true,
};
```

### `allowNonThisAndDisallowScope`

Determines whether to allow constructs other than `this` as the scope (first argument) when instantiating a new Construct.

- `false`: Only `this` is allowed as the scope (first argument) when instantiating a new Construct.
- `true`: Allows passing Construct instances other than `this` as the scope (first argument).
  - However, directly passing the `scope` variable received by the parent's constructor is still disallowed.
  - This setting is useful for creating nested construct hierarchies.

With: `{ allowNonThisAndDisallowScope: false }`

#### ✅ Correct Example

```ts
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";

export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // ✅ Using `this` as scope is always allowed.
    new Bucket(this, "SampleBucket");
  }
}
```

#### ❌ Incorrect Example

```ts
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";

export class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const sample = new SampleConstruct(this, "Sample");

    // ❌ Shouldn't use the parent's `scope` variable,
    new Bucket(scope, "SampleBucket");

    // ❌ Shouldn't use other Construct instances as scope.
    new OtherConstruct(sample, "Child");
  }
}
```

<Playground link="https://eslint-online-playground.netlify.app/#eNqNVc1uEzEQfpXRXppU+UHlFoQEtBxpESmnbqV1dyeJW8debG/SKMqRG48AL8eTMOP9TZqW9pA0M9/MfPPrbeRdavRMzkf3zuhoEm1jDRBHqVnmUqG9yr002sXRBIKGdV7YOXoWxdHn6dmbs7M4GtRKJe9Yc1Op3sbRbaNbmqxQWBte4iM5OVB+Q2dUwTFL2F2hM6LRwTlvZRqie1tgI7bG+AtJQLZyNq0sdvS5i3U0YNnY4o9CWhzmwjmp50O/kG7kHaUtl7mxHrZwTtmS49TDDmbWLEMtKhGV4V2sG+inIn3ADk6s3TDNHoZUgjH/7yh5wscaH4NFqigsfNm0IagCqDPXCRqK3AQ0tkftyXHSIgYgswlwEfS8X/fEFTlWUNb3Q1RWjMfw9/dP+M7ZQsLpJiAcBCRIB0KtxYa/lFljNiqNNK6r3HpsMaDUpmKZKyyFcbTv/88vmC5MoTJ94qFwCH6BkAuL2p84SEKsBFbCSnGn6oaRIf2xe6Yh9UoomQGuUMN6QR+B0aXR14T4qLML6YJkWhPn3j+lW1XgGF8ahTAJsabQ18RwZtgh1wUfA5rdljQCg+QlCgmDEyaRQI8KKnXI2iLtzZJaihk49H1iGHoJrozwPpDtTMBBgUuqVdOS0ogDaArgvNApgpmBaKehXzYxdK9pLEXt1iR44RjnC6kyDkHbgE5J7UfN7rcrUGrqmf5Q/hzfH8x+hjOpkXiQebsBFbj02jXwbt+t3+ToUitzPywVXTDt0FdVzKmme26HeRAOabUIsb9aREcUKnw3tHo33PW9RN2o06EwiaMR7f9/MNWSzegeunDZTk/Hp2TWnrZqj0nZcD/mrYZbOnQErvyGZXhp2CYwE8rhpAO/0mpT7/PxCWig4S4RraPHrzzVLZgvKVpr2oNbibevYRiubWNUZ1sK+fM2jF4u0gcxx4MHhyeiPN71KxHM4ijD1QXmXD+dSjx4iZ6OEXtQwqPrvi0t7hnA8Ql7AfqMsvMEPIPoPiZdQH2hot0/q6uQbw==" />
