import { defineConfig } from "eslint/config";
import { templates } from "../eslint.base.ts";

export default defineConfig({
  ...templates,
  rules: {
    "@html-eslint/no-restricted-tags": [
      "error",
      {
        tagPatterns: ["^base$"],
        message: "base-uri 'none' blocks this element.",
      },
    ],
  },
});
