---
title: eslint-plugin-awscdk - no-construct-in-interface
titleTemplate: ":title"
---

<script setup>
import RecommendedItem from '../../components/RecommendedItem.vue'
import Playground from '../../components/Playground.vue'
</script>

# no-construct-in-interface

<RecommendedItem japanese />

このルールは、interface のプロパティに指定する型として、書き込み可能な CDK Construct 型 (例: `Bucket`) の代わりに読み取り専用リソースのための interface (例: `IBucket`) を指定することを強制します。

AWS リソースを表す Construct (例: `Bucket`) が、読み取り専用リソースのための interface (例: `IBucket`) を implements している場合、interface のプロパティには、読み取り専用リソースのための interface (例: `IBucket`) を指定することが推奨されます。  
これにより、意図しないリソースの変更を防ぐことができます。

---

#### 🔧 使用方法

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

#### ✅ 適切な例

```ts
import { IBucket } from "aws-cdk-lib/aws-s3";
import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";
import { MetricFilter } from "aws-cdk-lib/aws-logs";

interface MyConstructProps {
  // ✅ 読み取り専用リソースのための interface (`IBucket` など) を指定している
  readonly bucket: IBucket;

  // ✅ AWS リソースを表す Construct でない Construct を指定している
  readonly asset: DockerImageAsset;

  // ✅ 読み取り専用リソースのための interface が存在しない場合、
  //    AWS リソースを表す Construct 型 (`MetricFilter` など) は指定可能
  readonly metricFilter: MetricFilter;
}
```

#### ❌ 不適切な例

```ts
import { Bucket } from "aws-cdk-lib/aws-s3";

interface MyConstructProps {
  // ❌ 読み取り専用リソースのための interface が存在する場合、AWS リソースを表す Construct は指定不可
  //    (Bucket は `IBucket` を implements しているため、`IBucket` を指定すべき)
  readonly bucket: Bucket;
}
```

<Playground link="https://eslint-online-playground.netlify.app/#eNqFVMFOGzEQ/RVrT4Cym4rewqW0tBIHWgQHDiwSjncSDF575fFSUJRjb/2E9uf6JR3biXc3JEGKsonnvZk349m3yBwKo2dyXjyi0dkkW5SasTITpm6kAvujcdJoLLMJCxEfc9zOwfmjMvt6ffzh+LjMRuugklMfuV2FPpbZXYrVpmoVrInf4YWSbASvAI1qfc0Im7a6Ihk9HDorRajubAvp2BrjziQBPQutWDGW9L0sdTbyZ2NtcuqWMrTC5VLTx4GdcQGFQ+pd1o2xji3Y+edWPIEbsfhkSzazpqbE/CfmonrKqcux/43U30mpE/HMEN6e13wOp4j7mCBszj2EZtvPcAG+v29SkbLdbGXmkVdqeAnM1Aq7eP2y7vHSmgbjxY3H7N+fX+wKeJUbrV47ArIDKOYFu191fX/IBNdsCqxFqDzXEilwpgEwWc8n1E+pU1Vk7oE7xi0wbRw7vbmmDGhaS+LS+FPVzZHtKR/mNXkz5KGMmwfQJACoukQSEOix5aQi9T7qVDP32nSz6F/DHkV1DzYZ3F1P1N/fURTfK4XBi0SHOxWly8EH06oqjHabJKmfuZJVhE9WG0xqlvQOACqqV6Q3vtv5GFmv26f4d/y4sZwVzKQGEkj0bjlX4Ji1T3A4TBv6EVY2Lo+BPpjW+1K1c6mHafMmHOa09YQY7jzJ4a0KzyTr4NZPY9AoFhbIz2rQFVTBFYqCXvh3MCu7m5ELYvCzo6PxEdE6QyP/IrgPJu3bskW4N6K7wxO6hIaLJ1rdDcP1s4nmtXbJQCuzCp7PoPGZtJCw4cRvB+ozKO4A+97a4XYAts96D3RHsOdTOxCdAQwBYUZ+S5f/AStXRfs=" />
