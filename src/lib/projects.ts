import type { CollectionEntry } from 'astro:content';
import type { ProjectCategory } from '../data/site';

export type ProjectEntry = CollectionEntry<'projects'>;

export interface ProjectSectionLike {
  category: ProjectCategory;
}

export function sortProjectsByPriority(projects: readonly ProjectEntry[]): ProjectEntry[] {
  return [...projects].sort((a, b) => a.data.priority - b.data.priority);
}

export function groupProjectsByHomepageSection(
  projects: readonly ProjectEntry[],
  sections: readonly ProjectSectionLike[],
): Record<ProjectCategory, ProjectEntry[]> {
  const grouped = {} as Partial<Record<ProjectCategory, ProjectEntry[]>>;

  for (const section of sections) {
    grouped[section.category] = projects.filter((project) => project.data.category === section.category);
  }

  return grouped as Record<ProjectCategory, ProjectEntry[]>;
}

export function selectProjectCardImage(project: ProjectEntry): string | null {
  return project.data.thumbnail || project.data.image || project.data.screenshots?.[0] || null;
}

export function selectProjectMediaBanner(project: ProjectEntry): string | null {
  const banners = project.data.wix?.banners ?? [];

  if (banners.length === 0) {
    return null;
  }

  return project.data.image || project.data.thumbnail || null;
}

export function shouldRenderProjectMedia(project: ProjectEntry): boolean {
  return selectProjectMediaBanner(project) !== null;
}

export function shouldRenderProjectLinks(project: ProjectEntry): boolean {
  return project.data.links.length > 0;
}
