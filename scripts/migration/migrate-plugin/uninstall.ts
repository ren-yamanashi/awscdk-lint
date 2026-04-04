import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

import { getErrorMessage } from "../error";
import { Result, RESULT_TYPE } from "../result";
import { PACKAGE_MANGER, PackageManager } from "./select-package-manager";

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export const uninstallPlugin = (
  packageManager: PackageManager,
  projectRoot: string,
): Result<void> => {
  const packageJson = readPackageJson(projectRoot);
  if (packageJson.type === RESULT_TYPE.ERROR) return packageJson;

  const installTypes = checkPluginInstallation(packageJson.value);
  if (installTypes.type === RESULT_TYPE.ERROR) return installTypes;

  for (const installType of installTypes.value) {
    const isDev = installType === "devDependencies";
    const result = uninstall(isDev, packageManager);
    if (result.type === RESULT_TYPE.ERROR) return result;
  }

  return { type: RESULT_TYPE.SUCCESS };
};

const uninstall = (isDev: boolean, packageManager: PackageManager): Result<void> => {
  const command = (() => {
    const devFlag = isDev ? " -D" : "";
    switch (packageManager) {
      case PACKAGE_MANGER.NPM:
        return `npm uninstall${devFlag} eslint-cdk-plugin`;
      case PACKAGE_MANGER.YARN:
        return `yarn remove eslint-cdk-plugin${devFlag}`;
      case PACKAGE_MANGER.PNPM:
        return `pnpm remove${devFlag} eslint-cdk-plugin`;
    }
  })();

  try {
    execSync(command, { stdio: "inherit" });
    return { type: RESULT_TYPE.SUCCESS };
  } catch (error) {
    return {
      type: RESULT_TYPE.ERROR,
      message: `Failed to uninstall eslint-cdk-plugin
${getErrorMessage(error)}`,
    };
  }
};

const readPackageJson = (projectRoot: string): Result<PackageJson> => {
  const packageJsonPath = path.join(projectRoot, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    return {
      type: RESULT_TYPE.ERROR,
      message: "package.json not found",
    };
  }

  try {
    const content = fs.readFileSync(packageJsonPath, "utf-8");
    if (isPackageJson(JSON.parse(content))) {
      return {
        type: RESULT_TYPE.SUCCESS,
        value: JSON.parse(content) as PackageJson,
      };
    }
    return {
      type: RESULT_TYPE.ERROR,
      message: "Invalid package.json format",
    };
  } catch (error) {
    return {
      type: RESULT_TYPE.ERROR,
      message: `Failed to read package.json
${getErrorMessage(error)}`,
    };
  }
};

const checkPluginInstallation = (
  packageJson: PackageJson,
): Result<("devDependencies" | "dependencies")[]> => {
  const inDependencies = packageJson.dependencies?.["eslint-cdk-plugin"];
  const inDevDependencies = packageJson.devDependencies?.["eslint-cdk-plugin"];

  if (inDependencies && inDevDependencies) {
    return {
      type: RESULT_TYPE.SUCCESS,
      value: ["devDependencies", "dependencies"],
    };
  }

  if (inDevDependencies) {
    return {
      type: RESULT_TYPE.SUCCESS,
      value: ["devDependencies"],
    };
  }

  if (inDependencies) {
    return {
      type: RESULT_TYPE.SUCCESS,
      value: ["dependencies"],
    };
  }

  return {
    type: RESULT_TYPE.ERROR,
    message: "eslint-cdk-plugin is not installed",
  };
};

const isPackageJson = (arg: unknown): arg is PackageJson => {
  return (
    typeof arg === "object" &&
    arg !== null &&
    (("dependencies" in arg && typeof arg.dependencies === "object") ||
      ("devDependencies" in arg && typeof arg.devDependencies === "object"))
  );
};
