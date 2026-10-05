import { defineConfig } from "eslint/config";
import { templates } from "../eslint.base.ts";

export default defineConfig({
  ...templates,
  rules: {
    "@html-eslint/no-restricted-tags": [
      "error",
      {
        tagPatterns: ["^object$", "^embed$"],
        message: "object-src 'none' blocks this element.",
      },
      {
        tagPatterns: ["^base$"],
        message: "base-uri 'none' disallows a base URL.",
      },
    ],
  },
});
