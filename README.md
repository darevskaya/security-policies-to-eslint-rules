# Security policies to ESLint rules

A browser security policy tells the browser what a page can do. This repo shows how to turn such a policy into ESLint rules. The linter then reports the problem in the editor, before the browser blocks the code.

## Structure

| Path | Content |
|---|---|
| `examples/name/` | One example: a `bad` file, a `good` file, and the `eslint.config.ts` that tells them apart |
| `examples/eslint.base.ts` | The parser setup that all example configurations share |
| `policy.ts` | The policy object and the function that turns it into response headers |
| `server/` | Express server that sends the policy headers |

Each example folder has all that you need to read: the code and its ESLint configuration. If an example needs a custom rule, the rule file is in the same folder. ESLint uses the configuration file that is nearest to the linted file.

## Commands

| Command | Result |
|---|---|
| `npm install` | Installs the dependencies |
| `npx eslint examples/no-unsafe-eval` | Lints one example |
| `npx eslint "examples/*/bad.*"` | Shows the errors of all `bad` files |
| `npm run lint` | Lints the repo without the `bad` files |
| `npm test` | Makes sure that each `bad` file fails and each `good` file passes |
| `npm run typecheck` | Runs the TypeScript compiler |
| `npm run dev` | Starts the server at `http://localhost:3000` |

## Examples

The examples follow the order of the article.

| Folder | Policy | Rule |
|---|---|---|
| `no-unsafe-eval` | `script-src` without `'unsafe-eval'` | `no-eval`, `no-new-func`, `no-implied-eval` |
| `no-inline-handlers` | `script-src-attr 'none'` | `@html-eslint/no-restricted-attrs`, `no-restricted-syntax` |
| `no-inline-styles` | `style-src-attr 'none'` | `@html-eslint/no-inline-styles`, `no-restricted-syntax` |
| `no-restricted-elements` | `object-src 'none'`, `base-uri 'none'` | `@html-eslint/no-restricted-tags` |
| `trusted-types` | `require-trusted-types-for 'script'` | custom rule `require-trusted-types.ts` |
| `permissions-policy` | `Permissions-Policy: autoplay=(), camera=()` | `@html-eslint/no-restricted-attrs`, custom rule `no-disabled-permission-api.ts` |
| `connect-src` | `connect-src` | `no-restricted-syntax`, `no-restricted-globals` |

The `connect-src` example does not compare URLs with the policy. It keeps external URLs in `endpoints.ts` and permits `fetch()` only in `api.ts`.

## Notes

- TypeScript 6 does not accept a `TrustedHTML` value for `innerHTML`. The `good` file of the `trusted-types` example uses a cast for this reason, and the rule looks through the cast.
- MDN contradicts itself on `style.cssText` under `style-src-attr`. The `no-inline-styles` example follows the `style-src-attr` page.
