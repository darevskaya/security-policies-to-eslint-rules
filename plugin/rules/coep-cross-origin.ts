import type { RuleDefinition } from "@eslint/core";
import type { Tag } from "@html-eslint/types";

const embeddingTags = new Set(["img", "audio", "video"]);

const rule: RuleDefinition = {
  meta: {
    type: "suggestion",
    schema: [],
    messages: {
      crossOrigin:
        "COEP require-corp blocks this resource unless its server sends a CORP header. Add the crossorigin attribute if the server supports CORS.",
    },
  },
  create(context) {
    return {
      Tag(node: Tag) {
        if (!embeddingTags.has(node.name)) return;
        const attribute = (name: string) =>
          node.attributes.find((attribute) => attribute.key.value === name);

        const src = attribute("src")?.value;
        if (src && URL.canParse(src.value) && !attribute("crossorigin")) {
          context.report({ loc: src.loc, messageId: "crossOrigin" });
        }
      },
    };
  },
};

export default rule;
