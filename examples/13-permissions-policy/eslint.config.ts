import { defineConfig } from "eslint/config";
import { policy } from "../../policy.ts";
import { scripts } from "../eslint.base.ts";

export default defineConfig({
  ...scripts,
  rules: {
    "browser-policy/no-disabled-permission-api": ["error", policy.permissionsPolicy],
  },
});
