# Wix Parity Spec

Source of truth:
- Live homepage: <https://daniyarkurmanbayev.wixsite.com/home>
- Live SlackLess page: <https://daniyarkurmanbayev.wixsite.com/home/projects/slackless>
- Local exports:
  - `/Users/daniyar.kbv/Downloads/portfolio_page.html`
  - `/Users/daniyar.kbv/Downloads/portfolio_page.pdf`
  - `/Users/daniyar.kbv/Downloads/project_page.html`
  - `/Users/daniyar.kbv/Downloads/project_page.pdf`
- Canonical Wix export data:
  - `/Users/daniyar.kbv/Documents/Work/Portfolio/Wix content/Data`
  - `/Users/daniyar.kbv/Documents/Work/Portfolio/Wix content/Assets`

Reference captures created for this spec:
- `docs/wix-home-live-desktop.png`
- `docs/wix-home-live-mobile.png`
- `docs/wix-slackless-live-desktop.png`
- `docs/wix-slackless-live-mobile.png`
- `docs/local-home-desktop.png`
- `docs/local-home-mobile.png`
- `docs/local-slackless-desktop.png`
- `docs/local-slackless-mobile.png`

## 1. Visual System

The live site is a dark navy Wix portfolio with a very specific hierarchy:
- Background: `#1E2A38`
- Elevated surfaces: `#29394C`
- Alternate dark surfaces: `#243242` and `#212E3D`
- Accent orange: `#FF6600`
- Active nav blue: `#0D63D1`
- Header nav text: `#C5C5C7`
- Typography is SF Pro Display / SFNS, not a generic Tailwind/Astro default

Core geometry:
- Global content canvas: `980px`
- Header height: `63px`
- Orange divider bar: `7px`
- Thin orange divider: `2px`
- Common rounded container radius: about `10px`
- Section icon size: about `54px`
- Card tiles in repeaters: about `384px` wide in the 2-column desktop layout

Typography notes:
- Nav text is small, uppercase-ish feel, with `0.1em` tracking.
- Large headings are bold SF Pro Display.
- Body text is lighter and muted.
- Letter spacing is generally `0`, except nav and tiny metadata labels.

## 2. Homepage Parity Spec

### 2.1 Exact section order

Live homepage order:
1. Wix promo bar
2. Header
3. Full-width hero banner image
4. Hero title stack
5. `Flagship / System-level work`
6. `Production client apps`
7. `Platforms & Backend`
8. `Early / Discontinued / Legacy`
9. `AI & ML`
10. `Get in touch`
11. Bottom footer row

### 2.2 Homepage hero

Live homepage hero behavior:
- Uses the `Banner Apps.jpg` asset as a wide visual banner.
- Title stack is centered over the banner.
- Text order in the hero:
  - `Daniyar Kurmanbayev (Dan Kurman)`
  - `Senior iOS Developer / Technical PM`
  - `Portfolio`
- The hero is not a marketing landing page.
- There is no selected-work sidebar inside the hero.
- There are no stat chips.
- There is no featured-project card rail in the hero.

### 2.3 Homepage repeaters

Each section uses:
- Centered icon above the label
- Label text below the icon
- Two-column repeater on desktop
- The repeater is still visually dense on mobile; it does not become a generic stacked list

Section order and card order:

Flagship / System-level work
- SlackLess
- DeviceCluster
- Revenue Sharing iOS SDK
- AirbaFresh

Production client apps
- HashtagGenerator
- 24Goals
- KEX
- MentalMind

Platforms & Backend
- ISTOKHOME
- Kaz Tour Telegram Bot
- UniClub

Early / Discontinued / Legacy
- MIG
- SwiftNetworkRouting
- Magazinchik

AI & ML
- Driver Drowsiness Detection
- ASL Recognition
- Disaster Tweets

Card content order inside each repeater item:
1. Thumbnail image
2. Project title
3. Short category line
4. Short description
5. Tech tags line
6. Orange `Learn More` button

The live cards feel like Wix repeater items, not modern editorial cards:
- Dark rounded tile
- No nested card inside card
- No heavy hover motion
- No extra chip rows beyond the visible tech/tag line and the button

### 2.4 Homepage footer / contact

Live footer/contact behavior:
- Section title is centered: `Get in touch`
- The contact name and location are centered below it
- Contact links are shown as large icon blocks
- Email and LinkedIn are visible as icon + label pairs
- Bottom footer row is compact and dark, with logo/name on the left and contact items on the right

### 2.5 Homepage mobile behavior

Live mobile behavior:
- The top Wix promo bar remains visible.
- The header remains a single horizontal row.
- The hero banner still appears as a wide visual.
- The section repeaters remain two-column and compact rather than collapsing into one-column cards.
- Cards stay dense and do not become tall modern panels.
- Footer/contact remains centered and icon-driven.

## 3. SlackLess Project Page Parity Spec

### 3.1 Exact section order

