import type { Rule } from "eslint";
import { cspSchema, type Csp } from "../util/source-list.ts";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    schema: cspSchema,
    messages: {
      blocked: 'The trusted-types directive does not allow the policy "{{name}}".',
      dynamic: "Use a literal policy name, so that the linter can read it.",
    },
  },
  create(context) {
    const csp: Csp = context.options[0] ?? {};
    const allowedNames = csp["trusted-types"] ?? [];

    return {
      'CallExpression[callee.property.name="createPolicy"]'(node: Rule.Node) {
        if (node.type !== "CallExpression") return;
        const name = node.arguments[0];
        if (name?.type !== "Literal" || typeof name.value !== "string") {
          context.report({ node, messageId: "dynamic" });
        } else if (!allowedNames.includes(name.value)) {
          context.report({
            node: name,
            messageId: "blocked",
            data: { name: name.value },
          });
        }
      },
    };
  },
};

export default rule;
