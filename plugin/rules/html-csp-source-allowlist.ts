import type { Attribute, ScriptTag, Tag } from "@html-eslint/types";
import type { RuleDefinition } from "@eslint/core";
import { cspSchema, isAllowedSource, type Csp } from "../util/source-list.ts";

const attributeSinks: Record<string, string> = {
  "script[src]": "script-src",
  "iframe[src]": "frame-src",
  "img[src]": "img-src",
  "audio[src]": "media-src",
  "video[src]": "media-src",
  "form[action]": "form-action",
  "button[formaction]": "form-action",
  "a[ping]": "connect-src",
};

const rule: RuleDefinition = {
  meta: {
    type: "problem",
    schema: cspSchema,
    messages: {
      blocked: '"{{url}}" is not allowed by {{directive}}.',
    },
  },
  create(context) {
    const csp = (context.options[0] ?? {}) as Csp;

    function check(tag: string, attribute: Attribute) {
      const directive = attributeSinks[`${tag}[${attribute.key.value}]`];
      const url = attribute.value;
      if (!directive || !url || url.parts.length > 0) return;
      const sources = csp[directive];
      if (!sources || isAllowedSource(url.value, sources)) return;
      context.report({
        loc: url.loc,
        messageId: "blocked",
        data: { url: url.value, directive },
      });
    }

    return {
      Tag(node: Tag) {
        node.attributes.forEach((attribute) => check(node.name, attribute));
      },
      ScriptTag(node: ScriptTag) {
        node.attributes.forEach((attribute) => check("script", attribute));
      },
    };
  },
};

export default rule;
