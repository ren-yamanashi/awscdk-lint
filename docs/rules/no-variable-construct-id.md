---
title: eslint-plugin-awscdk - no-variable-construct-id
titleTemplate: ":title"
---

<script setup>
import RecommendedItem from '../components/RecommendedItem.vue'
import Playground from '../components/Playground.vue'
</script>

# no-variable-construct-id

<RecommendedItem />

This rule enforces that variables are not used in Construct IDs.

Using variables for Construct IDs is not appropriate because it may cause the following problems.
(This rule does not apply to loop processing such as for, while, forEach, map, etc., or resources defined in arrow functions or class methods.)

- Unnecessary duplication
- Resource recreation when parameters change
- Overemphasis on ID uniqueness can lead to mixing in unnecessary strings, making IDs complex and hard to read

---

#### 🔧 How to use

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

#### ✅ Correct Example

```ts
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";

export interface MyConstructProps {
  environments: Record<string, string>;
}

class MyConstruct extends Construct {
  constructor(scope: Construct, id: string, props: MyConstructProps) {
    super(scope, id);

    // ✅ String literals can be used
    new Bucket(this, "Bucket");

    // ✅ Variables can be used for Construct IDs within loop variables
    for (const [key, value] of Object.entries(props.environments)) {
      new Bucket(this, `${key}Bucket`);
    }

    // ✅ Variables can be used for Construct IDs within arrow functions
    const myArrowFunction = (id: string) => new Bucket(this, id);
  }

  // ✅ Variables can be used for Construct IDs within class methods
  myClassMethod(id: string) {
    return new Bucket(this, id);
  }
}
```

#### ❌ Incorrect Example

```ts
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";

export interface MyConstructProps {
  readonly stage: string;
}

class MyConstruct extends Construct {
  constructor(scope: Construct, id: string, props: MyConstructProps) {
    super(scope, id);

    // ❌ The constructor's `id` property cannot be specified directly for the Construct ID
    new Bucket(this, id);

    // ❌ Variables (from props, outside of loops) cannot be used for Construct IDs (using template strings)
    new Bucket(this, `${props.stage}Bucket`);
  }
}
```

<Playground link="https://eslint-online-playground.netlify.app/#eNqFVc1u00AQfpWRhURSxQkqt4AQgnLgAK1axKWuFGd3nG7j7K521m2jKEduPAK8HE/C7PonTtrAJY53vvl25psfbxJPwuhCLcZ3ZHQyTTaZBsgSYVZWlejOrVdGU5ZMIVqCzedugT4cZcmnq9NXp6dZMmqNpZoHy3Vjep0lN51tZWRVYuv4FR+Z5MB4iWTKKtxZw+aVlhxGD0feKRFv967C7tgZ488UA4MXOdF4bPl3m+lkFM4m2qT3uVP5vMSU02aqSvhUybEnTl2trHEeNvCxNcEWCmdWUY/miKV4k+kO+qESS+zh8gdKhVymLMMk/CcWgPGZxsfoobRHV+QC4cu6u+bCGUu1vg5zaXS5BtT3yhm9Qu1pCpcojJNvQ+56MYL6+Y6Jex7k8wVOGxubOO3uWlHmRP0rgcVHLamXa7y/y9O4AXeGZcIOMQIlW/4R2BD09Ekaw7ZPqLLYcATHYVQhGCYT+PPrB1xFHigVC5KXBCLXMEeoCGWN0/jQyDvwt4pGrG79miVPyL43Vd2jgcK4Xn6fzwgeFFNpKI2x0HYC1UwBPIjpw/US1zdgCjif36HwY66BU0iDmDK/7Soz7NJ9Jt7Ziw0TbeuzWYg5wGJZ2tB//4Rvt9hX/SXBTMlZlBedX4eEtPEhJ7IoVKE4Makcx8U1D0F7JuhneUS9wxLw1TvVBrF9Y34jMJUnJTEIEITiku5iOKLroKJQTI8rW+aeQ43FpeGRWFiZWsvYs/sKsT5bHlekkmdl3C2n3XzWlnbg3tevk7uDwZRYKI0cJbvvxrMB16x9B0/7tH5tkYRT1qe1oQ/mAb8oqwU30h5tauNhynPPiP2553DyqozPLqzBdch3L1Eac2HNintLoowLbDzm5fQfTNOCBS9snkhevScnkxN22+3eZtrZ2MX+HFsNDzvzZviGi2BzseQCHXwbgjb1nm0XenTLEon3Z2gDkxY8L/sfjaeCBobQLdT/DOxwRwDPa/0P6BFjb1MfQfR3fh/Qden2LxNygF4=" />
