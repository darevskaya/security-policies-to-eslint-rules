import { defineConfig } from "eslint/config";
import { templates } from "../eslint.base.ts";

export default defineConfig({
  ...templates,
  rules: {
    "@html-eslint/require-attrs": [
      "error",
      {
        tag: "script",
        attr: "integrity",
        conditions: [{ attr: "src", kind: "present" }],
        message: "Integrity-Policy blocks a script without integrity metadata.",
      },
    ],
  },
});
