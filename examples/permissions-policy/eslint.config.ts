import { defineConfig } from "eslint/config";
import { scripts, templates } from "../eslint.base.ts";
import noDisabledPermissionApi from "./no-disabled-permission-api.ts";

export default defineConfig(
  {
    ...templates,
    rules: {
      "@html-eslint/no-restricted-attrs": [
        "error",
        {
          tagPatterns: ["^audio$", "^video$"],
          attrPatterns: ["^autoplay$"],
          message: "Permissions-Policy autoplay=() disables autoplay.",
        },
      ],
    },
  },
  {
    ...scripts,
    plugins: {
      local: { rules: { "no-disabled-permission-api": noDisabledPermissionApi } },
    },
    rules: {
      "local/no-disabled-permission-api": ["error", { camera: [] }],
    },
  },
);
