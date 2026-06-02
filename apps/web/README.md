# MDrop Web

Next.js frontend for MDrop.

## Run Locally

```bash
npm install
npm run dev
```

The web app expects the API at `http://localhost:8000` by default. Set `NEXT_PUBLIC_API_URL` to point at another backend:

```bash
NEXT_PUBLIC_API_URL=https://your-api.example.com npm run dev
```

## Main Surfaces

- `app/page.tsx` controls the idle, converting, success, and error app states.
- `components/upload-zone.tsx` is the first-screen conversion workbench.
- `components/result-panel.tsx` is the Markdown review workspace.
- `components/error-state.tsx` contains user-facing recovery copy.
- `lib/api.ts` handles conversion requests and network/timeout failures.

## Checks

```bash
npm run lint
npm run build
```
