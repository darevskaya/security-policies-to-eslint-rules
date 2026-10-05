export type PermissionsPolicy = Record<string, string[]>;

export const permissionsPolicySchema = [
  {
    type: "object",
    additionalProperties: { type: "array", items: { type: "string" } },
  },
] as const;

export function isDisabled(feature: string, policy: PermissionsPolicy): boolean {
  return policy[feature]?.length === 0;
}
