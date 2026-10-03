export interface Policy {
  csp: Record<string, string[]>;
  permissionsPolicy: Record<string, string[]>;
  referrerPolicy: string;
}

export const policy: Policy = {
  csp: {
    "default-src": ["'self'"],
    "script-src": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'none'"],
  },
  permissionsPolicy: {
    camera: [],
    geolocation: [],
  },
  referrerPolicy: "strict-origin-when-cross-origin",
};
