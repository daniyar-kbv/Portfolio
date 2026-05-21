export const projectCategories = ['Recent', 'Flagship', 'Production', 'Backend', 'Legacy', 'AI'] as const;

export type ProjectCategory = (typeof projectCategories)[number];

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
