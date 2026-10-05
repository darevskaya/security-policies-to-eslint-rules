# Security policies to ESLint rules

A browser security policy tells the browser what a page can do. This repo shows how to turn such a policy into ESLint rules. The linter then reports the problem in the editor, before the browser blocks the code.

## Structure

| Path | Content |
|---|---|
| `examples/NN-name/` | One example: a `bad` file, a `good` file, and the `eslint.config.ts` that tells them apart |
| `examples/eslint.base.ts` | The parser setup that all example configurations share |
| `policy.ts` | The policy object and the function that turns it into response headers |
| `plugin/` | Custom rules for the policies that existing rules cannot express |
| `server/` | Express server that sends the policy headers |

Each example folder has all that you need to read: the code and its ESLint configuration. ESLint uses the configuration file that is nearest to the linted file.

`policy.ts` has one object with two readers. The server turns it into headers. The example configurations give parts of it to the rules as options. The header and the lint rule use the same values.

## Commands

| Command | Result |
|---|---|
| `npm install` | Installs the dependencies |
| `npx eslint examples/01-no-unsafe-eval` | Lints one example |
| `npx eslint "examples/*/bad.*"` | Shows the errors of all `bad` files |
| `npm run lint` | Lints the repo without the `bad` files |
| `npm test` | Makes sure that each `bad` file fails and each `good` file passes |
| `npm run typecheck` | Runs the TypeScript compiler |
| `npm run dev` | Starts the server at `http://localhost:3000` |

## Examples

| Folder | Policy | Rule |
|---|---|---|
| `01-no-unsafe-eval` | `script-src` without `'unsafe-eval'` | `no-eval`, `no-new-func`, `no-implied-eval` |
| `02-no-inline-handlers` | `script-src-attr 'none'` | `@html-eslint/no-restricted-attrs`, `no-restricted-syntax` |
| `03-no-inline-styles` | `style-src-attr 'none'` | `@html-eslint/no-inline-styles`, `no-restricted-syntax` |
| `04-trusted-types` | `require-trusted-types-for 'script'` | `browser-policy/require-trusted-types` |
| `05-trusted-types-names` | `trusted-types` | `browser-policy/trusted-types-policy-names` |
| `06-no-object-embed` | `object-src 'none'` | `@html-eslint/no-restricted-tags` |
| `07-no-base` | `base-uri 'none'` | `@html-eslint/no-restricted-tags` |
| `08-source-allowlist` | `script-src`, `frame-src`, `img-src`, `media-src` | `browser-policy/html-csp-source-allowlist` |
| `09-form-action` | `form-action` | `browser-policy/csp-source-allowlist`, `browser-policy/html-csp-source-allowlist` |
| `10-connect-src` | `connect-src` | `browser-policy/csp-source-allowlist`, `browser-policy/html-csp-source-allowlist` |
| `11-worker-src` | `worker-src` | `browser-policy/csp-source-allowlist` |
| `12-iframe-sandbox` | iframe `sandbox` attribute | `@html-eslint/require-attrs`, `@html-eslint/no-restricted-attr-values` |
| `13-permissions-policy` | `Permissions-Policy` | `browser-policy/no-disabled-permission-api` |
| `14-iframe-allow` | `Permissions-Policy` and iframe `allow` | `browser-policy/iframe-allow-policy` |
| `15-no-autoplay` | `Permissions-Policy: autoplay=()` | `@html-eslint/no-restricted-attrs` |
| `16-referrer-policy` | `Referrer-Policy` | `@html-eslint/no-restricted-attr-values`, `no-restricted-syntax` |
| `17-integrity-policy` | `Integrity-Policy` | `@html-eslint/require-attrs` |
| `18-nonce` | CSP nonce | `@html-eslint/no-restricted-attr-values` |
| `19-coep` | `Cross-Origin-Embedder-Policy: require-corp` | `browser-policy/coep-cross-origin` (warning) |
| `21-https-only` | `upgrade-insecure-requests` | `@html-eslint/prefer-https`, `no-restricted-syntax` |

The `browser-policy` rules are the custom rules in `plugin/`. They report literal values only. The folder numbers match the sections of the article.

## Notes

- TypeScript 6 does not accept a `TrustedHTML` value for `innerHTML`. The `good` file of example 04 uses a cast for this reason, and the rule looks through the cast.
- MDN contradicts itself on `style.cssText` under `style-src-attr`. Example 03 follows the `style-src-attr` page.
