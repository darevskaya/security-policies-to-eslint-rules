import { defineConfig } from "eslint/config";
import { templates } from "../eslint.base.ts";

export default defineConfig({
  ...templates,
  rules: {
    "@html-eslint/no-restricted-attrs": [
      "error",
      {
        tagPatterns: ["^audio$", "^video$"],
        attrPatterns: ["^autoplay$"],
        message: "Permissions-Policy autoplay=() ignores this attribute.",
      },
    ],
  },
});
