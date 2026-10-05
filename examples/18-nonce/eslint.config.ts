import { defineConfig } from "eslint/config";
import { templates } from "../eslint.base.ts";

export default defineConfig({
  ...templates,
  rules: {
    "@html-eslint/no-restricted-attr-values": [
      "error",
      {
        attrPatterns: ["^nonce$"],
        attrValuePatterns: ["^[^{]"],
        message: "A nonce must be new for each response. Use {{cspNonce}}.",
      },
    ],
  },
});
