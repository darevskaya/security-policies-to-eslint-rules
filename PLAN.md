# Plan: browser security policies as ESLint rules

## Context

The article shows that a browser security policy can become a lint rule. Examples of such policies are CSP and Permissions Policy. This repo is the proof for the article. Each example needs code that fails lint, code that passes lint, and a page that shows the real browser behavior.

## Decision: one repo, one ESLint configuration, three workspaces

Use one npm workspaces repo with one root `eslint.config.ts`. Do not make one subproject for each example.

- One subproject for each example means 21 installs and 21 configurations. The reader loses the view of the full mapping.
- Flat configuration scopes rules with `files` globs. One block for each example gives the same isolation.
- The custom rules need their own package because they have their own tests. You can publish that package later.

The key idea of the repo is one policy object with two consumers. The Express server turns the object into response headers. The ESLint configuration turns the object into rule options. The header and the lint rule cannot drift apart.

```
package.json                  npm workspaces, scripts
eslint.config.ts              one block per example, reads the policy
tsconfig.base.json
packages/policy/              policy.ts, toHeaders(), toLintOptions()
packages/eslint-plugin-browser-policy/
  src/rules/*.ts              custom rules
  src/util/source-list.ts     CSP source list matcher ('self', host, scheme, 'none')
  tests/*.test.ts             RuleTester
apps/demo/
  src/server/                 Express 5, headers middleware, nonce per response
  src/client/                 browser TypeScript (DOM lib)
  views/                      Handlebars layouts
  examples/NN-name/           bad.hbs, good.hbs, bad.ts, good.ts, README.md
tests/lint-examples.test.ts   ESLint API over every example
tests/browser/*.spec.ts       Playwright, real browser behavior
```

## Stack

- TypeScript, Express 5, and `express-handlebars`. Handlebars has a preset in `@html-eslint/parser` (`TEMPLATE_ENGINE_SYNTAX.HANDLEBAR`). EJS has no preset. The `{{cspNonce}}` placeholder also matches example 18.
- ESLint flat configuration, `typescript-eslint`, `@html-eslint/eslint-plugin` (0.66.x), and `eslint-plugin-no-unsanitized`.
- Vitest for rule tests. Playwright for browser tests.
- At install time, make sure that the peer ranges of all plugins accept the chosen ESLint major version (9 or 10). Pin exact versions.
- The `bad.*` files fail lint on purpose. Exclude them from `npm run lint`. Assert their errors in `tests/lint-examples.test.ts`.

## Verdict for each example

All rule names in the draft are real. `@html-eslint` has `no-restricted-attrs`, `no-restricted-attr-values`, `no-restricted-tags`, `no-inline-styles`, `require-attrs`, `no-target-blank`, and `prefer-https`. `eslint-plugin-browser-security` has the four rules that the draft names.

No example is false as a whole. One claim is disputed (note A). One example is off topic (note D).

| # | Example | Verdict | Implementation |
|---|---|---|---|
| 1 | no `unsafe-eval` | Keep | core `no-eval`, `no-new-func`, `no-implied-eval` |
| 2 | `script-src-attr 'none'` | Keep | `no-restricted-attrs` with `^on`, custom rule for `setAttribute("on…")` |
| 3 | `style-src-attr 'none'` | Keep, fix one claim | `no-inline-styles`, custom rule for `setAttribute("style")`. See note A for `cssText` |
| 4 | Trusted Types sinks | Keep, update | `no-unsanitized` as baseline, typed custom rule. See note B |
| 5 | `trusted-types` names | Keep | custom rule, literal names against the allowlist, report dynamic names |
| 6 | `object-src 'none'` | Keep | `no-restricted-tags` |
| 7 | `base-uri` | Keep | `no-restricted-tags` for `'none'`, source list rule for `'self'` |
| 8 | source allowlists | Keep | custom HTML rule with the shared source list matcher |
| 9 | `form-action` | Keep, extend | same matcher. Add the `formaction` attribute on buttons, which the draft omits |
| 10 | `connect-src` | Keep | custom rule for `fetch`, `XMLHttpRequest.open`, `WebSocket`, `EventSource`, `sendBeacon`, and `ping` |
| 11 | `worker-src` | Keep | same rule family for `Worker`, `SharedWorker`, `serviceWorker.register` |
| 12 | iframe `sandbox` | Keep, label as not CSP | `require-attrs`, custom token rule |
| 13 | Permissions Policy APIs | Keep | custom rule, feature to API map |
| 14 | iframe `allow` | Keep | custom HTML rule against the policy object |
| 15 | `autoplay=()` | Keep, HTML only | `no-restricted-attrs`. MDN confirms that `play()` rejects only without a user gesture |
| 16 | Referrer Policy | Keep | `no-restricted-attr-values`, small custom rule for `.referrerPolicy` |
| 17 | Integrity Policy | Keep, add support data | custom HTML rule. See note C |
| 18 | static nonce | Keep | custom HTML rule that accepts only the `{{cspNonce}}` placeholder |
| 19 | COEP `require-corp` | Keep as warning | custom HTML rule at `warn` severity |
| 20 | COOP and `window.open` | Drop, or move to an appendix | See note D |
| 21 | HTTPS only | Keep | `prefer-https`, small custom rule for `http:` and `ws:` literals in JavaScript |

