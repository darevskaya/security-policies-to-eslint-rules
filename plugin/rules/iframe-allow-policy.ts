import type { RuleDefinition } from "@eslint/core";
import type { Tag } from "@html-eslint/types";
import {
  isDisabled,
  permissionsPolicySchema,
  type PermissionsPolicy,
} from "../util/permissions-policy.ts";

const rule: RuleDefinition = {
  meta: {
    type: "problem",
    schema: permissionsPolicySchema,
    messages: {
      disabled: "Permissions-Policy disables {{feature}}, so the iframe cannot get it.",
    },
  },
  create(context) {
    const policy = (context.options[0] ?? {}) as PermissionsPolicy;

    return {
      Tag(node: Tag) {
        if (node.name !== "iframe") return;
        const allow = node.attributes.find((attribute) => attribute.key.value === "allow");
        if (!allow?.value) return;

        const features = allow.value.value
          .split(";")
          .map((entry) => entry.trim().split(" ")[0] ?? "");

        for (const feature of features) {
          if (isDisabled(feature, policy)) {
            context.report({
              loc: allow.value.loc,
              messageId: "disabled",
              data: { feature },
            });
          }
        }
      },
    };
  },
};

export default rule;
