import { readdirSync } from "node:fs";
import { ESLint } from "eslint";
import { describe, expect, test } from "vitest";

const examples = readdirSync("examples", { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

const eslint = new ESLint();

async function countMessages(pattern: string) {
  const results = await eslint.lintFiles(pattern);
  return results.reduce((count, result) => count + result.messages.length, 0);
}

describe.each(examples)("%s", (example) => {
  test("bad files fail", async () => {
    expect(await countMessages(`examples/${example}/bad.*`)).toBeGreaterThan(0);
  });

  test("good files pass", async () => {
    expect(await countMessages(`examples/${example}/good.*`)).toBe(0);
  });
});
