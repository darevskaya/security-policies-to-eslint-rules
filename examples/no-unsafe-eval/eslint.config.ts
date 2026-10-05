import { defineConfig } from "eslint/config";
import { scripts } from "../eslint.base.ts";

export default defineConfig({
  ...scripts,
  rules: {
    "no-eval": "error",
    "no-new-func": "error",
    "no-implied-eval": "error",
  },
});
