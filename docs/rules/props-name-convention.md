---
title: eslint-plugin-awscdk - props-name-convention
titleTemplate: ":title"
---

<script setup>
import NotRecommendedItem from '../components/NotRecommendedItem.vue'
import Playground from '../components/Playground.vue'
</script>

# props-name-convention

<NotRecommendedItem />

Forces the Props(interface) name of the Construct class to follow the form `${ConstructName}Props`.  
Where `${ConstructName}` is the name of the Construct class.

Following a consistent naming pattern clarifies the relationship between Construct and its Props(interface), improving code maintainability and ease of understanding.

(This rule applies only to classes that extends from `Construct`.)

---

#### 🔧 How to use

```js
// eslint.config.mjs
export default defineConfig([
  {
    // ... some configs
    rules: {
      "awscdk/props-name-convention": "error",
    },
  },
]);
```

#### ✅ Correct Example

```ts
import { Construct } from "constructs";
import { IBucket } from "aws-cdk-lib/aws-s3";

// ✅ Props(interface) name follows the format of `${ConstructName}Props`
interface MyConstructProps {
  readonly bucket?: IBucket;
}

class MyConstruct extends Construct {
  constructor(scope: Construct, id: string, props: MyConstructProps) {
    super(scope, id);
  }
}
```

#### ❌ Incorrect Example

```ts
import { Construct } from "constructs";
import { IBucket } from "aws-cdk-lib/aws-s3";

// ❌ Props(interface) name must follow the ${ConstructName}Props format
interface Props {
  readonly bucket?: string;
}

class MyConstruct extends Construct {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);
  }
}
```

<Playground link="https://eslint-online-playground.netlify.app/#eNqtVM1y0zAQfhWNh0PSiR0m3NwDDJQDB0qHHuvO1LHXRo0saSS5bSaTIzceAV6OJ2Ely7aSOuUAl/xov119++3q20VGF4JXtE7uteBRGu0yTkgWFaKRlIH6Ig0VXGdRSlzExkyuajD2KIs+Xq9er1ZZtOiDjK5t5MaH3mTR7RBrRNky6BMv4QmLHAW/ghastXd2sHXLS6QR4LRRtHC3G9XCcKyEMBcUgTZLq8Jn7PFzn/FoYc+WUgmpY543EGPXD8DtRYnR2DdtpFCG7MgHbBcrF4bsSaVE48TwR6jDecYH6Kf3bbGBAJg/6rgoNzGKsLS/NbaPCRlfLsnvn9/Jlb1/RrkBVeUFzImlQirBmHjUxHyzv1WTGyIqcvdqN1C5RNjeJd/h9X06+bwdEC7YjUhBXgrOtmTt2L1Ne57IBKWAJ8e+YLnWYQWC4wBe6kAAV25oXqgZ7oqEdEQsCC1TYifC6wVx6qbPWM37zdGtBF/DJs6Rjz22FwgGCRP1zJWYu8E5sp1yv36cUK5ptfHyOfUmJfOahsK9qFbXzoRY13kjGfx/wf5RJdxt0AybS4aXPO5zF+n38133d3l/tMglVJTbzjB93GYP7qqGCUYfljVbCbpQVJq4C4RgfA9XrK0pPywbS3cY4zNBhH8mXm6kk7fMfQ+0Zje234NGdaIAfarBIUDpXnuS4GP+C8bLXKG7ofboU2dnyzNMG43KzxWDA/epaj1coW0h2Ne1XtT1NO02nUGBUmI0NWtS3eft/BzHKfNik9dwZMlW5S6791GXlkUlPFyAtJx4QeHIq5+PxlZguQEduu+IOwGYntoL0BPBcAUnAYGHnkCEdhwChgex/wNbBF6e" />
