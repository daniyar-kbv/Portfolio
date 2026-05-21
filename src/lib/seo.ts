import type { CollectionEntry } from 'astro:content';
import { siteAssets } from '../data/assets';
import { siteContact, siteOwner } from '../data/identity';

export type JsonLdNode = Record<string, unknown>;
type ProjectEntry = CollectionEntry<'projects'>;

type HomepageStructuredDataInput = {
  pageUrl?: string;
  pageImageUrl?: string;
  profileImageUrl?: string;
};

type ProjectStructuredDataInput = {
  project: ProjectEntry;
  pageUrl?: string;
  imageUrl?: string;
  siteUrl?: string;
};

export function absoluteUrl(pathOrUrl: string | undefined, site: URL | undefined): string | undefined {
  if (!pathOrUrl) return undefined;

  try {
    return new URL(pathOrUrl).toString();
  } catch {
    return site ? new URL(pathOrUrl, site).toString() : pathOrUrl;
  }
}

export function formatProjectSeoTitle(project: ProjectEntry): string {
  return `${project.data.title} Case Study | ${project.data.subtitle} | ${siteOwner.publicName}`;
}

function personNode(pageUrl?: string, imageUrl?: string): JsonLdNode {
  const personId = pageUrl ? `${pageUrl}#person` : '#person';

  return {
    '@type': 'Person',
    '@id': personId,
    name: siteOwner.legalName,
    alternateName: siteOwner.publicName,
    jobTitle: siteOwner.role,
    url: pageUrl,
    image: imageUrl,
    email: `mailto:${siteContact.email}`,
    sameAs: [siteContact.linkedin.url],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Toronto',
      addressCountry: 'CA',
    },
  };
}

export function buildHomepageStructuredData({
  pageUrl,
  pageImageUrl,
  profileImageUrl,
}: HomepageStructuredDataInput): JsonLdNode[] {
  const personId = pageUrl ? `${pageUrl}#person` : '#person';
  const websiteId = pageUrl ? `${pageUrl}#website` : '#website';
  const profilePageId = pageUrl ? `${pageUrl}#profile` : '#profile';

  return [
    personNode(pageUrl, profileImageUrl),
    {
      '@type': 'WebSite',
      '@id': websiteId,
      name: `${siteOwner.publicName} Portfolio`,
      url: pageUrl,
      publisher: { '@id': personId },
    },
    {
      '@type': 'ProfilePage',
      '@id': profilePageId,
      name: `${siteOwner.publicName} Portfolio`,
      url: pageUrl,
      isPartOf: { '@id': websiteId },
      about: { '@id': personId },
      mainEntity: { '@id': personId },
      primaryImageOfPage: pageImageUrl
        ? {
            '@type': 'ImageObject',
            url: pageImageUrl,
            width: siteAssets.seoImageWidth,
            height: siteAssets.seoImageHeight,
          }
        : undefined,
    },
  ];
}

export function buildProjectStructuredData({
  project,
  pageUrl,
  imageUrl,
  siteUrl,
}: ProjectStructuredDataInput): JsonLdNode[] {
  const projectTitle = formatProjectSeoTitle(project);
  const person = personNode(siteUrl, absoluteUrl(siteAssets.profilePortrait, siteUrl ? new URL(siteUrl) : undefined));
  const personId = typeof person['@id'] === 'string' ? person['@id'] : '#person';
  const projectId = pageUrl ? `${pageUrl}#case-study` : `#${project.slug}-case-study`;
  const breadcrumbId = pageUrl ? `${pageUrl}#breadcrumb` : `#${project.slug}-breadcrumb`;
  const keywords = [...project.data.typeTags, ...project.data.techTags].join(', ');

  return [
    person,
    {
      '@type': 'CreativeWork',
      '@id': projectId,
      name: project.data.title,
      headline: projectTitle,
      description: project.data.description,
      url: pageUrl,
      image: imageUrl,
      author: { '@id': personId },
      creator: { '@id': personId },
      keywords,
      about: project.data.subtitle,
      genre: project.data.category,
    },
    {
      '@type': 'BreadcrumbList',
      '@id': breadcrumbId,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Portfolio',
          item: siteUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: project.data.title,
          item: pageUrl,
        },
      ],
    },
  ];
}
