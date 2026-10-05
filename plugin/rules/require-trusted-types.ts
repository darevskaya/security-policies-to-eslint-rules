import { ESLintUtils, type TSESTree } from "@typescript-eslint/utils";

export default ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: "problem",
    schema: [],
    messages: {
      untrusted: "This sink needs a TrustedHTML value, but it gets {{type}}.",
    },
  },
  defaultOptions: [],
  create(context) {
    const services = ESLintUtils.getParserServices(context);
    const checker = services.program.getTypeChecker();

    function check(value: TSESTree.Node | undefined) {
      while (value?.type === "TSAsExpression") value = value.expression;
      if (!value) return;
      const type = checker.typeToString(services.getTypeAtLocation(value));
      if (type !== "TrustedHTML") {
        context.report({ node: value, messageId: "untrusted", data: { type } });
      }
    }

    return {
      "AssignmentExpression[left.property.name=/^(inner|outer)HTML$/]"(
        node: TSESTree.AssignmentExpression,
      ) {
        check(node.right);
      },
      'CallExpression[callee.property.name="insertAdjacentHTML"]'(
        node: TSESTree.CallExpression,
      ) {
        check(node.arguments[1]);
      },
    };
  },
});
