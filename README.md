# MDrop

Drop a file or paste a URL. Get clean Markdown.

MDrop is a product wrapper around Microsoft's open source MarkItDown engine. It gives people a web app for converting PDFs, Word docs, slides, spreadsheets, images, web pages, and YouTube links into Markdown without installing Python or creating an account.

Live app: <https://mdrop-conv.vercel.app/>

## Product

MDrop is built for people who need source material converted into Markdown for:

- LLM prompts and agent context
- Notes and personal knowledge bases
- Documentation drafts
- Search, indexing, and retrieval workflows
- Copy/paste workflows where plain extracted text is too lossy

The intended journey is:

```text
Upload file or paste URL -> Convert -> Review Markdown -> Copy or download
```

## Repository Structure

| Path | Purpose |
| --- | --- |
| `apps/web` | Next.js web app deployed to Vercel |
| `apps/api` | FastAPI conversion service deployed separately |
| `vercel.json` | Vercel project configuration |

## Brand System

MDrop uses a custom droplet-and-M mark across the product. The reusable React mark lives in `apps/web/components/brand-mark.tsx`; static favicon, Apple, manifest, and share assets live under `apps/web/app` and `apps/web/public/brand`.

## Local Development

Create the backend environment:

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Run the web app:

```bash
cd apps/web
npm install
npm run dev
```

Open <http://localhost:3000>. The default frontend API URL is `http://localhost:8000`; override it with `NEXT_PUBLIC_API_URL`.

## Quality Bar

MDrop should feel like a finished conversion workspace:

- The first screen should make upload and URL conversion obvious.
- The brand mark should appear consistently in the browser tab, app metadata, header, install surfaces, and shared links.
- File limits and supported formats should be visible before conversion.
- Loading should explain what is happening.
- Success should make copy, download, preview, and source review easy.
- Errors should explain the cause and the next action.
- The app should be usable at mobile, tablet, and desktop widths.

## Security

MDrop accepts user-controlled files and URLs. The API validates file size, supported extensions, URL scheme, and blocks private/localhost/internal-network URL conversion before invoking MarkItDown.

Keep privacy claims aligned with actual deployment behavior.

## Upstream

The conversion capability is powered by Microsoft MarkItDown:

<https://github.com/microsoft/markitdown>
