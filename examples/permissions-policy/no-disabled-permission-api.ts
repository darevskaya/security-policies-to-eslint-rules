import type { Rule } from "eslint";
import type { CallExpression } from "estree";

type PermissionsPolicy = Record<string, string[]>;

const mediaFeatures: Record<string, string> = {
  video: "camera",
  audio: "microphone",
};

function requestedMedia(call: CallExpression): string[] {
  const constraints = call.arguments[0];
  if (constraints?.type !== "ObjectExpression") return [];
  return constraints.properties.flatMap((property) => {
    if (property.type !== "Property" || property.key.type !== "Identifier") return [];
    const isOff = property.value.type === "Literal" && property.value.value === false;
    return isOff ? [] : [property.key.name];
  });
}

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    schema: [
      {
        type: "object",
        additionalProperties: { type: "array", items: { type: "string" } },
      },
    ],
    messages: {
      disabled:
        "Permissions-Policy disables {{feature}}. A browser that enforces the policy rejects getUserMedia() with {{kind}}.",
    },
  },
  create(context) {
    const policy: PermissionsPolicy = context.options[0] ?? {};

    return {
      'CallExpression[callee.property.name="getUserMedia"]'(node: Rule.Node) {
        if (node.type !== "CallExpression") return;

        for (const kind of requestedMedia(node)) {
          const feature = mediaFeatures[kind];
          if (feature && policy[feature]?.length === 0) {
            context.report({ node, messageId: "disabled", data: { feature, kind } });
          }
        }
      },
    };
  },
};

export default rule;
