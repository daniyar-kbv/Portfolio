# Portfolio Context For Future Codex Sessions

This file captures project knowledge and decisions that should survive across chats. Read it together with `AGENTS.md` and `README.md` before making portfolio, content, asset, or design changes.

## Source Of Truth

- The Astro workspace in this repository is the live portfolio source of truth.
- Routine project edits should be made directly in `src/content/projects/*.mdx`, `src/data/site.ts`, and `public/assets/`.
- The old Wix content/export flow is legacy migration tooling only. Do not regenerate runtime content from Wix unless explicitly requested.
- The Work Portfolio Notes folder was a temporary source. Its useful detailed project notes have been captured in this repo/context. It is safe to delete after confirming this file is present.
- Do not import the Notes items named `Icon sizes` or `Short project summaries`. The user said icon sizes are only personal reference, and short summaries were derived from detailed summaries.
- Prefer detailed project summaries over short summaries when writing or revising case-study copy.

## Identity And Positioning

- Public-facing short brand: `Dan Kurman`.
- Full/legal name: `Daniyar Kurmanbayev`.
- Current homepage treatment intentionally makes `Dan Kurman` a visible primary hero identity and uses `Daniyar Kurmanbayev · Toronto, Canada` as secondary supporting identity.
- Default formal role line: `Senior iOS Developer / Technical PM`.
- Homepage hero role label: `Senior native iOS developer`.
- Location/contact data live in `src/data/site.ts`.
- Tone: senior iOS/product engineer with production delivery, architecture cleanup, launch readiness, and client communication strength.
- The homepage is intentionally client-first for Upwork, LinkedIn, and resume traffic while staying platform-neutral. It should persuade founders/clients first, with recruiter usefulness as a secondary benefit.
- Homepage positioning is: `I build reliable native iOS apps and AI-powered mobile features.`
- AI positioning should mean AI service/API integration for native products: native UX, backend proxy/API integration, persistence, usage limits, credits/paywalls, cost/failure-state handling, and App Store-ready delivery.
- Do not position the user as an ML researcher, custom model-training engineer, or AI lab/research profile.
- Main conversion path is Contact. Do not add Upwork-specific language, rates, availability claims, testimonials, or unverified metrics unless the user explicitly approves them.

## Design Direction

- Current palette uses a true black background (`#000000`), iOS-style elevated surfaces (`#1C1C1E` family), and the existing orange accent. Do not replace the color palette again without explicit approval.
- Desired visual style: iOS-ish, Apple-ish, Human Interface Guidelines inspired.
- Navigation inspiration: Apple public/global nav patterns such as Apple Store, Apple Developer, and App Store Connect.
- Section icons are intentional and should remain prominent. They are meant to look like iOS app icons and were made with Icon Composer.
- The `Recent Client Work` section uses the briefcase-style Icon Composer asset at `public/assets/icons/recent-client-work-icon.png`.
- Keep the site as a portfolio credibility page: homepage for positioning/services/proof, project pages for deeper evidence.
- Avoid heavy ornamental design. Prefer compact, restrained hierarchy, fluid responsive layouts, subtle dividers, and Apple-like text CTAs.
- For Apple/HIG polish, prioritize clarity and editorial hierarchy over more decoration: calmer hero type, larger feature modules for the most important services, softer card chrome, stable tap targets, and restrained motion.
- Native surface polish direction: make UI feel closer to iOS grouped surfaces and Apple product pages, not a generic web card grid. Prefer one filled primary action, secondary text links, small native-style glyphs, grouped inset action cells, softer borders, and subtle press/hover feedback.
- Card UI should use shared semantic surface tokens in `src/styles/tokens.css` instead of one-off component mixes. Current card roles are feature tiles, selected-proof modules, archive/list cells, contact/action cells, and project-detail content groups.
- Keep card chrome quiet and Apple-like: 8px system-like radius, borderless elevated fills, no mixed card fill colors, subtle or no shadows, contained media, and small press/hover feedback. Selected proof can be larger than archive cards, but the surface treatment should remain consistent.
- Apple card references from the saved PDFs lean toward media-first, borderless product tiles with generous interior whitespace, centered copy for product/archive cards, tiny metadata, and simple text CTAs. Preserve the repo’s 8px card radius constraint while borrowing that anatomy. Cards should generally use the single `#1C1C1E` elevated fill rather than component-specific color mixes.
- Avoid visible Wix branding/promo UI on the live portfolio.
- Keep the project content, routes, and schema stable unless the user explicitly asks for content/schema migration.

