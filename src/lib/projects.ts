import type { CollectionEntry } from 'astro:content';
import type { ProjectCategory } from '../data/site';
import { isRenderableMediaRef } from './media';

export type ProjectEntry = CollectionEntry<'projects'>;

export interface ProjectSectionLike {
  category: ProjectCategory;
}

export function indexProjectsBySlug(projects: readonly ProjectEntry[]): Map<string, ProjectEntry> {
  return new Map(projects.map((project) => [project.slug, project]));
}

export function selectProjectsBySlug(
  projectsBySlug: ReadonlyMap<string, ProjectEntry>,
  slugs: readonly string[],
): ProjectEntry[] {
  return slugs
    .map((slug) => projectsBySlug.get(slug))
    .filter((project): project is ProjectEntry => Boolean(project));
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

export function groupProjectsByArchiveSection(
  projects: readonly ProjectEntry[],
  sections: readonly ProjectSectionLike[],
  excludedSlugs: ReadonlySet<string>,
): Record<ProjectCategory, ProjectEntry[]> {
  const grouped = {} as Partial<Record<ProjectCategory, ProjectEntry[]>>;

  for (const section of sections) {
    grouped[section.category] = projects.filter(
      (project) => project.data.category === section.category && !excludedSlugs.has(project.slug),
    );
  }

  return grouped as Record<ProjectCategory, ProjectEntry[]>;
}

export function selectProjectCardImage(project: ProjectEntry): string | null {
  const candidate =
    project.data.thumbnail || project.data.image || project.data.screenshots?.[0] || null;

  return isRenderableMediaRef(candidate) ? candidate : null;
}

export function selectProjectMediaBanner(project: ProjectEntry): string | null {
  return selectProjectMediaBanners(project)[0] ?? null;
}

export function selectProjectMediaBanners(project: ProjectEntry): string[] {
  if (!project.data.showMediaBanner) {
    return [];
  }

  const candidates =
    project.data.banners && project.data.banners.length > 0
      ? project.data.banners
      : [project.data.image || project.data.thumbnail];

  return candidates.filter((candidate): candidate is string => isRenderableMediaRef(candidate));
}

export function shouldRenderProjectMedia(project: ProjectEntry): boolean {
  return selectProjectMediaBanners(project).length > 0;
}

export function shouldRenderProjectLinks(project: ProjectEntry): boolean {
  return project.data.links.length > 0;
}
