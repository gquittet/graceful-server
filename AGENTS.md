# Agents

## Workflow after every source change

1. Format modified files: `pnpm exec prettier --write <files>`
2. Lint + auto-fix: `pnpm lint --fix`
3. Unit tests: `pnpm coverage`
4. Integration tests: `pnpm test:integration`

## Commands

| Command                 | What it runs                         |
| ----------------------- | ------------------------------------ |
| `pnpm lint`             | ESLint (flat config)                 |
| `pnpm test`             | Unit tests via vitest                |
| `pnpm coverage`         | Unit tests with coverage             |
| `pnpm test:integration` | Integration tests only (10s timeout) |
| `pnpm build`            | tsup bundle + tsc declaration emit   |

CI and pre-publish order: `lint → coverage → test:integration → build`

## Project structure

Single package (pnpm-workspace used only to allow esbuild build). ESM (`"type": "module"`). Entry: `src/index.ts`, exports `GracefulServer` default + types.

Subpath imports (`#config/*`, `#core/*`, `#interface/*`, `#util/*`) — always use these, never relative paths across directories.

## Test patterns

- Unit tests are `*.test.ts` co-located next to source. Integration tests live in `src/integration/`.
- Integration tests create real `http.Server` on random ports, use native `fetch`. Helper: `createTestServer(options?, handler?)` returns `{ server, port, url, gracefulServer }`.
- Every `it` block includes `expect.assertions(n)` — add this when writing tests.
- Unit tests use `vi.fn()` with explicit type casts for mocked req/res.

## Codebase conventions

- `import type` required for type-only imports (`verbatimModuleSyntax: true`).
- No unused locals/params — compiler enforces this.
- Import groups enforced: `node:` → external → internal → relative. `simple-import-sort` handles this.
- `GracefulServer.State` exposes the enum statically via `Object.assign`.
- Options object is frozen after merge — do not mutate.
- `syncClose: false` runs `closePromises` in parallel; `true` runs them sequentially.

## Build artifacts

Output goes to `lib/` (tsup) — ESM `.mjs`, CJS `.cjs`, declarations `.d.ts`/`.d.cts`. `.npmignore` blocks everything except `lib/`. Always rebuild before publishing.

## Notable

- `tsconfig.prod.json` uses `ignoreDeprecations: "6.0"` for TS 6 compat — do not remove.
- No runtime dependencies. Node >= 20 required.
- No explicit prettier script in package.json; use `pnpm exec prettier --write`.
