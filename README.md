# Daniyar Kurmanbayev Portfolio

Static Astro rebuild of Daniyar Kurmanbayev’s Wix portfolio. The site is content-driven, ships as a static build, and is intended for Cloudflare Pages.

## Tech Stack

- Astro
- TypeScript
- Tailwind CSS
- MDX
- Astro Content Collections
- Cloudflare Pages

## Project Structure

- Imported case-study content: `src/content/projects/*.mdx`
- Local asset manifest: `src/data/local-assets.json`
- Local asset copies: `public/assets/`
- Contact data: `src/data/contact.ts`

Source content used for imports:

- `/Users/daniyar.kbv/Downloads/codex_portfolio_context_wix_content.md`
- `/Users/daniyar.kbv/Documents/Work/Portfolio/Wix content/*.csv`

## Local Setup

Install dependencies:

```bash
npm install
```

Run the local asset mapping step:

```bash
npm run assets:local
```

Import Wix content into MDX:

```bash
npm run import:wix
```

Refresh both local assets and Wix content:

```bash
npm run content:refresh
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Content Pipeline

The Wix CSV exports are parsed into `src/content/projects/*.mdx`. Those files are generated and can be overwritten by `npm run import:wix`.

Local assets are preferred over Wix media refs. The asset mapper copies matched files into `public/assets/` and writes `src/data/local-assets.json`, which the importer uses when generating frontmatter.

## Cloudflare Pages Deployment

- Build command: `npm run build`
- Output directory: `dist`
- Node version: use the current project runtime, Node 20+ is recommended
- Site URL: set `SITE_URL` in the Cloudflare Pages environment to the deployed domain so canonical and Open Graph URLs resolve correctly

## Notes

- `src/pages/robots.txt.ts` serves the robots file dynamically.
- `src/pages/404.astro` handles the not-found page.
- Generated content and copied assets are intentionally checked in so the site builds without rerunning the import pipeline.