### Note A: `cssText`

MDN contradicts itself. The `style-src-attr` page says that the browser blocks `style.cssText = …`. The `style-src` page says that no browser blocks the `cssText` setter.

The Playwright test for example 3 decides this. If Chromium and Firefox do not block `cssText`, remove it from the rule and from the article. `setAttribute("style", …)` stays.

### Note B: Trusted Types

Trusted Types became Baseline in February 2026 with Firefox 148. Safari supports it from version 26. The article can say this, and examples 4 and 5 become stronger.

The typed rule depends on `TrustedHTML` in the TypeScript DOM library. During implementation, make sure that the pinned TypeScript version accepts `TrustedHTML` on the `innerHTML` setter. If it does not, the rule reads the type of the right-hand side, and the example adds a cast.

### Note C: Integrity Policy

The draft statement "not Baseline" is correct. Chrome supports the header from version 138. Firefox supports it from version 145, for scripts only. Safari does not support it.

Put these versions in the article. Run the browser test for this example in Chromium only.

### Note D: example 20

The facts are correct, but the draft itself says that the rule is not a COOP mapping. No header value drives the rule, and the policy object has nothing to give it. Build it last as an appendix example. If the article is too long, cut it.

### Note E: second variant of example 10

The draft also shows a rule that permits `fetch` only through `apiClient`. Show this variant with core `no-restricted-globals`. It needs no custom code.

## Custom rules

The package name is `eslint-plugin-browser-policy`.

JavaScript rules use `@typescript-eslint/utils` and `RuleTester`:

- `no-inline-handler-attribute` (example 2)
- `no-inline-style-string` (example 3)
- `require-trusted-types`, typed (example 4)
- `trusted-types-policy-names` (example 5)
- `csp-source-allowlist`, with options for connect, worker, and form sinks (examples 9, 10, 11)
- `no-disabled-permission-api` (example 13)
- `no-weak-referrer-policy` (example 16)
- `no-insecure-url` (example 21)
- `window-open-noopener` (example 20, appendix)

HTML rules visit `@html-eslint/parser` nodes (`Tag`, `Attribute`):

- `html-csp-source-allowlist` (examples 7, 8, 9, 10)
- `iframe-sandbox-tokens` (example 12)
- `iframe-allow-policy` (example 14)
- `require-integrity` (example 17)
- `no-static-nonce` (example 18)
- `coep-cross-origin` (example 19)

All URL rules share `src/util/source-list.ts`. They report literal URLs only. For a dynamic value, a rule option selects between ignore and report.

## Build order

1. Scaffold the repo: git, workspaces, TypeScript, ESLint, Vitest.
2. Write `packages/policy` and the Express app. The app has the headers middleware and one route for each example (`/examples/:id/:variant`).
3. Write the examples that need only existing rules: 1, 6, 7 (`'none'`), 15, 16 (HTML), 21 (HTML), and the HTML sides of 2, 3, and 12.
4. Write the source list matcher, then examples 7 to 11.
5. Write the other custom rules: 2, 3, 4, 5, 12, 13, 14, 16, 17, 18, 19, 21.
6. Write the Playwright tests. Each `bad` page must produce a `securitypolicyviolation` event, a `TypeError`, or a rejected promise. Each `good` page must produce none.
7. Write the root `README.md` with one table: policy, browser behavior, rule, example folder. The article uses the same table.

## How to test the result

- `npm run lint` passes on all `good` files and on the repo code.
- `npm test` runs the `RuleTester` suites and `tests/lint-examples.test.ts`. That test asserts the exact rule ids on every `bad` file and zero messages on every `good` file.
- `npm run test:browser` runs Playwright against the Express server. It proves that the browser blocks what the lint rule reports. It also settles note A.
- Manual test: start the server, open `/examples/04/bad`, and read the violation in the browser console.

## Sources

- https://html-eslint.org/docs/rules
- https://html-eslint.org/docs/integrating-template-engine
- https://github.com/ofri-peretz/eslint/blob/main/packages/eslint-plugin-browser-security/README.md
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/style-src-attr
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/style-src
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Integrity-Policy
- https://caniuse.com/mdn-http_headers_integrity-policy
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy/autoplay
- https://caniuse.com/trusted-types
