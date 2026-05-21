import { siteOwner } from './identity';

export const homepageMeta = {
  title: 'Portfolio | Daniyar Kurmanbayev (Dan Kurman)',
  description:
    'Dan Kurman (Daniyar Kurmanbayev), senior native iOS developer. I build reliable Swift/SwiftUI apps, AI-powered mobile features, payment flows, and App Store-ready products.',
  ogImageAlt: 'Portfolio SEO image',
};

export const homepageHero = {
  roleLabel: 'Senior native iOS developer',
  primaryName: 'Dan Kurman',
  headline: 'I build reliable native iOS apps and AI-powered mobile features.',
  supporting:
    'I turn inherited codebases, AI APIs, payment flows, backend integrations, and product ideas into polished App Store-ready software.',
  secondaryIdentity: `${siteOwner.legalName} · ${siteOwner.location}`,
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
    'Senior native iOS developer for product teams and founders who need production-quality apps, AI API integration, launch support, and calm technical judgment.',
};

export const homepageProofPoints = [
  {
    label: 'Native iOS delivery',
    description: 'SwiftUI/UIKit apps shaped from design, APIs, and product requirements.',
  },
  {
    label: 'AI API integration',
    description: 'Text, image, and assistant features with native UX and reliable app plumbing.',
  },
  {
    label: 'Payments & monetization',
    description: 'StoreKit 2, credits, paywalls, Stripe, Apple Pay, and checkout recovery.',
  },
  {
    label: 'Launch stabilization',
    description: 'Inherited apps, crash fixes, release blockers, and App Review-ready cleanup.',
  },
];

export const serviceAreas = [
  {
    title: 'Native iOS apps from design to release',
    icon: 'iphone.gen3',
    description:
      'Implement polished SwiftUI/UIKit experiences, wire APIs, handle QA, and support TestFlight or App Store submission.',
    featured: true,
  },
  {
    title: 'AI-powered mobile features',
    icon: 'wand.and.sparkles',
    description:
      'Turn AI APIs into native UX with backend proxy/API integration, persistence, usage limits, credits/paywalls, and clear failure states.',
    featured: true,
  },
  {
    title: 'Payments, StoreKit & entitlements',
    icon: 'creditcard',
    description:
      'Build and debug IAP, subscriptions, legacy access, Stripe checkout, Apple Pay, and restore flows.',
  },
  {
    title: 'Launch readiness & stabilization',
    icon: 'checkmark.seal',
    description:
      'Audit risky flows, fix blockers, add monitoring, and get the app ready for real users.',
  },
  {
    title: 'Legacy app rescue & architecture cleanup',
    icon: 'wrench.and.screwdriver',
    description:
      'Untangle older projects, reduce fragile logic, remove dead flows, and make future changes safer.',
  },
  {
    title: 'Mobile + backend integration',
    icon: 'server.rack',
    description:
      'Connect apps to Firebase, PHP, Django, APIs, notifications, analytics, and release infrastructure.',
  },
];

export const featuredProofSlugs = [
  'blackville',
  'kalyan-studio-apps',
  'hashtaggenerator',
  'mountainxperience-tracking',
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
  hashtaggenerator:
    'Built a SwiftUI AI hashtag app that turns text and image generation APIs into native UX with StoreKit 2 credit packs, SwiftData history, and Keychain-backed credits.',
  'end-of-day':
    'Built a focused SwiftUI journaling app from Figma to App Store with StoreKit 2 unlock and release support.',
  'stop-overthinking':
    'Implemented a private SwiftUI journaling app with SwiftData, CloudKit sync, StoreKit 2, and App Store-ready polish.',
  'snowdon-summit-weather':
    'Rebuilt a broken weather utility as native iOS and Android apps with cleaner release-ready user flows.',
};

export const projectOutcomeHeadlines: Record<string, string> = {
  blackville: 'Stabilized checkout and launch flow for a live marketplace.',
  'kalyan-studio-apps': 'Restored lifetime access while modernizing StoreKit.',
  hashtaggenerator: 'Turned AI generation APIs into a monetized native app.',
  'mountainxperience-tracking': 'Built safety tracking across mobile and Firebase.',
};
