import { defineConfig } from "eslint/config";
import { policy } from "../../policy.ts";
import { scripts } from "../eslint.base.ts";

export default defineConfig({
  ...scripts,
  rules: {
    "browser-policy/csp-source-allowlist": ["error", policy.csp],
  },
});
