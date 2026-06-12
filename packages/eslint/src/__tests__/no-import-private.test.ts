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
