import { defineConfig } from "eslint/config";
import { templates } from "../eslint.base.ts";

export default defineConfig({
  ...templates,
  rules: {
    "@html-eslint/require-attrs": [
      "error",
      {
        tag: "iframe",
        attr: "sandbox",
        message: "Every iframe must have a sandbox attribute.",
      },
    ],
    "@html-eslint/no-restricted-attr-values": [
      "error",
      {
        attrPatterns: ["^sandbox$"],
        attrValuePatterns: [
          "allow-scripts.*allow-same-origin",
          "allow-same-origin.*allow-scripts",
        ],
        message: "A frame with both tokens can remove its own sandbox.",
      },
    ],
  },
});
