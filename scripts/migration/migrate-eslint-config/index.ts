import * as fs from "fs";
import * as path from "path";

import { Result, RESULT_TYPE } from "../result";

const ESLINT_CONFIG_PATTERNS = [
  "eslint.config.mjs",
  "eslint.config.cjs",
  "eslint.config.js",
  "eslint.config.ts",
  "eslint.config.mts",
  "eslint.config.cts",
] as const;

export const migrateEslintConfig = (projectRoot: string): Result<void> => {
  const configFiles = findEslintConfigFiles(projectRoot);
  if (!configFiles.length) {
    return {
      type: RESULT_TYPE.ERROR,
      message: "ESLint config files not found",
    };
  }

  for (const configFile of configFiles) {
    const content = fs.readFileSync(configFile, "utf-8");
    const result = updateConfig(content);
    if (result.modified) fs.writeFileSync(configFile, result.content, "utf-8");
  }

  return { type: RESULT_TYPE.SUCCESS };
};

const findEslintConfigFiles = (projectRoot: string): string[] => {
  return ESLINT_CONFIG_PATTERNS.reduce<string[]>((acc, pattern) => {
    const filePath = path.join(projectRoot, pattern);
    return fs.existsSync(filePath) ? [...acc, filePath] : acc;
  }, []);
};

const updateConfig = (
  content: string,
): {
  content: string;
  modified: boolean;
} => {
  let modifiedContent = content;
  let modified = false;

  // Replace import statements
  if (modifiedContent.includes('"eslint-cdk-plugin"')) {
    modifiedContent = modifiedContent.replace(/"eslint-cdk-plugin"/g, '"eslint-plugin-awscdk"');
    modified = true;
  }
  if (modifiedContent.includes("'eslint-cdk-plugin'")) {
    modifiedContent = modifiedContent.replace(/'eslint-cdk-plugin'/g, "'eslint-plugin-awscdk'");
    modified = true;
  }

  // NOTE: Replace plugins property: cdk: -> awscdk:
  // Match pattern like "cdk: cdkPlugin" within plugins object
  const pluginsPropertyRegex = /(\bplugins\s*:\s*\{[\s\S]*?\b)(cdk)(\s*:\s*[a-zA-Z_$])/g;
  if (modifiedContent.match(pluginsPropertyRegex)) {
    modifiedContent = modifiedContent.replace(pluginsPropertyRegex, "$1awscdk$3");
    modified = true;
  }

  // Replace rules: "cdk/xxx" -> "awscdk/xxx"
  if (modifiedContent.includes('"cdk/')) {
    modifiedContent = modifiedContent.replace(/"cdk\//g, '"awscdk/');
    modified = true;
  }
  if (modifiedContent.includes("'cdk/")) {
    modifiedContent = modifiedContent.replace(/'cdk\//g, "'awscdk/");
    modified = true;
  }

  return {
    content: modifiedContent,
    modified,
  };
};