## Current UI Implementation Notes

- The site no longer uses the old fixed `width=980` viewport/min-width approach.
- Layout containers use fluid widths with safe inline padding.
- The header is a compact translucent Apple-style global nav on desktop.
- Mobile/tablet nav is a disclosure panel with:
  - 44px minimum tap targets,
  - `aria-expanded`,
  - Escape close,
  - close on link click,
  - left-aligned full-width menu rows.
- Header nav is conversion-focused: `Services`, `Selected work`, `Projects`, `Contact`.
- Homepage structure is:
  - hero positioning,
  - proof strip,
  - `How I can help` services,
  - selected client outcomes,
  - `More selected work` archive,
  - contact.
- Service areas are problem-based, not technology-category based:
  - native iOS apps from design to release,
  - AI-powered mobile features,
  - payments, StoreKit, and entitlements,
  - launch readiness and stabilization,
  - legacy app rescue and architecture cleanup,
  - mobile and backend integration.
- The first two homepage services (`Native iOS apps from design to release` and `AI-powered mobile features`) are intentionally featured as larger Apple-style tiles. The remaining services are supporting tiles.
- Homepage services use exported SF Symbols from `public/assets/sf-symbols/`, selected through `serviceAreas[].icon` and rendered as monochrome CSS masks; keep them subtle and HIG-like rather than decorative.
- Selected homepage proof is intentionally curated:
  - large cards: `blackville`, `kalyan-studio-apps`, `hashtaggenerator`, `mountainxperience-tracking`;
  - compact cards: `end-of-day`, `stop-overthinking`, `snowdon-summit-weather`.
- Selected proof cards should feel more editorial than the archive: larger visuals, outcome-first headlines from `projectOutcomeHeadlines`, subdued metadata, and text CTAs.
- The lower project archive should exclude those selected recent projects and group the remaining non-recent work by archive category.
- Homepage project cards should show visuals for every non-AI project, including compact selected proof cards. AI/ML experiment cards remain text-only in the archive unless the user explicitly changes that direction.
- Archive cards are intentionally quieter than selected proof cards, but their visuals should still feel product-like and intentional: media should be large enough to read, bottom padding inside media wells should stay tight, and copy should start soon after the visual rather than leaving a large blank stage.
- The homepage contact section should finish like a restrained iOS contact/business card: clear identity, short contextual note, and grouped action cells for Email and LinkedIn, without a large portrait unless a final headshot asset is explicitly provided.
- Project detail case-study sections should feel like grouped inset surfaces: softer fill, lower border contrast, readable width, and less aggressive orange headings.
- The homepage hero keeps `/assets/hero/banner-apps.jpg`.
- Hero overlays should use black/elevated-color vignette gradients that fade into the `#000000` page background. Avoid bringing back the older blue-gray overlay tint because it clashes with the current Apple-like dark palette.
- The hero parallax relies on `src/scripts/parallax-hero.ts` and CSS in `src/styles/layout.css`.
- Reduced motion must continue disabling parallax transforms.
- Project detail pages should match the homepage system: editorial dark hero, compact tag chips, a summary/proof band, named media sections, subdued action-row links, and borderless elevated case-study cards.
- Project screenshot/banner lightbox behavior lives in `src/scripts/project-lightbox.ts` and must stay keyboard accessible.
- Project pages can render a multi-banner carousel from top-level MDX `banners`; it auto-swipes, supports pointer swipe/dots/arrows, and still opens the active banner in the fullscreen lightbox. Banners can be still images or video demo slides. Reduced motion disables auto-swipe and autoplay video.
- The `Case study` label is a normal-case section heading, not the old uppercase eyebrow.

## Content Architecture

- Project content collection schema is in `src/content/config.ts`.
- Project categories are defined in `src/data/site.ts`:
  - `Recent`
  - `Flagship`
  - `Production`
  - `Backend`
  - `Legacy`
  - `AI`
- Homepage positioning, proof points, services, selected-proof slugs, project-outcome copy, and archive sections live in `src/data/site.ts`.
- Current archive taxonomy is:
  - `Flagship Engineering`
  - `iOS Apps & Product Builds`
  - `Platforms & Backend`
  - `Legacy & Libraries`
  - `AI & ML Experiments`
