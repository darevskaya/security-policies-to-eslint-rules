import type { Rule } from "eslint";
import {
  isDisabled,
  permissionsPolicySchema,
  type PermissionsPolicy,
} from "../util/permissions-policy.ts";

const apiFeatures: Record<string, string> = {
  getUserMedia: "camera",
  getDisplayMedia: "display-capture",
  getCurrentPosition: "geolocation",
  watchPosition: "geolocation",
  requestFullscreen: "fullscreen",
};

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    schema: permissionsPolicySchema,
    messages: {
      disabled: "Permissions-Policy disables {{feature}}, so {{api}}() always fails.",
    },
  },
  create(context) {
    const policy: PermissionsPolicy = context.options[0] ?? {};

    return {
      "CallExpression > MemberExpression.callee > Identifier.property"(node: Rule.Node) {
        if (node.type !== "Identifier") return;
        const feature = apiFeatures[node.name];
        if (feature && isDisabled(feature, policy)) {
          context.report({
            node,
            messageId: "disabled",
            data: { feature, api: node.name },
          });
        }
      },
    };
  },
};

export default rule;
