import type { CollectionEntry } from 'astro:content';
import type { ProjectCategory } from '../data/project-taxonomy';
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

function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase();
}

function countSharedTags(a: readonly string[], b: readonly string[]): number {
  const normalizedA = new Set(a.map(normalizeTag));
  return b.reduce((count, tag) => count + (normalizedA.has(normalizeTag(tag)) ? 1 : 0), 0);
}

function scoreRelatedProject(currentProject: ProjectEntry, candidateProject: ProjectEntry): number {
  const categoryScore = currentProject.data.category === candidateProject.data.category ? 8 : 0;
  const typeTagScore = countSharedTags(currentProject.data.typeTags, candidateProject.data.typeTags) * 3;
  const techTagScore = countSharedTags(currentProject.data.techTags, candidateProject.data.techTags);

  return categoryScore + typeTagScore + techTagScore;
}

export function selectRelatedProjects(
  currentProject: ProjectEntry,
  projects: readonly ProjectEntry[],
  limit = 3,
): ProjectEntry[] {
  const scoredProjects = projects
    .filter((project) => project.slug !== currentProject.slug)
    .map((project) => ({
      project,
      score: scoreRelatedProject(currentProject, project),
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.project.data.priority !== b.project.data.priority) {
        return a.project.data.priority - b.project.data.priority;
      }
      return a.project.data.title.localeCompare(b.project.data.title);
    });

  const relatedProjects = scoredProjects.filter(({ score }) => score > 0);
  const candidates = relatedProjects.length > 0 ? relatedProjects : scoredProjects;

  return candidates.slice(0, limit).map(({ project }) => project);
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
