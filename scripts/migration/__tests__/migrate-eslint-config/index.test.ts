import * as fs from "node:fs";
import * as path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { migrateEslintConfig } from "../../migrate-eslint-config";
import { ErrorResult, RESULT_TYPE, SuccessResult } from "../../result";

vi.mock("consola");

describe("migrateEslintConfig", () => {
  const testDir = path.join(__dirname, "test-temp-migrate-config");

  beforeEach(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it("successfully migrate eslint config file", () => {
    // GIVEN
    const configPath = path.join(testDir, "eslint.config.mjs");
    const content = `import cdkPlugin from "eslint-cdk-plugin";
export default [{
  plugins: { cdk: cdkPlugin },
  rules: { "cdk/no-construct": "error" }
}];`;

    fs.writeFileSync(configPath, content);

    // WHEN
    const result = migrateEslintConfig(testDir) as SuccessResult<void>;
    const newContent = fs.readFileSync(configPath, "utf-8");

    // THEN
    expect(result.type).toEqual(RESULT_TYPE.SUCCESS);
    expect(newContent).toContain("eslint-plugin-awscdk");
    expect(newContent).toContain("awscdk: cdkPlugin");
    expect(newContent).toContain("awscdk/no-construct");
  });

  it("can migrate multiple eslint config files", () => {
    // GIVEN
    const mjsPath = path.join(testDir, "eslint.config.mjs");
    const tsPath = path.join(testDir, "eslint.config.ts");

    fs.writeFileSync(mjsPath, `import cdkPlugin from "eslint-cdk-plugin";`);
    fs.writeFileSync(tsPath, `import cdkPlugin from "eslint-cdk-plugin";`);

    // WHEN
    const result = migrateEslintConfig(testDir);
    const mjsContent = fs.readFileSync(mjsPath, "utf-8");
    const tsContent = fs.readFileSync(tsPath, "utf-8");

    // THEN
    expect(result.type).toEqual(RESULT_TYPE.SUCCESS);
    expect(mjsContent).toContain("eslint-plugin-awscdk");
    expect(tsContent).toContain("eslint-plugin-awscdk");
  });

  it("when no config files found, return error", () => {
    // WHEN
    const result = migrateEslintConfig(testDir) as ErrorResult;

    // THEN
    expect(result.type).toEqual(RESULT_TYPE.ERROR);
    expect(result.message).toEqual("ESLint config files not found");
  });

  it("successfully migrate all supported config file types", () => {
    // GIVEN
    const files = [
      "eslint.config.mjs",
      "eslint.config.cjs",
      "eslint.config.js",
      "eslint.config.ts",
      "eslint.config.mts",
      "eslint.config.cts",
    ];

    for (const file of files) {
      const filePath = path.join(testDir, file);
      fs.writeFileSync(filePath, `import cdkPlugin from "eslint-cdk-plugin";`);
    }

    // WHEN
    const result = migrateEslintConfig(testDir);

    // THEN
    expect(result.type).toEqual(RESULT_TYPE.SUCCESS);

    for (const file of files) {
      const filePath = path.join(testDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      expect(content).toContain("eslint-plugin-awscdk");
    }
  });
});