- Recent public client/project proof should be placed in `Recent` first when it represents active commercial delivery, launch support, or current client work.
- `Meta Purchase Attribution Fix` should not be added as a public project page yet. Keep it as private/anonymized proposal knowledge unless a dedicated text-only/private case-study format is approved later.
- Runtime rendering should use normalized Astro fields:
  - `title`
  - `subtitle`
  - `description`
  - `category`
  - `typeTags`
  - `techTags`
  - `status`
  - `featured`
  - `priority`
  - `role`
  - `stack`
  - `links`
  - `thumbnail`
  - `image`
  - `banners`
  - `showMediaBanner`
  - `media`
  - `screenshots`
  - `coverAlt`
  - `highlights`
- The `wix` frontmatter block is archival only.
- The `wix` frontmatter block is optional for new hand-written project pages because they do not come from Wix imports.
- `src/data/local-assets.json` is retained for legacy migration scripts only, not runtime rendering.

## Asset Conventions

- Asset folders and files under `public/assets` should stay snake case or already-established slug case where project slugs use hyphens.
- Runtime project assets live under `public/assets/projects/<project-slug>/`.
- Common runtime names:
  - `thumbnail.png`
  - `banner.png`
  - `screenshots/screenshot-1.png`, etc.
  - `media-1.mov`, etc. when a project uses video media
- Current assets include:
  - `public/assets/hero/banner-apps.jpg`
  - `public/assets/logo/logo-horizontal.png`
  - `public/assets/icons/*.png`
  - `public/assets/seo/seo-image.png`
- If new Figma exports are added later, keep them under a `figma/` subfolder in that project folder.
- Figma exports may be stored in project asset folders for archival/future use without being exposed in the UI.
- If multiple banner source exports are added later, keep them under a `banners/` subfolder unless the runtime banner is the root `banner.png`.
- Top-level project `banners` should point to runtime files under `public/assets/projects/<project-slug>/banners/`. Order named platform banners as Mobile, then Web, then Telegram Bot.
- Current multi-banner projects are `uniclub`, `istokhome`, `asl-recognition`, `disaster-tweets`, and `driver-drowsiness-detection`.
- `driver-drowsiness-detection` uses a video demo as the first banner slide at `public/assets/projects/driver-drowsiness-detection/banners/demo.mp4`, followed by the still screenshot banner.

## Existing Portfolio Projects

Current MDX projects:

- `blackville`: Recent. Black-owned marketplace iOS app plus PHP/CodeIgniter backend launch stabilization. Swift/UIKit, Stripe PaymentSheet, Apple Pay, Firebase Crashlytics, PHP, MySQL.
- `mountainxperience-tracking`: Recent. Cross-platform mountain safety tracking app with Firebase backend automation, background location, late-back alerts, and OS map layers. SwiftUI, Kotlin/Compose, Firebase, Google Maps, Ordnance Survey tiles.
- `kalyan-studio-apps`: Recent. Multi-target iOS music app suite modernization. StoreKit 2 migration, legacy paid-user restoration, Objective-C/Objective-C++ cleanup, Firebase Analytics, audio/catalog workflow support.
- `end-of-day`: Recent. Minimal SwiftUI journaling app built from Figma to App Store. StoreKit 2 one-time unlock, local-only persistence, Lottie, TestFlight/App Store release support.
- `stop-overthinking`: Recent. SwiftUI guided journaling app with SwiftData, private CloudKit sync, StoreKit 2, prompt rotation, writing history, and App Store release support.
- `snowdon-summit-weather`: Recent. SwiftUI/WKWebView replacement for a broken production weather app plus native Android version. SwiftUI, WKWebView, Kotlin, Jetpack Compose.
- `slackless`: Flagship. iOS Screen Time productivity app. Solo product/design/engineering. Swift, Screen Time APIs, RxSwift, Clean Architecture. App Store and GitHub links.
- `apprevshare-ios-sdk`: Flagship. Passive StoreKit 2 revenue attribution SDK. Swift Package, StoreKit 2, networking. Client paused further SDK work.
- `devicecluster`: Flagship. iOS + Rust proximity/P2P PoC. SwiftUI, Nearby Interaction, MPC, Rust, H3.
- `airbafresh`: Flagship. Production grocery delivery iOS app. UIKit, RxSwift, Moya, Firebase.
- `hashtaggenerator`: Production. SwiftUI creator tool using text/image AI API hashtag generation, StoreKit 2 credit packs, SwiftData history, and Keychain-backed credits. This is the main public proof for AI API integration in native iOS without claiming custom ML/model training.
- `kex`: Production. Multi-brand food delivery iOS app rebuilt mid-project. UIKit, RxSwift, Moya, MVVM-C.
- `24goals`: Production. Goal tracking app that reached Top-8 Productivity and Top-100 overall on launch. UIKit, RxSwift, StoreKit, Firebase.
- `mentalmind`: Production. Meditation/self-development iOS app rebuilt from scratch. UIKit, StoreKit, AVFoundation, RxSwift.
- `istokhome`: Backend. Django/DRF marketplace backend for interior designers and home services. Celery, CloudPayments.
- `uniclub`: Backend. iOS app plus Django backend for children's class booking. UIKit, Alamofire, Django, Celery.
- `kaz-tour-telegram-bot`: Backend. Telegram lead-generation bot synced to Bitrix24. Python, Django, Telegram API, SpeechKit.
- `mig`: Legacy. Currency exchange app redesign and reservation features. UIKit, Alamofire, Firebase.
- `magazinchik`: Legacy. 15-minute grocery delivery app concept. UIKit, RxSwift, Alamofire, Yandex Maps.
- `swiftnetworkrouting`: Legacy. Lightweight Swift networking library on Alamofire. Open-source.
- `driver-drowsiness-detection`: AI. YOLOv5 drowsiness/yawn/closed-eye detection with Flask/Docker demo.
- `disaster-tweets`: AI. NLP classifier for disaster-related tweets. Python, TF-IDF, GRU, Django.
- `asl-recognition`: AI. Computer vision pipeline for ASL hand sign detection/classification.

