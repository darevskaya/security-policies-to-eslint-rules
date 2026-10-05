import type { Rule } from "eslint";
import type { Expression, Node, SpreadElement } from "estree";
import { cspSchema, isAllowedSource, type Csp } from "../util/source-list.ts";

const callSinks: Record<string, string> = {
  fetch: "connect-src",
  "navigator.sendBeacon": "connect-src",
  "navigator.serviceWorker.register": "worker-src",
  WebSocket: "connect-src",
  EventSource: "connect-src",
  Worker: "worker-src",
  SharedWorker: "worker-src",
};

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    schema: cspSchema,
    messages: {
      blocked: '"{{url}}" is not allowed by {{directive}}.',
    },
  },
  create(context) {
    const csp: Csp = context.options[0] ?? {};

    function check(directive: string | undefined, url: Expression | SpreadElement | undefined) {
      if (!directive || url?.type !== "Literal" || typeof url.value !== "string") return;
      const sources = csp[directive];
      if (!sources || isAllowedSource(url.value, sources)) return;
      context.report({
        node: url,
        messageId: "blocked",
        data: { url: url.value, directive },
      });
    }

    function checkCall(node: { callee: Node; arguments: (Expression | SpreadElement)[] }) {
      const callee = context.sourceCode.getText(node.callee);
      check(callSinks[callee], node.arguments[0]);
    }

    return {
      CallExpression: checkCall,
      NewExpression: checkCall,
      'AssignmentExpression[left.property.name="action"]'(node: Rule.Node) {
        if (node.type === "AssignmentExpression") check("form-action", node.right);
      },
    };
  },
};

export default rule;
