# Daniyar Kurmanbayev Portfolio

Static Astro rebuild of Daniyar Kurmanbayev’s Wix portfolio. The site is content-driven, ships as a static build, and is intended for Cloudflare Pages.

## Golden Source

The checked-in Astro project is now the source of truth for the live site.

- Case-study content lives in `src/content/projects/*.mdx`
- Shared contact data lives in `src/data/contact.ts`
- The copied runtime assets live in `public/assets/`
- The asset lookup manifest lives in `src/data/local-assets.json`

The Wix CSV and asset export workflow is retained only as migration tooling. Use it when you need to rebuild the checked-in content from the original Wix export, not for routine site edits.

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

Run visual regression checks against the production preview:

```bash
npm run test:visual
```

Run keyboard, dialog, and reduced-motion checks:

```bash
npm run test:interaction
```

Run the full Playwright suite:

```bash
npm test
```

Update committed visual baselines only when the current rendered site is intentionally becoming the new source of truth:

```bash
npm run test:visual:update
```

Preview the production build locally:

```bash
npm run preview
```

## Editing Workflow

To add or edit a project, update the relevant file in `src/content/projects/*.mdx` directly. Those files now define the live project content and should be edited by hand unless you are intentionally rebuilding from the Wix export.

To update project images or other runtime assets, add or replace files under `public/assets/`. Use those paths from the MDX frontmatter or page components.

If the asset manifest needs to be refreshed, run:

```bash
npm run assets:local
```

That command rebuilds `src/data/local-assets.json` from the Wix asset export and copies matched files into `public/assets/`. Review the diff before keeping the result, because it can change tracked assets and the manifest together.

Safe to run routinely:

- `npm run dev`
- `npm run build`
- `npm run test:visual`
- `npm run test:interaction`
- `npm test`
- `npm run test:visual:update` when the current render is the intended new baseline
- `npm run assets:local` when you are intentionally refreshing the local asset manifest

Legacy migration-only scripts:

- `npm run import:wix`
- `npm run content:refresh`

These scripts rebuild checked-in content from the original Wix CSV exports. They are useful for migration work, but they should not be part of normal site editing.

## Cloudflare Pages Deployment

- Build command: `npm run build`
- Output directory: `dist`
- Node version: use the current project runtime, Node 20+ is recommended
- Site URL: set `SITE_URL` in the Cloudflare Pages environment to the deployed domain so canonical and Open Graph URLs resolve correctly

## Notes

- `src/pages/robots.txt.ts` serves the robots file dynamically.
- `src/pages/404.astro` handles the not-found page.
- Generated content and copied assets are intentionally checked in so the site builds without rerunning the import pipeline.
- Visual snapshots are a QA guardrail for the Wix replacement. Review screenshot diffs before updating baselines, and update them only for intentional content or design changes.
- The Wix importer and asset mapper can stay in `scripts/` for now as legacy tooling. Moving them to a dedicated `legacy/migration/` folder would be reasonable later, but it is not necessary for the current workflow.
