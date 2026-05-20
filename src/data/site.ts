export const projectCategories = ['Recent', 'Flagship', 'Production', 'Backend', 'Legacy', 'AI'] as const;

export type ProjectCategory = (typeof projectCategories)[number];

export const siteOwner = {
  displayName: 'Daniyar Kurmanbayev',
  portfolioName: 'Daniyar Kurmanbayev (Dan Kurman)',
  role: 'Senior iOS Developer / Technical PM',
  location: 'Toronto, Canada',
};

export const siteContact = {
  email: 'daniyar.kbv@gmail.com',
  linkedin: {
    label: 'daniyar-kbv',
    url: 'https://www.linkedin.com/in/daniyar-kbv/',
  },
};

export const siteAssets = {
  heroImage: '/assets/hero/banner-apps.jpg',
  seoImage: '/assets/seo/seo-image.png',
  logo: '/assets/logo/logo-horizontal.png',
  icons: {
    contact: '/assets/icons/contact-icon.png',
    linkedin: '/assets/icons/linkedin-icon.png',
  },
};

export const homepageMeta = {
  title: 'Portfolio | Daniyar Kurmanbayev (Dan Kurman)',
  description:
    'Daniyar Kurmanbayev (Dan Kurman), Senior iOS Developer & Technical Product Manager. I build Swift/SwiftUI apps with clean architecture, strong UX, and reliable delivery. View projects and case studies.',
  ogImageAlt: 'Portfolio SEO image',
};

export const homepageHero = {
  label: 'Dan Kurman · Senior iOS specialist',
  headline: 'I help founders ship, stabilize, and modernize iOS apps.',
  supporting:
    'I turn inherited codebases, payment flows, release blockers, and product ideas into reliable App Store-ready software.',
  secondaryIdentity: siteOwner.displayName,
  bannerAlt: 'Portfolio banner',
  ctas: [
    {
      label: 'Contact me',
      href: '#contact',
      variant: 'primary' as const,
    },
    {
      label: 'View selected work',
      href: '#selected-work',
      variant: 'secondary' as const,
    },
  ],
};

export const homepagePositioning = {
  role: siteOwner.role,
  summary:
    'Senior iOS developer for product teams and founders who need production-quality app work, launch support, and calm technical judgment.',
};

export const homepageProofPoints = [
  {
    label: 'App Store launches',
    description: 'From TestFlight cleanup to App Review-ready releases.',
  },
  {
    label: 'StoreKit 2 & entitlements',
    description: 'Purchases, restores, legacy unlocks, and monetization fixes.',
  },
  {
    label: 'Stripe / Apple Pay checkout',
    description: 'PaymentSheet, server-side intents, address flows, and order recovery.',
  },
  {
    label: 'Legacy codebase stabilization',
    description: 'Inherited apps, crash fixes, release blockers, and safer architecture.',
  },
];

export const serviceAreas = [
  {
    title: 'Launch readiness & stabilization',
    description:
      'Audit the risky parts, fix blockers, add monitoring, and get the app ready for real users.',
  },
  {
    title: 'iOS app builds from design to release',
    description:
      'Implement polished SwiftUI/UIKit experiences, wire APIs, handle QA, and support App Store submission.',
  },
  {
    title: 'Payments, StoreKit & entitlements',
    description:
      'Build and debug IAP, subscriptions, legacy access, Stripe checkout, Apple Pay, and restore flows.',
  },
  {
    title: 'Legacy app rescue & architecture cleanup',
    description:
      'Untangle older projects, reduce fragile logic, remove dead flows, and make future changes safer.',
  },
  {
    title: 'Mobile + backend integration',
    description:
      'Connect apps to Firebase, PHP, Django, APIs, notifications, analytics, and release infrastructure.',
  },
];

export const featuredProofSlugs = [
  'blackville',
  'mountainxperience-tracking',
  'kalyan-studio-apps',
] as const;

export const compactProofSlugs = [
  'end-of-day',
  'stop-overthinking',
  'snowdon-summit-weather',
] as const;

export const projectOutcomeCopy: Record<string, string> = {
  blackville:
    'Stabilized an inherited marketplace, rebuilt checkout around Stripe and Apple Pay, and helped get real orders flowing after App Store launch.',
  'mountainxperience-tracking':
    'Built iOS, Android, and Firebase safety tracking with background location, late-back alerts, OS map layers, and release support.',
  'kalyan-studio-apps':
    'Migrated a multi-target audio app suite to StoreKit 2 and restored lifetime access for legacy paid users after a freemium transition.',
  'end-of-day':
    'Built a focused SwiftUI journaling app from Figma to App Store with StoreKit 2 unlock and release support.',
  'stop-overthinking':
    'Implemented a private SwiftUI journaling app with SwiftData, CloudKit sync, StoreKit 2, and App Store-ready polish.',
  'snowdon-summit-weather':
    'Rebuilt a broken weather utility as native iOS and Android apps with cleaner release-ready user flows.',
};

export const archiveSections: Array<{
  id: string;
  category: ProjectCategory;
  title: string;
  description: string;
}> = [
  {
    id: 'flagship',
    category: 'Flagship',
    title: 'Flagship Engineering',
    description: 'Deeper iOS systems, SDK work, and product-engineering builds.',
  },
  {
    id: 'production',
    category: 'Production',
    title: 'iOS Apps & Product Builds',
    description: 'Production apps shipped across commerce, productivity, creator tools, and wellness.',
  },
  {
    id: 'backend',
    category: 'Backend',
    title: 'Platforms & Backend',
    description: 'Mobile-connected backend systems, marketplaces, and automation tools.',
  },
  {
    id: 'legacy',
    category: 'Legacy',
    title: 'Legacy & Libraries',
    description: 'Older app work and reusable libraries that show breadth over time.',
  },
  {
    id: 'ai',
    category: 'AI',
    title: 'AI & ML Experiments',
    description: 'Computer vision and NLP experiments from applied ML coursework and prototypes.',
  },
];

export const headerNavItems = [
  { label: 'Services', href: '/#services' },
  { label: 'Selected work', href: '/#selected-work' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Contact', href: '/#contact' },
];

export const siteMeta = {
  defaultTitle: 'Daniyar Kurmanbayev | Portfolio',
  defaultDescription: 'Daniyar Kurmanbayev portfolio.',
  siteName: siteOwner.displayName,
  themeColor: '#1E2A38',
};
