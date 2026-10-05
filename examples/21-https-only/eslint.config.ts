import { defineConfig } from "eslint/config";
import { scripts, templates } from "../eslint.base.ts";

export default defineConfig(
  {
    ...templates,
    rules: {
      "@html-eslint/prefer-https": "error",
    },
  },
  {
    ...scripts,
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/^(http|ws):/]",
          message: "Use https: or wss: for this URL.",
        },
      ],
    },
  },
);
