export type Csp = Record<string, string[]>;

export const cspSchema = [
  {
    type: "object",
    additionalProperties: { type: "array", items: { type: "string" } },
  },
] as const;

const SELF = "https://self.invalid";

export function isAllowedSource(url: string, sources: string[]): boolean {
  const parsed = URL.parse(url, SELF);
  if (!parsed) return false;
  if (parsed.origin === SELF) return sources.includes("'self'");
  return sources.includes(parsed.origin) || sources.includes(parsed.protocol);
}
