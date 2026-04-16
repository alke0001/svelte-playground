---
name: svelte-playground-frontend
description: >-
  Builds Svelte 5 UI and SvelteKit 2 backend-for-frontend in TypeScript for
  svelte-playground: components under src/lib, routes under src/routes, typed
  loads, form actions, and +server.ts API proxies. Code comments in English,
  short plain language. Use when adding or changing components, pages, data
  fetching, forms, or external API integration in this repo.
---

# Svelte Playground — Frontend & BFF

## Scope

- **UI:** Svelte **5** components (runes), pages, layouts, scoped styles.
- **BFF:** SvelteKit **2** server code in TypeScript: `load`, form actions, `+server.ts` handlers, env-based config.

For **Git, Vercel, or deployment**, use the project skill `svelte-playground-devops` instead.

## Project facts

- **Stack:** `svelte` ^5, `@sveltejs/kit` ^2, Vite, TypeScript.
- **Shared UI:** `src/lib/` (import via `$lib/...`). Re-export public components from `src/lib/index.ts` when the barrel file is already in use for exports.
- **Routes:** `src/routes/` (`+page.svelte`, `+layout.svelte`, `+page.server.ts`, `+server.ts`, etc.).

## Code comments

- Write **comments in English** only, short and plain (easy words). No German in source comments.
- Use them for **non-obvious** choices (e.g. why `loading="eager"` or a specific `$effect` exists), not for obvious code.

## Component work

- Prefer **runes**: `$props()`, `$state()`, `$derived()`, `$effect()` only when side effects are required; avoid legacy `export let` / `$:` unless touching existing code that still uses them.
- Use **`lang="ts"`** in `<script>`; type props and event payloads explicitly.
- Match **existing layout and naming** in `src/lib` (e.g. `ProfileCard.svelte` uses `$props()`).
- Keep components **focused**; lift server-only logic into `+page.server.ts`, `+server.ts`, or small `src/lib` TS modules — not into components when it belongs on the server.

## BFF and APIs

- **Secrets and upstream keys:** only in server modules via `$env/static/private` or `$env/dynamic/private`; never expose them to the client.
- **Proxy pattern:** implement `GET`/`POST`/… in `src/routes/.../+server.ts` (or a dedicated route segment), `fetch` the upstream API with `Request`/`fetch` options, map status and body, return `json()` / `error()` / `text()` as appropriate.
- **Typing:** define DTO types or Zod schemas in a colocated `.ts` file under `src/lib` or next to the route; narrow `unknown` from `response.json()` before use.
- **Errors:** use SvelteKit’s `error()` / `fail()` for expected failures; avoid leaking raw upstream error bodies to the browser if they may contain secrets.

## Data loading and mutations

- Prefer **`load`** in `+page.server.ts` (or `+layout.server.ts`) for data the page needs before render; keep serialization boundary clear (return JSON-serializable data).
- Use **form actions** for mutations when using progressive enhancement; validate on the server and return `fail()` with field errors when needed.
- For client-only refetch, use **`fetch` from `+page.ts`** with `depends()` or invalidate `load` keys rather than duplicating BFF URLs in many components.

## Verification

- After substantive edits, run `npm run check` from the repo root and fix reported issues.

## Defaults for agents

- Implement end-to-end: UI + any new BFF route + types; wire the UI to relative paths under `/api/...` or the chosen route.
- Do not widen scope (no unrelated refactors, no new docs files unless asked).
- Prefer **accessible** HTML (labels, buttons, alt text, focus) for new UI.
