import { defineConfig } from "eslint/config";
import { scripts } from "../eslint.base.ts";

export default defineConfig({
  ...scripts,
  rules: {
    "browser-policy/require-trusted-types": "error",
  },
});
