import { defineConfig } from "eslint/config";
import { scripts } from "../eslint.base.ts";
import requireTrustedTypes from "./require-trusted-types.ts";

export default defineConfig({
  ...scripts,
  languageOptions: {
    ...scripts.languageOptions,
    parserOptions: { projectService: true },
  },
  plugins: {
    local: { rules: { "require-trusted-types": requireTrustedTypes } },
  },
  rules: {
    "local/require-trusted-types": "error",
  },
});
