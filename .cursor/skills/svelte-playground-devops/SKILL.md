---
name: svelte-playground-devops
description: >-
  Describes the DevOps workflow for this SvelteKit (Vite) repository on GitHub
  with Vercel: branch previews, production vs preview URLs, and strict Git
  rules for agents. Use when the user or task touches deployment, CI, Vercel,
  Git remotes, branches, or repository operations for svelte-playground.
---

# Svelte Playground — DevOps & Vercel

## Cursor: rules and this skill

- Project-wide agent policy lives in `.cursor/rules/` (`.mdc`). Follow those first.
- This file covers **GitHub/Vercel/Git**; load it when deployment or repo operations are involved.

## Hard rules for agents

- **Never** run `git commit`, `git push`, `git merge`, or open PRs on the user’s behalf unless the user explicitly overrides this in the same message.
- **Never** change Git remotes, credentials, or GitHub/Vercel org settings without explicit user confirmation in chat.
- It is fine to run **read-only** Git commands (`git status`, `git log`, `git diff`, `git branch -a`) and to edit application code, config files, or docs that are not secrets.

Humans own: commits, pushes, merges, and connecting the GitHub repo to Vercel.

## Stack assumptions

- **App:** SvelteKit with **Vite** (`vite build` / `vite dev`).
- **Remote:** **GitHub** (`github.com`).
- **Hosting:** **Vercel** builds from the connected GitHub repo.

## Vercel: URLs for `develop`, features, and production

1. In Vercel: **Add New Project** → import the GitHub repository → Framework Preset **SvelteKit**.
2. **Production Branch** (Project → Settings → Git): set to your stable branch (commonly `main`). That branch gets the **production** URL after each push/merge.
3. **Preview deployments:** Any other branch (e.g. `develop`, `feature/…`) gets its own **Preview** deployment and URL when commits land on that branch (including **after a merge** into that branch). Vercel shows branch-specific preview URLs in the deployment list and on PRs.
4. Optional: under **Git → Production Branch** / **Ignored Build Step**, keep defaults unless the team needs custom behavior.
5. Env vars: use Vercel **Environment** scopes (Production vs Preview) for secrets; never commit `.env` (already gitignored).

If preview builds fail on Vercel, prefer `@sveltejs/adapter-vercel` explicitly in `svelte.config.js` instead of relying only on `adapter-auto`, and align Node version with Vercel (Project → Settings → General).

## What agents should do instead of commit/push

- Prepare changes, run `npm run check` / `npm run build` locally when useful, and summarize **exact** commands for the human, for example:

```bash
git add -A
git status
git commit -m "chore: initial project"
git remote add origin https://github.com/ORG/REPO.git
git branch -M main
git push -u origin main
```

- For a new GitHub repo: tell the human to create an empty repository on GitHub first, then add `origin` and push.

## Trigger summary

Apply this skill for GitHub/Vercel setup, branch deploy behavior, env vars, or whenever Git write operations would otherwise be tempting—**default to no commit/push**.
