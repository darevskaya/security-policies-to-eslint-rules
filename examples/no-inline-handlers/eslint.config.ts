import { defineConfig } from "eslint/config";
import { scripts, templates } from "../eslint.base.ts";

export default defineConfig(
  {
    ...templates,
    rules: {
      "@html-eslint/no-restricted-attrs": [
        "error",
        {
          tagPatterns: [".*"],
          attrPatterns: ["^on"],
          message: "script-src-attr 'none' blocks inline event handlers.",
        },
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
          message:
            "script-src-attr 'none' blocks inline event handlers. Use addEventListener instead",
        },
      ],
    },
  },
);
