import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(globalIgnores(["node_modules/"]), {
  files: ["**/*.ts"],
  extends: [tseslint.configs.recommended],
});
