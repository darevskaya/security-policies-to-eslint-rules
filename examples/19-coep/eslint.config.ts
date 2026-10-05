import { defineConfig } from "eslint/config";
import { templates } from "../eslint.base.ts";

export default defineConfig({
  ...templates,
  rules: {
    "browser-policy/coep-cross-origin": "warn",
  },
});