## Additional Client Project Knowledge Captured From Notes

These projects were supplied in detailed notes/conversation summaries and may be used for future case studies or private summaries. Do not include credentials, passwords, SSH details, or private client access information in portfolio copy.

### MountainXperience Tracking

- Client: Simon Pearce / MountainXperience.
- Product: iOS/Android mountain tracking app with Firebase backend and Ordnance Survey map support.
- Key iOS stack: SwiftUI, Firebase, Google Maps SDK, Ordnance Survey raster tiles, Lottie, SnapKit.
- Key Android stack: Kotlin, Jetpack Compose, Material 3, Hilt, StateFlow/MVVM, Firebase, Google Maps Compose, WorkManager, foreground location service.
- Backend: Firebase Cloud Functions v2, TypeScript, Node.js 24, `europe-west3`.
- Important feature work:
  - OS Leisure maps could not be plugged directly into Google tile overlays because Leisure tiles are British National Grid EPSG:27700, while Google overlays use Web Mercator EPSG:3857.
  - Workaround implemented by fetching OS ZXY tiles, caching on disk, reprojecting BNG to Web Mercator, and using fallback behavior.
  - Tracking session fields include `stoppedAt`, `stoppedAtServer`, and `lateMarkedAt` with distinct semantics.
  - Active/late/stopped sessions shown live; stopped sessions remain as grey pins for 60 minutes.
  - Position updates throttled to 5 minutes with buffering and background/significant-location resilience.
  - Backend sends notifications and late-back emails using OS grid references.
- Operational notes:
  - Secrets/signing files must stay local and out of commits.
  - Functions repo has strongest automated tests; iOS/Android rely more on manual/device testing.

### Kalyan Studio Apps

- Client: Aryan Prasad / Kalyan Studio Apps.
- Product: Multi-target native iOS music practice/accompaniment app for Indian classical dance/music.
- Targets:
  - Lehra Studio Pro
  - Kathak Studio
  - Lehra Studio Sarangi
  - Lehra Studio Ultimate
- Stack: Objective-C, Objective-C++, C++, one Swift StoreKit bridge, UIKit storyboards, TheAmazingAudioEngine, custom C++ DSP/time-stretching, Firebase Analytics, legacy Flurry startup.
- Core monetization work:
  - Migrated from StoreKit 1/deprecated receipt-style logic to StoreKit 2.
  - Added `AIStoreKit2Bridge.swift` and centralized purchase/restore/entitlement handling in `AIIapManager`.
  - Added legacy paid-app unlock logic using StoreKit 2 `AppTransaction.originalPurchaseDate` for users who bought the app before it moved from paid to free with a non-consumable IAP.
  - Important caveat: `originalAppVersion` on iOS is not reliable for marketing version comparison; original purchase date was the chosen path.
  - Sandbox/TestFlight original purchase date behavior is limited, so real production validation was needed with legacy users.
