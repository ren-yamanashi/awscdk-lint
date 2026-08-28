import { RuleTester } from "eslint";

import { noImportPrivate } from "../rules/no-import-private.js";

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: "latest", sourceType: "module" },
});

/**
 * The following directory structure is assumed:
 * src
 * ├── sampleA
 * │   └── a.ts
 * └── sampleB
 *     ├── private
 *     │   └── c.ts
 *     ├── a.ts
 *     └── b.ts
 */

ruleTester.run("no-import-private", noImportPrivate, {
  valid: [
    {
      // WHEN: If the import path does not contain `private/`, import is allowed
      code: 'import { sample } from "../sampleB/b.ts";',
      filename: "src/sampleA/a.ts",
    },
    {
      // WHEN: Importing modules in the same level private directory is allowed
      code: 'import { sample } from "./private/c.ts";',
      filename: "src/sampleB/a.ts",
    },
    {
      // WHEN: A directory whose name only starts with `private` is not a `private` dir
      code: 'import { helper } from "../shared/private-utils/helper";',
      filename: "src/moduleA/from-private-utils.ts",
    },
    {
      // WHEN: A file inside a `private` subtree can import from its own child `private` dir
      code: 'import { y } from "./private/y";',
      filename: "src/lib/private/helper/x.ts",
    },
    {
      // WHEN: Bare specifiers are not resolved as filesystem paths
      code: 'import { x } from "@myorg/private-utils";',
      filename: "src/moduleA/a.ts",
    },
  ],
  invalid: [
    // WHEN: Importing modules in a private directory at a different level is not allowed
    {
      code: 'import { sample } from "../sampleB/private/c.ts";',
      filename: "src/sampleA/a.ts",
      errors: [{ messageId: "invalidImportPath" }],
    },
  ],
});
