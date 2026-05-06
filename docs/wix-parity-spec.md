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

Fresh comparison captures from the latest parity pass:
- `/tmp/portfolio-parity-20260506/live-home-1512.png` (`1512 x 5373`)
- `/tmp/portfolio-parity-20260506/live-slackless-1512.png` (`1512 x 2966`)
- `/tmp/portfolio-parity-20260506/local-home-1512.png` (`1512 x 4331`)
- `/tmp/portfolio-parity-20260506/local-slackless-1512.png` (`1512 x 3613`)

Current measured page-height delta:
- Live homepage: `5373px`
- Local homepage: `4331px`
- Live SlackLess: `2966px`
- Local SlackLess: `3613px`

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
- Revenue Sharing iOS SDK
- DeviceCluster
- AirbaFresh

Production client apps
- HashtagGenerator
- KEX
- 24Goals
- MentalMind

Platforms & Backend
- ISTOKHOME
- UniClub
- Kaz Tour Telegram Bot

Early / Discontinued / Legacy
- MIG
- Magazinchik
- SwiftNetworkRouting

AI & ML
- Driver Drowsiness Detection
- Disaster Tweets
- ASL Recognition

Card content order inside each repeater item:
1. Thumbnail image
2. Project title
3. Short category line
4. Short description
5. Tech tags line
6. Orange `Learn More` button

AI / ML homepage cards are the exception: they are text-only on the live Wix page and do not show thumbnails.

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

## 5. Current Local State After Latest Implementation Passes

The following pieces are now aligned enough and should not be reworked unless a later screenshot proves a regression:
- Wix promo bar text, button, and placement are present.
- Header uses the correct live labels:
  - `Flagship`
  - `Production client apps`
  - `Platforms & backend`
  - `Legacy`
  - `AI & ML`
  - `Contact`
- Header logo, 63px dark strip, root-relative anchors, and fixed 980px canvas behavior are in place.
- Homepage content order and project order match the live screenshots.
- Homepage cards no longer show tag chips, status rows, or external-link chips.
- AI & ML homepage cards are text-only.
- Contact copy uses `Get in touch`, `Daniyar Kurmanbayev`, and `Toronto, Canada`.
- Render-facing media fields no longer leak raw `wix:image://` or `wix:video://` refs.

The remaining parity work is visual, not data-model work.

## 6. Remaining Concrete Parity Targets

### 6.1 Homepage full-width hero

Live Wix:
- The homepage hero image spans the full browser width directly under the header.
- The title stack is overlaid inside the image area.
- There is no 980px image crop with side gutters.
- There is no extra orange frame around the hero beyond the live divider treatment.

Current local:
- The hero image is constrained to the 980px canvas.
- The hero has extra orange framing that makes it read as a contained banner module.

Implementation target:
- Make the homepage hero image full viewport width while keeping the overlaid text centered to the Wix canvas.
- Preserve the exact live text order:
  - `Daniyar Kurmanbayev (Dan Kurman)`
  - `Senior iOS Developer / Technical PM`
  - `Portfolio`

### 6.2 Homepage vertical spacing and total height

Measured heights:
- Live homepage: `5373px`
- Local homepage: `4331px`

Current local is about `1042px` shorter than live. The gap comes from compressed section spacing, smaller card rhythm, and tighter contact/footer spacing.

Implementation target:
- Increase vertical rhythm between sections to match the live capture.
- Keep the two-column fixed canvas behavior.
- Do not add new content or marketing sections to compensate for height.

### 6.3 Section dividers

Live Wix:
- Section dividers are centered within the 980px canvas.
- They read as thinner, contained orange separators between groups.
- They do not run across the full browser width.

Current local:
- Several orange separators run viewport-wide and visually overpower the page.

Implementation target:
- Use centered dividers with live-like thickness and width.
- Preserve the orange color but reduce the full-width strip feel.

### 6.4 Homepage card size and density

