---
title: eslint-plugin-awscdk - no-construct-in-interface
titleTemplate: ":title"
---

<script setup>
import RecommendedItem from '../components/RecommendedItem.vue'
import Playground from '../components/Playground.vue'
</script>

# no-construct-in-interface

<RecommendedItem />

This rule enforces specifying interfaces for read-only resources (e.g. `IBucket`) for properties in an `interface`.

When AWS resource Constructs (e.g. `Bucket`) implement interfaces for read-only resources (e.g. `IBucket`), it is recommended to specify the read-only resource interface (e.g. `IBucket`) for interface properties to help prevent unintended resource modifications.

---

#### 🔧 How to use

```ts
// eslint.config.mjs
export default defineConfig([
  {
    // ... some configs
    rules: {
      "awscdk/no-construct-in-interface": "error",
    },
  },
]);
```

#### ✅ Correct Example

```ts
import { IBucket } from "aws-cdk-lib/aws-s3";
import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";
import { MetricFilter } from "aws-cdk-lib/aws-logs";

interface MyConstructProps {
  // ✅ Read-only interfaces (e.g. `IBucket`) can be used
  readonly bucket: IBucket;

  // ✅ Constructs that are not AWS resource constructs (e.g. `DockerImageAsset`) can be used
  readonly asset: DockerImageAsset;

  // ✅ When there is no read-only resource interface, Construct types (e.g. `MetricFilter`) can be used
  readonly metricFilter: MetricFilter;
}
```

#### ❌ Incorrect Example

```ts
import { Bucket } from "aws-cdk-lib/aws-s3";

interface MyConstructProps {
  // ❌ When a read-only resource interface exists, Construct types (e.g. `Bucket`) should not be used
  readonly bucket: Bucket;
}
```

<Playground link="https://eslint-online-playground.netlify.app/#eNqFVMFOGzEQ/RVrT4Cym4rewqW0tBIHWgQHDiwSjncSDF575fFSUJRjb/2E9uf6JR3biXc3JEGKsonnvZk349m3yBwKo2dyXjyi0dkkW5SasTITpm6kAvujcdJoLLMJCxEfc9zOwfmjMvt6ffzh+LjMRuugklMfuV2FPpbZXYrVpmoVrInf4YWSbASvAI1qfc0Im7a6Ihk9HDorRajubAvp2BrjziQBPQutWDGW9L0sdTbyZ2NtcuqWMrTC5VLTx4GdcQGFQ+pd1o2xji3Y+edWPIEbsfhkSzazpqbE/CfmonrKqcux/43U30mpE/HMEN6e13wOp4j7mCBszj2EZtvPcAG+v29SkbLdbGXmkVdqeAnM1Aq7eP2y7vHSmgbjxY3H7N+fX+wKeJUbrV47ArIDKOYFu191fX/IBNdsCqxFqDzXEilwpgEwWc8n1E+pU1Vk7oE7xi0wbRw7vbmmDGhaS+LS+FPVzZHtKR/mNXkz5KGMmwfQJACoukQSEOix5aQi9T7qVDP32nSz6F/DHkV1DzYZ3F1P1N/fURTfK4XBi0SHOxWly8EH06oqjHabJKmfuZJVhE9WG0xqlvQOACqqV6Q3vtv5GFmv26f4d/y4sZwVzKQGEkj0bjlX4Ji1T3A4TBv6EVY2Lo+BPpjW+1K1c6mHafMmHOa09YQY7jzJ4a0KzyTr4NZPY9AoFhbIz2rQFVTBFYqCXvh3MCu7m5ELYvCzo6PxEdE6QyP/IrgPJu3bskW4N6K7wxO6hIaLJ1rdDcP1s4nmtXbJQCuzCp7PoPGZtJCw4cRvB+ozKO4A+97a4XYAts96D3RHsOdTOxCdAQwBYUZ+S5f/AStXRfs=" />
