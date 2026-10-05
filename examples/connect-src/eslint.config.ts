import { defineConfig } from "eslint/config";
import { scripts } from "../eslint.base.ts";

export default defineConfig(
  {
    ...scripts,
    files: ["**/{bad,good,api}.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/^https?:/]",
          message: "Do not hardcode external URLs. Use endpoints.ts instead.",
        },
      ],
    },
  },
  {
    ...scripts,
    files: ["**/{bad,good,endpoints}.ts"],
    rules: {
      "no-restricted-globals": [
        "error",
        { name: "fetch", message: "Call fetch() only in api.ts." },
      ],
    },
  },
);
