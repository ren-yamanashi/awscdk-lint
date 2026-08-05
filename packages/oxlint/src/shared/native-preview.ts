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

    const platformExe =
      process.platform === "win32" ? resolveWindowsPlatformExe(packageJsonPath) : undefined;
    if (platformExe) return platformExe;

    const binPath = resolve(dirname(packageJsonPath), binEntry);
    return existsSync(binPath) ? binPath : undefined;
  } catch {
    return undefined;
  }
};

/**
 * Resolve the Windows platform binary directly.
 * The meta package's `bin/tsgo(.js)` is a shebang script that Windows cannot spawn as an executable.
 */
const resolveWindowsPlatformExe = (nativePreviewPackageJsonPath: string): string | undefined => {
  try {
    const platformPackage = `@typescript/native-preview-win32-${process.arch}`;
    const requireFromNativePreview = createRequire(nativePreviewPackageJsonPath);
    const platformPackageJsonPath = requireFromNativePreview.resolve(
      `${platformPackage}/package.json`,
    );
    const exe = resolve(dirname(platformPackageJsonPath), "lib", "tsgo.exe");
    return existsSync(exe) ? exe : undefined;
  } catch {
    return undefined;
  }
};
