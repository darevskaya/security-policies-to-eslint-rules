const policyName = "my-own-policy";

trustedTypes.createPolicy("my-own-policy", { createHTML: (html) => html });
trustedTypes.createPolicy(policyName, { createHTML: (html) => html });
