import { consola } from "consola";

import { Result, RESULT_TYPE } from "../result";

export const PACKAGE_MANGER = {
  NPM: "npm",
  YARN: "yarn",
  PNPM: "pnpm",
} as const;

export const PACKAGE_MANGER_VALUES = Object.values(PACKAGE_MANGER);

export type PackageManager = (typeof PACKAGE_MANGER)[keyof typeof PACKAGE_MANGER];

/**
 * Select the package manager to use
 * - If options.packageManager is provided, validate it and return
 * - If not provided, prompt the user to select one
 */
export const selectPackageManager = async (options: {
  packageManager?: string;
}): Promise<Result<PackageManager>> => {
  // NOTE: When options.packageManager is not provided, prompt the user
  if (!options.packageManager) {
    const res = await consola.prompt("Which package manager are you using?", {
      type: "select",
      options: [
        { label: PACKAGE_MANGER.NPM, value: PACKAGE_MANGER.NPM },
        { label: PACKAGE_MANGER.YARN, value: PACKAGE_MANGER.YARN },
        { label: PACKAGE_MANGER.PNPM, value: PACKAGE_MANGER.PNPM },
      ],
    });
    return {
      type: RESULT_TYPE.SUCCESS,
      value: res,
    };
  }

  // NOTE: When options.packageManager is provided, validate it
  if (!PACKAGE_MANGER_VALUES.includes(options.packageManager as PackageManager)) {
    return {
      type: RESULT_TYPE.ERROR,
      message: `Invalid package manager: ${
        options.packageManager
      }. Must be one of: ${PACKAGE_MANGER_VALUES.join(", ")}`,
    };
  }
  return {
    type: RESULT_TYPE.SUCCESS,
    value: options.packageManager as PackageManager,
  };
};
