import type { Policy } from "./policy.ts";

export function toHeaders(policy: Policy, nonce: string): Record<string, string> {
  const csp = Object.entries(policy.csp)
    .map(([directive, sources]) => {
      const values =
        directive === "script-src" ? [...sources, `'nonce-${nonce}'`] : sources;
      return [directive, ...values].join(" ");
    })
    .join("; ");

  const permissionsPolicy = Object.entries(policy.permissionsPolicy)
    .map(([feature, allowlist]) => `${feature}=(${allowlist.join(" ")})`)
    .join(", ");

  return {
    "Content-Security-Policy": csp,
    "Permissions-Policy": permissionsPolicy,
    "Referrer-Policy": policy.referrerPolicy,
  };
}
