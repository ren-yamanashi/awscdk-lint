---
title: eslint-plugin-awscdk - require-props-default-doc
titleTemplate: ":title"
---

<script setup>
import NotRecommendedItem from '../components/NotRecommendedItem.vue'
import Playground from '../components/Playground.vue'
</script>

# require-props-default-doc

<NotRecommendedItem />

This rule requires a documentation comment including a `@default` JSDoc tag for optional properties defined in a Construct's Props interface, to indicate their default behavior.  
The names of such Props interfaces typically follow a format like `XxxxProps` (e.g., `MyConstructProps`, `MyStackProps`).

Note: This rule does not apply to regular class properties or properties within general interfaces not intended as Construct Props.

---

#### 🔧 How to use

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

#### ✅ Correct Example

```ts
import { IBucket } from "aws-cdk-lib/aws-s3";

interface MyConstructProps {
  // ✅ JSDoc comment including a `@default` tag for the optional property.
  /**
   * @default - No S3 bucket is associated.
   */
  readonly bucket?: IBucket;
}

// ✅ This rule does not apply to general interfaces that are not Construct Props.
interface Config {
  readonly bucket?: IBucket;
}
```

#### ❌ Incorrect Example

```ts
import { IBucket } from "aws-cdk-lib/aws-s3";

interface MyConstructProps {
  // ❌ No JSDoc comment for the optional property.
  readonly bucket?: IBucket;
}
```

```ts
import { IBucket } from "aws-cdk-lib/aws-s3";

interface MyConstructProps {
  // ❌ JSDoc comment exists, but the `@default` tag is missing.
  /** Some description without default value. */
  readonly bucket?: IBucket;
}
```

<Playground link="https://eslint-online-playground.netlify.app/#eNqFVMty0zAU/ZU7XoGntpmyaxd0oCxghtIh7OpOq0o3rlpbMpLcNtPJkh2fAD/Hl3Al2Y6TJmGTh++5x+e+znPiLNdqLqv8zmqVHCXPpQIoE66bVtZovrZOamXL5AhCxMccMxU6/6hMPs4O3xwelsnBEKzljY9c9KG3ZXI5xhotuhqHxDN8IpKN4De0uu78OyPsplOCZExw1hnJw9ud6XB8bLR2p5KAPssa3mcs6XNZquTAPysM/uikwaw1urWZwDnrapcJzXNnqXbZtNo4eIZP7zt+jw6WMDe6IUL2aDMu7jOqrvC/LdV1XKpS4VNIkcqhmTOO8GXxgfpF0rg792+JbSsK+Pv7J3yenWoO1NsGlU/idSekqoDB9Umv5hocq2CuDbhbBB3az2rwitG4RR7Y0jSUncKQBRmcaZi9hZsoXFpg1moumUMRciAt/JdBJrSqFz3w3dFQa6gmCv3zy5Ota90vaGS92k+7zolP0jp7QFJc4N7oAdXQSGupP0PRMNMNgkDLjQw64FG6W03pQxseWN1hvlnr1TZZtBWl6ufy/ZZeZmj9QGi0oLQD1raU6TRUqNBQweOILYllBDAYgOO4IcybtL7YCYLQhcVN2DeAJa0p2poS8/EoV2sZI8NGnsS/xR3dJqWOq0udkAr7N47724Mj6zTB2XVat2j79mYxMAXTBZzXXSXVOm3WhocZHQYh1g9jGMxU1qsL34i1Qm1uMK6FQBEON8/pJv+D6R1pTkZlg+WkaZFS2spzyGII7oOj9m1sA9yvAIF7Xm8rsabdxhH9Bo3RK4/ynhM/L18f00hbxu9ZhRsO6zsdswdbDGllIvDhFFuvS3GJG9b7cjyeoaYzt1MzXeF2ALZPbg90R3C6hlsBE+fcgaB5xAPaoAhN9Eex/AeuhUUk" />
