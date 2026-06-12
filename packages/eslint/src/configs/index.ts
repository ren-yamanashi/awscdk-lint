import { recommended as classicRecommended, strict as classicStrict } from "./classic-config";
import { recommended, strict } from "./flat-config";

export const configs: Readonly<{
  recommended: typeof recommended;
  strict: typeof strict;
  classicRecommended: typeof classicRecommended;
  classicStrict: typeof classicStrict;
}> = {
  recommended,
  strict,
  classicRecommended,
  classicStrict,
};
