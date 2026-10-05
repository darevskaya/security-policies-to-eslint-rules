# Plan: browser security policies as ESLint rules

## Context

The article shows that a browser security policy can become a lint rule. Examples of such policies are CSP and Permissions Policy. This repo is the proof for the article. Each example needs code that fails lint, code that passes lint, and a page that shows the real browser behavior.

## Structure

The repo is one flat package. It has no workspaces.

```
examples/NN-name/     bad.hbs, good.hbs, bad.ts, good.ts, eslint.config.ts
examples/eslint.base.ts   parser setup that all example configurations share
policy.ts             policy object and toHeaders()
plugin/               custom rules and their helpers
server/               Express 5, headers middleware, Handlebars views
eslint.config.ts      configuration for the repo code
tests/lint-examples.test.ts
```

Each example folder has its own `eslint.config.ts`, so a reader sees the code and its rules together. ESLint 10 uses the configuration file that is nearest to the linted file.

`policy.ts` is one object with two readers. The server turns it into response headers. The example configurations give it to the rules as options.

The stack is TypeScript 6, Express 5, `express-handlebars`, ESLint 10, `typescript-eslint`, `@html-eslint`, and Vitest. Browser tests with Playwright are postponed.

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

The custom rules are in `plugin/rules`. They report literal values only.

- `csp-source-allowlist` and `html-csp-source-allowlist` (examples 8 to 11)
- `require-trusted-types`, with type information (example 4)
- `trusted-types-policy-names` (example 5)
- `no-disabled-permission-api` (example 13)
- `iframe-allow-policy` (example 14)
- `coep-cross-origin` (example 19)

All other examples use core ESLint rules or `@html-eslint` rules.

## Status

- Done: examples 1 to 19 and 21, each with its own `eslint.config.ts`.
- Done: Express server that sends the policy headers.
- Postponed: Playwright browser tests. They also settle note A.
- Open: example 20, see note D.

## How to test the result

- `npm run lint` passes on all `good` files and on the repo code.
- `npm test` makes sure that every `bad` file reports a problem and every `good` file reports none.
- `npm run typecheck` passes.

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
