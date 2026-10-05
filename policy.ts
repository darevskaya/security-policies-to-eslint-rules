export interface Policy {
  csp: Record<string, string[]>;
  permissionsPolicy: Record<string, string[]>;
  referrerPolicy: string;
  integrityPolicy: string[];
  crossOriginEmbedderPolicy: string;
}

export const policy: Policy = {
  csp: {
    "default-src": ["'self'"],
    "script-src": ["'self'"],
    "script-src-attr": ["'none'"],
    "style-src-attr": ["'none'"],
    "img-src": ["'self'", "https://images.example"],
    "media-src": ["'self'"],
    "frame-src": ["'self'", "https://widgets.example"],
    "connect-src": ["'self'", "https://api.example"],
    "worker-src": ["'self'"],
    "form-action": ["'self'", "https://payments.example"],
    "object-src": ["'none'"],
    "base-uri": ["'none'"],
    "require-trusted-types-for": ["'script'"],
    "trusted-types": ["app-html"],
  },
  permissionsPolicy: {
    autoplay: [],
    camera: [],
    "display-capture": [],
    geolocation: [],
  },
  referrerPolicy: "strict-origin-when-cross-origin",
  integrityPolicy: ["script"],
  crossOriginEmbedderPolicy: "require-corp",
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
    "Referrer-Policy": policy.referrerPolicy,
    "Integrity-Policy": `blocked-destinations=(${policy.integrityPolicy.join(" ")})`,
    "Cross-Origin-Embedder-Policy": policy.crossOriginEmbedderPolicy,
  };
}
