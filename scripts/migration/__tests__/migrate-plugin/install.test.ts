import { execSync } from "node:child_process";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { installPlugin } from "../../migrate-plugin/install";
import { PACKAGE_MANGER, PACKAGE_MANGER_VALUES } from "../../migrate-plugin/select-package-manager";
import { ErrorResult, RESULT_TYPE, SuccessResult } from "../../result";

vi.mock("node:child_process");
vi.mock("consola");

describe("installPlugin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe.each(PACKAGE_MANGER_VALUES)("when using %s", (packageManager) => {
    const installCommand =
      packageManager === PACKAGE_MANGER.YARN
        ? `yarn add -D eslint-plugin-awscdk`
        : `${packageManager} install -D eslint-plugin-awscdk`;

    it("can install", () => {
      vi.mocked(execSync).mockReturnValue("");

      // WHEN
      const result = installPlugin(packageManager) as SuccessResult<void>;

      // THEN
      expect(result.type).toEqual(RESULT_TYPE.SUCCESS);
      expect(execSync).toHaveBeenCalledWith(installCommand, {
        stdio: "inherit",
      });
    });

    it("when install fails, return error", () => {
      vi.mocked(execSync).mockImplementation(() => {
        throw new Error("Command failed");
      });

      // GIVEN
      const failedMessage = "Failed to install eslint-plugin-awscdk";

      // WHEN
      const result = installPlugin(packageManager) as ErrorResult;

      // THEN
      expect(result.type).toEqual(RESULT_TYPE.ERROR);
      expect(result.message).toContain(failedMessage);
    });
  });
});
