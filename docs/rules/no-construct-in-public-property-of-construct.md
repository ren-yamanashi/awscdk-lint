---
title: eslint-plugin-awscdk - no-construct-in-public-property-of-construct
titleTemplate: ":title"
---

<script setup>
import RecommendedItem from '../components/RecommendedItem.vue'
import Playground from '../components/Playground.vue'
</script>

# no-construct-in-public-property-of-construct

<RecommendedItem />

This rule enforces specifying interfaces for read-only resources (e.g. `IBucket`) for `public` properties of a CDK Construct.

When AWS resource Constructs (e.g. `Bucket`) implement interfaces for read-only resources (e.g. `IBucket`), it is recommended to specify the read-only resource interface (e.g. `IBucket`) for Construct `public` properties to help prevent unintended resource modifications.

---

#### 🔧 How to use

```js
// eslint.config.mjs
export default defineConfig([
  {
    // ... some configs
    rules: {
      "awscdk/no-construct-in-public-property-of-construct": "error",
    },
  },
]);
```

#### ✅ Correct Example

```ts
import { Construct } from "constructs";
import { IBucket } from "aws-cdk-lib/aws-s3";
import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";
import { MetricFilter } from "aws-cdk-lib/aws-logs";

class MyConstruct extends Construct {
  // ✅ Read-only interfaces (e.g. `IBucket`) can be used
  public readonly bucket: IBucket;

  // ✅ Constructs that are not AWS resource constructs (e.g. `DockerImageAsset`) can be used
  public readonly asset: DockerImageAsset;

  // ✅ When there is no read-only resource interface, Construct types (e.g. `MetricFilter`) can be used
  public readonly metricFilter: MetricFilter;
}
```

#### ❌ Incorrect Example

```ts
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";

class MyConstruct extends Construct {
  // ❌ When a read-only resource interface exists, Construct types (e.g. `Bucket`) should not be used
  public readonly bucket: Bucket;
}
```

<Playground link="https://eslint-online-playground.netlify.app/#eNqNVc1O20AQfpWRTwmKnYrejCqVllbiQFvBgQNGxVmPzYK9a+2uCxHKsbc+QvtyfZLO7vo3ENJD4mTn++bnG8/sU2A0kyLnRXSnpQji4CkRAEnAZFXzEtXX2nApdBLE4CzWZlJVoLFHSfDp4vDN4WESLDpjyVfWctWa3ibBdW+rZNaU2BG/4CM52TKeo5ZlY2N62KoRGaUxwmmjOHPRjWqwP1ZSmhNOQMvSirWMDX1vEhEs7NlSyJCqJQ8NMyEXYd2sSs7CWskalVmHMh/skdEkB69qqQw8wcfuHDaQK1k5jdojkucoET309EPD7tEswD8HQvqgQ5bdh6TR0v7WpM6YeCIJr06rtMBjrV9jIlNhaiFboc/QqvOZlwbVbnYpC89LBD46JivJG5ythyqpOSgyParb9X+5hL+/f8I5plkoRbkGLihUnjLUMMOoiOCmLf9mDiwVsEJoNGaW69UGRVxHXTlc3Onl8ukj9HE1mNvUQKoQhDRwfHlBHrRsFEMYOtAF35ZwfxZOxviZ9tNsLm9RUB5ISXBNeTi6F6BPpldiMRLNrOtBmXF39idWjdDxpLOj3P782hWs74K+lU2ZOfHaaJBLBe1Lz1G/FPx715y+NzRk9OkVl2pGm6PGeIi/AJ7FYOdTFPNuXeiGoniotc+dJyAtuY58DHgHAh/aQDNrWNA7e7b2B0kwobR5/R+HBt/PPuqSuhP1m24YbG/pBuW9/7u82xqrDHMukAol+jBWLdh7HROMnrp1fWGK1yb0hjGYBvNb2RRcTN2GtTsMaV4JMZ1WSidtSvfs05pd2YonhepIIe3xiuYYM7cNo4i22h5M27ectr92e/zgYHlAtGGRt6uBjH3uL3nzcLuAr+dH1IQ6Zfc0XVsXjdXGL+3udnC0JMjwxwnW1pNg9iWd3EDPBbUeytSgHt8pA24H4GWtX4HuMI427A7E+LIYA7r3NNj8A28sm+E=" />
