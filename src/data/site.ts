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
  name: siteOwner.portfolioName,
  role: siteOwner.role,
  label: 'Portfolio',
  bannerAlt: 'Portfolio banner',
};

export const homepageSections: Array<{
  id: string;
  category: ProjectCategory;
  title: string;
  navLabel: string;
}> = [
  {
    id: 'recent',
    category: 'Recent',
    title: 'Recent Client Work',
    navLabel: 'Recent Client Work',
  },
  {
    id: 'flagship',
    category: 'Flagship',
    title: 'Flagship Engineering',
    navLabel: 'Flagship Engineering',
  },
  {
    id: 'production',
    category: 'Production',
    title: 'iOS Apps & Product Builds',
    navLabel: 'iOS Apps',
  },
  {
    id: 'backend',
    category: 'Backend',
    title: 'Platforms & Backend',
    navLabel: 'Platforms & backend',
  },
  {
    id: 'legacy',
    category: 'Legacy',
    title: 'Legacy & Libraries',
    navLabel: 'Legacy & Libraries',
  },
  {
    id: 'ai',
    category: 'AI',
    title: 'AI & ML Experiments',
    navLabel: 'AI & ML',
  },
];

export const headerNavItems = [
  ...homepageSections.map((section) => ({
    label: section.navLabel,
    href: `/#${section.id}`,
  })),
  { label: 'Contact', href: '/#contact' },
];

export const siteMeta = {
  defaultTitle: 'Daniyar Kurmanbayev | Portfolio',
  defaultDescription: 'Daniyar Kurmanbayev portfolio.',
  siteName: siteOwner.displayName,
  themeColor: '#1E2A38',
};
