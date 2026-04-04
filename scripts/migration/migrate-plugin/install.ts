import { execSync } from "child_process";

import { getErrorMessage } from "../error";
import { Result, RESULT_TYPE } from "../result";
import { PACKAGE_MANGER, PackageManager } from "./select-package-manager";

export const installPlugin = (packageManager: PackageManager): Result<void> => {
  const command = (() => {
    switch (packageManager) {
      case PACKAGE_MANGER.NPM:
        return "npm install -D eslint-plugin-awscdk";
      case PACKAGE_MANGER.YARN:
        return "yarn add -D eslint-plugin-awscdk";
      case PACKAGE_MANGER.PNPM:
        return "pnpm install -D eslint-plugin-awscdk";
    }
  })();

  try {
    execSync(command, { stdio: "inherit" });
    return {
      type: RESULT_TYPE.SUCCESS,
    };
  } catch (error) {
    return {
      type: RESULT_TYPE.ERROR,
      message: `Failed to install eslint-plugin-awscdk
${getErrorMessage(error)}`,
    };
  }
};