- Other work:
  - Cleaned and reorganized a large legacy repo into clearer `Source`, `Audio`, `Core`, `Targets`, `Config`, `ThirdParty`, and `Tests` areas.
  - Added data-driven color metadata for instruments, taals, and raags via plist keys.
  - Added Firebase Analytics for instrument, taal, raag, playback start/stop, BPM, duration, and stop reason.
  - Documented safe audio-library replacement workflow through Finder/Xcode and `data_pro.plist`.
- Operational notes:
  - Audio asset/library updates require exact file names unless plist file-name references are updated.
  - Icon size notes were user reference only and should not be imported as portfolio content.

### Blackville

- Client: Julian Reefer / Blackville.
- Product: Black-owned marketplace iOS app plus backend.
- Repos:
  - `Blackville-backend`: CodeIgniter/PHP backend with MySQL schema, buyer/vendor/admin APIs, Stripe, admin/vendor panels.
  - `blackville-iOS`: Swift/UIKit buyer app.
- Backend stack: CodeIgniter 3.1.5, MySQL, Composer, `stripe/stripe-php`, PHPMailer, PayPal payout SDK.
- iOS stack: Swift 5, UIKit, CocoaPods, Alamofire, SnapKit, SDWebImage, Stripe PaymentSheet/Apple Pay, Firebase Messaging/Analytics, Google Sign-In, Facebook SDK, IQKeyboardManagerSwift, SkeletonView.
- Major work:
  - Reviewed launch readiness, stability risks, recurring bugs, Stripe/Apple Pay feasibility, and soft-launch strategy.
  - Fixed category crash/state issues, product-not-found persistence, hidden beta-only features, product/store image scaling, Kulture Wall image fallback/variant issues, and admin product image attribution.
  - Integrated Firebase Crashlytics.
  - Set up TestFlight external testing and later App Store submission.
  - Added Sign in with Apple and removed confusing phone/referral fields.
  - Rebuilt checkout around server-side Stripe PaymentIntent creation, Stripe PaymentSheet, Apple Pay, address selection, order confirmation, and webhook recovery.
  - Added order emails for admin/customer and fixed `My Orders`, delivery address visibility, order details, price mismatch, and checkout security gaps.
  - Added expandable product images and improved order UX.
  - Created deployment/local schema documentation and cleanup/refactor points.
- Security incident:
  - A malicious Xcode build phase was discovered in the iOS project, apparently introduced by a previous freelancer.
  - It decoded and executed remote `curl | sh` style payloads during Xcode builds.
  - Treat this as an incident in any future write-up. Do not include secret values.
  - Recommended actions included revoking old TestFlight builds, rebuilding from a clean machine, rotating project secrets, and treating affected builds as untrusted.
- Operational notes:
  - Weekly cap later reduced to 10 hours/week.
  - Focus priorities after launch were checkout/payments/order fulfillment UX before broader security/architecture cleanup.

## Testing And QA

Use these routinely:

- `npm run test:content`
- `npm run build`
- `npm run test:interaction`
- `npm run test:visual`
- `npm test`

Update visual baselines only when intentional:

- `npm run test:visual:update`

Important checks already covered:

- no horizontal overflow at mobile/tablet widths,
- non-AI project content must define at least one renderable visual path,
- mobile nav open/close/link-close/keyboard behavior,
- project banner lightbox keyboard behavior,
- reduced motion disables parallax,
- visual snapshots for homepage and representative project pages.

## Commit And Workflow Rules

- Use commit prefixes from `AGENTS.md`:
  - `feat: `
  - `refactor: `
  - `fix: `
- Automatically update this file when new durable knowledge appears, including source-of-truth decisions, design/product decisions, asset/content conventions, project/client technical summaries, and testing/workflow expectations.
- Do not wait for the user to explicitly ask for documentation updates when knowledge should carry into future chats.
- If adding workflow rules or future-session guidance, update `AGENTS.md`.
- Keep commits focused and split by intent.
- Do not commit credentials, local signing files, private keys, or client passwords.
