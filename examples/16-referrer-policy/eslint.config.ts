import { defineConfig } from "eslint/config";
import { scripts, templates } from "../eslint.base.ts";

const message = "This value is weaker than the Referrer-Policy header.";

export default defineConfig(
  {
    ...templates,
    rules: {
      "@html-eslint/no-restricted-attr-values": [
        "error",
        {
          attrPatterns: ["^referrerpolicy$"],
          attrValuePatterns: ["^unsafe-url$"],
          message,
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
            'AssignmentExpression[left.property.name="referrerPolicy"][right.value="unsafe-url"]',
          message,
        },
      ],
    },
  },
);
