# Hosting — GitHub Pages (github.io)

**Canonical URL:** [https://mrlynn.github.io/cursor-loop-workshop/](https://mrlynn.github.io/cursor-loop-workshop/)

Docusaurus is configured for this path:

```ts
// site/docusaurus.config.ts
url: 'https://mrlynn.github.io',
baseUrl: '/cursor-loop-workshop/',
```

Deploys automatically on push to `main` via `.github/workflows/deploy-site.yml`.

---

## One-time account fix (required if links redirect to mlynn.org)

GitHub may redirect `mrlynn.github.io/...` → `mlynn.org/...` when **mlynn.org** is bound to your account Pages settings. Your personal site on Vercel does not serve `/cursor-loop-workshop/`, so the workshop 404s.

### Repo settings

[github.com/mrlynn/cursor-loop-workshop/settings/pages](https://github.com/mrlynn/cursor-loop-workshop/settings/pages)

- **Custom domain:** leave **empty**
- **Build and deployment:** **GitHub Actions**

### Account settings

[github.com/settings/pages](https://github.com/settings/pages)

- Remove **mlynn.org** as the account-wide Pages domain (or stop using it for all Pages sites)

### Verify

```bash
curl -sI https://mrlynn.github.io/cursor-loop-workshop/ | grep -i '^location'
```

No output = good (no redirect). Then open the URL in an incognito window.

### Re-deploy

[Run workflow → Deploy workshop site](https://github.com/mrlynn/cursor-loop-workshop/actions/workflows/deploy-site.yml)

---

## Local preview

```bash
make site-build
cd site && npm run serve
# http://localhost:3000/cursor-loop-workshop/
```

---

## Subdomain option (not in use)

If you later want `workshop.mlynn.org`, see git history for `HOSTING.md` Fix B — requires DNS CNAME + `baseUrl: '/'`.
