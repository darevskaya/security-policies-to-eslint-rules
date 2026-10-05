import { defineConfig } from "eslint/config";
import { scripts, templates } from "../eslint.base.ts";

const message = "script-src-attr 'none' blocks inline event handlers.";

export default defineConfig(
  {
    ...templates,
    rules: {
      "@html-eslint/no-restricted-attrs": [
        "error",
        { tagPatterns: [".*"], attrPatterns: ["^on"], message },
      ],
    },
  },
  {
    ...scripts,
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            'CallExpression[callee.property.name="setAttribute"][arguments.0.value=/^on/i]',
          message,
        },
      ],
    },
  },
);
