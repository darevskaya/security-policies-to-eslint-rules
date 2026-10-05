import { defineConfig } from "eslint/config";
import { policy } from "../../policy.ts";
import { scripts } from "../eslint.base.ts";

export default defineConfig({
  ...scripts,
  rules: {
    "browser-policy/trusted-types-policy-names": ["error", policy.csp],
  },
});
