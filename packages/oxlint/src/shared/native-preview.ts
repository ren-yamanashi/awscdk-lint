import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";

const localRequire = createRequire(import.meta.url);

export const resolveBundledTsgo = (): string | undefined => {
  try {
    const packageJsonPath = localRequire.resolve("@typescript/native-preview/package.json");
    const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
      bin?: string | Record<string, string>;
    };
    const binEntry =
      typeof pkg.bin === "string"
        ? pkg.bin
        : (pkg.bin?.tsgo ?? (pkg.bin ? Object.values(pkg.bin)[0] : undefined));
    if (!binEntry) return undefined;
    const binPath = resolve(dirname(packageJsonPath), binEntry);
    return existsSync(binPath) ? binPath : undefined;
  } catch {
    return undefined;
  }
};
