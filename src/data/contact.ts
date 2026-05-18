import { siteContact } from './site';

export const contactLinks = [
  {
    type: 'Email',
    label: siteContact.email,
    url: `mailto:${siteContact.email}`,
  },
  {
    type: 'LinkedIn',
    label: siteContact.linkedin.label,
    url: siteContact.linkedin.url,
  },
];
