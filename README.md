# Daniyar Kurmanbayev Portfolio

Static Astro rebuild of Daniyar Kurmanbayev’s Wix portfolio. The site is content-driven, ships as a static build, and is intended for Cloudflare Pages.

## Golden Source

The checked-in Astro project is now the source of truth for the live site.

- Case-study content lives in `src/content/projects/*.mdx`
- Shared contact data lives in `src/data/site.ts`
- The copied runtime assets live in `public/assets/`
- The legacy asset lookup manifest lives in `src/data/local-assets.json`

The Wix CSV and asset export workflow is retained only as legacy migration tooling. Use it only when you intentionally need to rebuild checked-in content from the original Wix export, not for routine site edits.

## Tech Stack

- Astro
- TypeScript
- Tailwind CSS
- MDX
- Astro Content Collections
- Cloudflare Pages

## Project Structure

- Case-study content: `src/content/projects/*.mdx`
- Legacy local asset manifest: `src/data/local-assets.json`
- Local asset copies: `public/assets/`
- Site metadata and contact data: `src/data/site.ts`
- Legacy Wix migration scripts: `scripts/legacy-wix/`

Source content used for imports:

- `/Users/daniyar.kbv/Downloads/codex_portfolio_context_wix_content.md`
- `/Users/daniyar.kbv/Documents/Work/Portfolio/Wix content/*.csv`

## Local Setup

Install dependencies:

```bash
npm install
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

Run golden-source content integrity checks:

```bash
npm run test:content
```

Run the full Playwright suite:

```bash
npm test
```

This runs the content checks first, then the screenshot suite, then the interaction suite.

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

Project pages render their banner/media area when `showMediaBanner` is `true`. Use the top-level `banners` array for swipeable multi-banner projects, including still images or video demo slides, or fall back to the normalized `image` field for single-banner projects. Keep archived Wix metadata under the `wix` key for reference only; runtime rendering should use the Astro frontmatter fields.

The live app reads explicit asset paths from Astro content and `src/data/site.ts`. `src/data/local-assets.json` is retained for the legacy Wix migration scripts only.

Safe to run routinely:

- `npm run dev`
- `npm run build`
- `npm run test:content`
- `npm run test:visual`
- `npm run test:interaction`
- `npm test`
- `npm run test:visual:update` when the current render is the intended new baseline

Legacy migration-only scripts:

- `npm run legacy:wix:assets`
- `npm run legacy:wix:import`
- `npm run legacy:wix:refresh`

These scripts rebuild checked-in content and assets from the original Wix CSV and asset exports. They are useful for migration recovery work, but they should not be part of normal site editing. Review their diffs before keeping the result.

Raw Wix metadata in each project MDX file is retained as archival frontmatter under the `wix` key. The rendered site should use the normalized Astro fields and checked-in local assets. Moving that archival metadata out of MDX can be considered later as a dedicated content migration, but it is intentionally not part of routine editing.

Legacy Wix contact-link exports are archival only. If the importer is run, it writes them under `scripts/legacy-wix/archive/` instead of recreating runtime contact data.

## Cloudflare Pages Deployment

- Build command: `npm run build`
- Output directory: `dist`
- Node version: use the current project runtime, Node 20+ is recommended
- Site URL: set `SITE_URL` in the Cloudflare Pages environment to the deployed domain so canonical and Open Graph URLs resolve correctly

## Notes

- `src/pages/robots.txt.ts` serves the robots file dynamically.
- `src/pages/404.astro` handles the not-found page.
- Generated migration output and copied assets are intentionally checked in so the site builds without rerunning the legacy Wix pipeline.
- Visual snapshots are a QA guardrail for the Wix replacement. Review screenshot diffs before updating baselines, and update them only for intentional content or design changes.
- The Wix importer and asset mapper live under `scripts/legacy-wix/` to make their migration-only role explicit.
