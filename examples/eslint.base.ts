import html from "@html-eslint/eslint-plugin";
import htmlParser, { TEMPLATE_ENGINE_SYNTAX } from "@html-eslint/parser";
import type { Linter } from "eslint";
import globals from "globals";
import tseslint from "typescript-eslint";
import browserPolicy from "../plugin/index.ts";

export const scripts: Linter.Config = {
  files: ["**/{bad,good}.ts"],
  plugins: { "browser-policy": browserPolicy },
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: { projectService: true },
    globals: globals.browser,
  },
};

export const templates: Linter.Config = {
  files: ["**/{bad,good}.hbs"],
  plugins: { "@html-eslint": html, "browser-policy": browserPolicy },
  languageOptions: {
    parser: htmlParser,
    parserOptions: {
      templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.HANDLEBAR,
    },
  },
};