Live Wix:
- Cards are larger and taller than the current local repeater tiles.
- Image cards have a strong 120px-ish visual area on the left.
- Text blocks have more breathing room while remaining compact.
- Buttons are orange, centered within the card text area, and visually consistent.

Current local:
- Cards are too compressed, especially vertically.
- Card text is truncated earlier than live in several places.
- The homepage height confirms the repeater system is denser than live.

Implementation target:
- Increase card height and internal spacing to live proportions.
- Keep the fixed two-column layout.
- Preserve the content order: title, category/subtitle, description, tech line, `Learn More`.

### 6.5 Project page full-width hero with overlay title

Live SlackLess:
- The project page starts with the same full-width banner image behavior.
- Project title and short description are overlaid on the banner.
- The banner reaches the full browser width under the header.

Current local:
- The project hero image is constrained to 980px.
- The project title and subtitle sit below the banner instead of overlaid inside the hero image.

Implementation target:
- Make project heroes full-width and overlay the project title/subtitle inside the banner.
- Do not use the project thumbnail as a top hero.
- Keep project-specific gallery/media below the hero.

### 6.6 Project media ordering

Live SlackLess:
- After the full-width hero, the page shows the screenshot gallery strip.
- There is no duplicated contained banner block before the gallery.

Current local:
- The constrained banner block appears before the title/gallery structure.

Implementation target:
- Use the shared hero banner only for the top hero.
- Render project screenshots/banners below the hero only as the Wix gallery/media strip.
- Collapse the media strip when no usable media exists.

### 6.7 Project links icon treatment

Live SlackLess:
- `Links` heading is centered.
- App Store and GitHub icons are large orange rounded-square icons.
- Labels sit below the icons.
- There is no dark card frame around each icon tile.

Current local:
- Link icons are centered, but the icon tiles still have a darker framed-card feel and are smaller than live.

Implementation target:
- Enlarge link icons to live proportions.
- Remove extra dark tile chrome around the orange icons.
- Keep custom-label fallback behavior.

### 6.8 Individual case-study cards

Live SlackLess:
- Each text section is its own rounded dark card.
- Orange heading appears at the top of each card.
- There is visible vertical space between cards.

Current local:
- The case-study content appears inside one large combined elevated panel.

Implementation target:
- Render each MDX `h2` section as an individual elevated card.
- Preserve exact section order:
  - `Quick facts`
  - `Summary`
  - `Problem`
  - `Solution`
  - `Architecture`
  - `Hard problems solved`
  - `Impact / Results`
  - `Tech stack`

### 6.9 Contact icon sizing and spacing

Live Wix:
- Contact icons are large orange icons with labels underneath.
- The block has more vertical breathing room than the current local capture.
- Contact remains centered and simple.

Current local:
- Contact icons and footer contact details are smaller and tighter.

Implementation target:
- Increase homepage and project contact icon size and spacing.
- Preserve:
  - `Get in touch`
  - `Daniyar Kurmanbayev`
  - `Toronto, Canada`

## 7. Implementation Constraints For The Next UI Pass

- Do not redesign the site.
- Keep the dark navy / orange visual language.
- Keep the 980px canvas.
- Do not introduce marketing-page composition.
- Do not add decorative blobs, gradients, or new visual motifs.
- Prefer static / server-rendered Astro output.
- Preserve the imported content model and project order.

## 8. Acceptance Standard

A future implementation pass is considered parity-aligned when:
- The homepage layout matches the live Wix hierarchy and density.
- The SlackLess page matches the live Wix hierarchy and density.
- The top promo bar, header, section repeaters, gallery handling, and contact/footer all match the live structure.
- Project pages collapse banner and link sections when empty.
- Mobile keeps the Wix-style dense repeater behavior instead of drifting into a generic responsive card stack.
- Fresh screenshot heights move closer to the live measurements without adding non-Wix sections.