Live SlackLess page order:
1. Wix promo bar
2. Header
3. Full-width banner image
4. Project title
5. Project short description
6. Screenshot / gallery strip
7. `Links`
8. `Quick facts`
9. `Summary`
10. `Problem`
11. `Solution`
12. `Architecture`
13. `Hard problems solved`
14. `Impact / Results`
15. `Tech stack`
16. `Get in touch`
17. Bottom footer row

### 3.2 Project title / subtitle block

Live SlackLess title block behavior:
- Title is plain and prominent.
- Subtitle is directly under the title.
- The block is not inside a heavy framed hero card.
- The page feels centered and open, not boxed like an article template.

### 3.3 Banner and gallery behavior

Live project page media behavior:
- The top banner is a wide visual banner.
- If a project has no banners, that banner section collapses completely.
- Below the title, the page may show a screenshot/gallery strip.
- On SlackLess, the gallery is a row of device screenshots.
- The media presentation is image-first and simple.
- There is no extra decorative chrome around the gallery beyond the section spacing.

### 3.4 Links section

Live links behavior:
- The `Links` section is shown only when links exist.
- Links are centered.
- Each link is rendered as a large icon tile with a label below.
- The label uses the custom label if present; otherwise the link type name.
- On SlackLess, `App Store` and `GitHub` appear.

### 3.5 Case-study text order

The case-study text sections follow the manual text-type order from `Text+Types.csv`:
- `Quick facts`
- `Summary`
- `Problem`
- `Solution`
- `Architecture`
- `Hard problems solved`
- `Impact / Results`
- `Tech stack`

The body text is not styled like a generic prose article:
- Section headings are bold and orange-accented.
- Text is compact and readable.
- Bullets are used for structured details.
- Spacing is consistent and simple.

### 3.6 Project page mobile behavior

Live mobile behavior:
- The banner and title stack remain legible.
- The screenshot/gallery strip stays compact.
- Links remain icon-based.
- The case-study sections remain in the same order.
- No page-wide overflow is visible.

## 4. Canonical Assets and Data Rules

Use these canonical sources only:
- Data CSVs: `/Users/daniyar.kbv/Documents/Work/Portfolio/Wix content/Data`
- Assets: `/Users/daniyar.kbv/Documents/Work/Portfolio/Wix content/Assets`

Important asset mappings:
- `SEO Image.png` -> site SEO / OG fallback image
- `Banner Apps.jpg` -> homepage hero banner
- `Logo Horizontal.png` -> site logo
- `Icons/*` -> header, section, and contact icons
- `Thumbnails/*` -> project thumbnails
- `Banners/*` -> project banners and project media

Render-facing fields must remain free of raw `wix:image://` and `wix:video://` refs.
Raw Wix media refs may remain only in `wix.*` metadata for traceability.

## 5. Current Astro Divergences To Remove Or Rework

These are the current UI pieces that do not match the live Wix structure closely enough:

- `src/components/HeroIntro.astro`
  - Current Astro homepage hero includes a selected-work rail and stat chips.
  - Live Wix homepage has a banner-first hero and no featured-project sidebar.

- `src/components/ProjectSection.astro`
  - Current Astro section headers are still more like a modern content panel.
  - Live Wix uses centered icon + label section headers.

- `src/components/ProjectCard.astro`
  - Current Astro cards still feel too modern and structured.
  - Live Wix cards are simpler repeaters with denser spacing and less nested chrome.

- `src/components/ProjectHero.astro`
  - Current project pages are still too card-like and left-aligned.
  - Live project pages use a simpler centered title + subtitle structure under the banner.

- `src/components/ProjectMedia.astro`
  - Current implementation needs to follow the exact Wix banner / gallery collapse rules.
  - Banner and media sections should collapse fully when the source export has no items.

- `src/components/ProjectLinks.astro`
  - Must remain icon-driven and centered.
  - Empty link sections should not render.

- `src/components/ContactSection.astro`
  - Current contact block is close, but the live version is more centered and more sparse.

- `src/components/SiteFooter.astro`
  - The bottom footer row should feel like the live Wix footer: compact, dark, and simple.

- `src/layouts/BaseLayout.astro`
  - The live Wix site includes the top promo bar above the header.
  - This is still absent from the Astro shell.

## 6. Implementation Constraints For The Next UI Pass

- Do not redesign the site.
- Keep the dark navy / orange visual language.
- Keep the 980px canvas.
- Do not introduce marketing-page composition.
- Do not add decorative blobs, gradients, or new visual motifs.
- Prefer static / server-rendered Astro output.
- Preserve the imported content model and project order.

## 7. Acceptance Standard

A future implementation pass is considered parity-aligned when:
- The homepage layout matches the live Wix hierarchy and density.
- The SlackLess page matches the live Wix hierarchy and density.
- The top promo bar, header, section repeaters, gallery handling, and contact/footer all match the live structure.
- Project pages collapse banner and link sections when empty.
- Mobile keeps the Wix-style dense repeater behavior instead of drifting into a generic responsive card stack.
