import type { ESLint, Rule } from "eslint";
import coepCrossOrigin from "./rules/coep-cross-origin.ts";
import cspSourceAllowlist from "./rules/csp-source-allowlist.ts";
import htmlCspSourceAllowlist from "./rules/html-csp-source-allowlist.ts";
import iframeAllowPolicy from "./rules/iframe-allow-policy.ts";
import noDisabledPermissionApi from "./rules/no-disabled-permission-api.ts";
import requireTrustedTypes from "./rules/require-trusted-types.ts";
import trustedTypesPolicyNames from "./rules/trusted-types-policy-names.ts";

const plugin: ESLint.Plugin = {
  meta: { name: "eslint-plugin-browser-policy", version: "0.0.0" },
  rules: {
    "coep-cross-origin": coepCrossOrigin,
    "csp-source-allowlist": cspSourceAllowlist,
    "html-csp-source-allowlist": htmlCspSourceAllowlist,
    "iframe-allow-policy": iframeAllowPolicy,
    "no-disabled-permission-api": noDisabledPermissionApi,
    "require-trusted-types": requireTrustedTypes as unknown as Rule.RuleModule,
    "trusted-types-policy-names": trustedTypesPolicyNames,
  },
};

export default plugin;
