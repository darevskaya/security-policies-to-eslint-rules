import { defineConfig } from "eslint/config";
import { policy } from "../../policy.ts";
import { scripts, templates } from "../eslint.base.ts";

export default defineConfig(
  {
    ...templates,
    rules: {
      "browser-policy/html-csp-source-allowlist": ["error", policy.csp],
    },
  },
  {
    ...scripts,
    rules: {
      "browser-policy/csp-source-allowlist": ["error", policy.csp],
    },
  },
);
