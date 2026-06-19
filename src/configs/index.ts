import { recommended as classicRecommended, strict as classicStrict } from "./classic-config";
import { recommended, strict } from "./flat-config";
import { recommended as oxlintRecommended, strict as oxlintStrict } from "./oxlint-config";

export const configs: Readonly<{
  recommended: typeof recommended;
  strict: typeof strict;
  classicRecommended: typeof classicRecommended;
  classicStrict: typeof classicStrict;
  oxlintRecommended: typeof oxlintRecommended;
  oxlintStrict: typeof oxlintStrict;
}> = {
  recommended,
  strict,
  classicRecommended,
  classicStrict,
  oxlintRecommended,
  oxlintStrict,
};
