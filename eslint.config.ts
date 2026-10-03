import html from "@html-eslint/eslint-plugin";
import htmlParser, { TEMPLATE_ENGINE_SYNTAX } from "@html-eslint/parser";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  globalIgnores(["**/node_modules/", "**/dist/", "**/examples/**/bad.*"]),
  {
    files: ["**/*.ts"],
    extends: [tseslint.configs.recommended],
  },
  {
    files: ["**/*.hbs"],
    plugins: { "@html-eslint": html },
    languageOptions: {
      parser: htmlParser,
      parserOptions: {
        templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.HANDLEBAR,
      },
    },
  },
);
