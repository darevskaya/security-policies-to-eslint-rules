export interface Policy {
  csp: Record<string, string[]>;
  permissionsPolicy: Record<string, string[]>;
}

export const policy: Policy = {
  csp: {
    "script-src": ["'self'"],
    "script-src-attr": ["'none'"],
    "style-src-attr": ["'none'"],
    "connect-src": ["'self'", "https://api.example"],
    "object-src": ["'none'"],
    "base-uri": ["'none'"],
    "require-trusted-types-for": ["'script'"],
  },
  permissionsPolicy: {
    autoplay: [],
    camera: [],
  },
};

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
  };
}
