import { execSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";

import { PACKAGE_MANGER, PACKAGE_MANGER_VALUES } from "../../migrate-plugin/select-package-manager";
import { uninstallPlugin } from "../../migrate-plugin/uninstall";
import { ErrorResult, RESULT_TYPE, SuccessResult } from "../../result";

vi.mock("node:child_process");
vi.mock("consola");

describe("uninstallPlugin", () => {
  const testDir = path.join(__dirname, "test-temp");
  const packageJsonPath = path.join(testDir, "package.json");

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

  describe.each(PACKAGE_MANGER_VALUES)("when using %s", (packageManager) => {
    const packageJsonContent = {
      name: "test-package",
      version: "1.0.0",
      dependencies: {
        "eslint-cdk-plugin": "^1.0.0",
      },
    };

    const uninstallCommand =
      packageManager === PACKAGE_MANGER.NPM
        ? `npm uninstall eslint-cdk-plugin`
        : `${packageManager} remove eslint-cdk-plugin`;

    it("can uninstall devDependency", () => {
      vi.mocked(execSync).mockReturnValue("");
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonContent));

      // WHEN
      const result = uninstallPlugin(packageManager, testDir) as SuccessResult<void>;

      // THEN
      expect(result.type).toEqual(RESULT_TYPE.SUCCESS);
      expect(execSync).toHaveBeenCalledWith(uninstallCommand, {
        stdio: "inherit",
      });
    });

    it("can uninstall dependency", () => {
      vi.mocked(execSync).mockReturnValue("");
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonContent));

      // WHEN
      const result = uninstallPlugin(packageManager, testDir) as SuccessResult<void>;

      // THEN
      expect(result.type).toEqual(RESULT_TYPE.SUCCESS);
      expect(execSync).toHaveBeenCalledWith(uninstallCommand, {
        stdio: "inherit",
      });
    });

    it("when uninstall fails, return error", () => {
      vi.mocked(execSync).mockImplementation(() => {
        throw new Error("Command failed");
      });
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonContent));

      // WHEN
      const result = uninstallPlugin(packageManager, testDir) as ErrorResult;

      // THEN
      expect(result.type).toEqual(RESULT_TYPE.ERROR);
      expect(result.message).toContain("Failed to uninstall eslint-cdk-plugin");
    });
  });

  it("when plugin is devDependency, can uninstall", () => {
    vi.mocked(execSync).mockReturnValue("");
    const packageJsonContent = {
      name: "test-package",
      version: "1.0.0",
      devDependencies: {
        "eslint-cdk-plugin": "^1.0.0",
      },
    };
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonContent));

    // WHEN
    const result = uninstallPlugin(PACKAGE_MANGER.NPM, testDir) as SuccessResult<void>;

    // THEN
    expect(result.type).toEqual(RESULT_TYPE.SUCCESS);
    expect(execSync).toHaveBeenCalledWith(`npm uninstall eslint-cdk-plugin`, {
      stdio: "inherit",
    });
  });

  it("when package.json has invalid JSON, return error", () => {
    vi.mocked(execSync).mockReturnValue("");
    fs.writeFileSync(packageJsonPath, "{ invalid json }");

    // WHEN
    const result = uninstallPlugin(PACKAGE_MANGER.NPM, testDir) as ErrorResult;

    // THEN
    expect(result.type).toEqual(RESULT_TYPE.ERROR);
    expect(result.message).toContain("Failed to read package.json");
  });

  it("when package.json not found, return error", () => {
    vi.mocked(execSync).mockReturnValue("");
    fs.rmSync(packageJsonPath, { force: true });

    // WHEN
    const result = uninstallPlugin(PACKAGE_MANGER.NPM, testDir) as ErrorResult;

    // THEN
    expect(result.type).toEqual(RESULT_TYPE.ERROR);
    expect(result.message).toEqual("package.json not found");
  });

  it("when plugin is not installed, return error", () => {
    // GIVEN
    const packageJsonContent = {
      dependencies: {
        "other-package": "^1.0.0",
      },
    };
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonContent));

    // WHEN
    const result = uninstallPlugin(PACKAGE_MANGER.NPM, testDir) as ErrorResult;

    // THEN
    expect(result.type).toEqual(RESULT_TYPE.ERROR);
    expect(result.message).toEqual("eslint-cdk-plugin is not installed");
  });
});
