import { defineConfig } from "eslint/config";
import { scripts, templates } from "../eslint.base.ts";

export default defineConfig(
  {
    ...templates,
    rules: {
      "@html-eslint/no-inline-styles": "error",
    },
  },
  {
    ...scripts,
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            'CallExpression[callee.property.name="setAttribute"][arguments.0.value="style"]',
          message: "style-src-attr 'none' blocks the style attribute.",
        },
        {
          selector: 'AssignmentExpression[left.property.name="cssText"]',
          message: "style-src-attr 'none' blocks cssText.",
        },
      ],
    },
  },
);
