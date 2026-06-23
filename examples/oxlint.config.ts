import { defineConfig } from "oxlint";
import cdkPlugin from "oxlint-plugin-awscdk";

export default defineConfig({
  extends: [cdkPlugin.configs.strict],
});
