import { defineConfig } from "eslint/config";
import { policy } from "../../policy.ts";
import { templates } from "../eslint.base.ts";

export default defineConfig({
  ...templates,
  rules: {
    "browser-policy/html-csp-source-allowlist": ["error", policy.csp],
  },
});
