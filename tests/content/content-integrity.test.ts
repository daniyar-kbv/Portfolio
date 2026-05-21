import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { siteAssets } from '../../src/data/assets';
import { projectCategories } from '../../src/data/project-taxonomy';

type ProjectFrontmatter = {
  priority?: unknown;
  category?: unknown;
  thumbnail?: unknown;
  image?: unknown;
  media?: unknown;
  screenshots?: unknown;
  showMediaBanner?: unknown;
  links?: unknown;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const projectsDir = path.join(repoRoot, 'src/content/projects');
const localAssetsFile = path.join(repoRoot, 'src/data/local-assets.json');
const publicDir = path.join(repoRoot, 'public');
const rawWixMediaPattern = /wix:(image|video):\/\//;

const failures: string[] = [];

function addFailure(scope: string, message: string) {
  failures.push(`${scope}: ${message}`);
}

async function readProjectFiles(): Promise<string[]> {
  const entries = await readdir(projectsDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.mdx'))
    .map((entry) => path.join(projectsDir, entry.name))
    .sort();
}

function parseFrontmatter(filePath: string, source: string): ProjectFrontmatter | null {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    addFailure(path.relative(repoRoot, filePath), 'missing JSON frontmatter fence');
    return null;
  }

  try {
    return JSON.parse(match[1]) as ProjectFrontmatter;
  } catch (error) {
    addFailure(
      path.relative(repoRoot, filePath),
      `invalid JSON frontmatter: ${error instanceof Error ? error.message : String(error)}`
    );
    return null;
  }
}

function publicPathExists(value: string): boolean {
  const publicPath = path.join(publicDir, value.replace(/^\//, ''));
  return existsSync(publicPath);
}

function validateRenderFacingPath(scope: string, field: string, value: unknown) {
  if (typeof value !== 'string') {
    addFailure(scope, `${field} must be a string`);
    return;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    addFailure(scope, `${field} must not be empty`);
    return;
  }

  if (rawWixMediaPattern.test(trimmed)) {
    addFailure(scope, `${field} contains a raw Wix media ref`);
  }

  if (trimmed.startsWith('/') && !publicPathExists(trimmed)) {
    addFailure(scope, `${field} points to missing public file: ${trimmed}`);
  }
}

function validateOptionalRenderFacingPath(scope: string, field: string, value: unknown) {
  if (value === undefined || value === null) return;
  validateRenderFacingPath(scope, field, value);
}

function validateRenderFacingPathArray(scope: string, field: string, values: unknown) {
  if (values === undefined || values === null) return;
  if (!Array.isArray(values)) {
    addFailure(scope, `${field} must be an array`);
    return;
  }

  values.forEach((value, index) => validateRenderFacingPath(scope, `${field}[${index}]`, value));
}

function hasRenderableProjectVisual(data: ProjectFrontmatter): boolean {
  const screenshotCandidates = Array.isArray(data.screenshots) ? data.screenshots : [];
  const candidates = [data.thumbnail, data.image, ...screenshotCandidates];

  return candidates.some((candidate) => {
    if (typeof candidate !== 'string') return false;

    const trimmed = candidate.trim();
    if (!trimmed || rawWixMediaPattern.test(trimmed)) return false;

    return !trimmed.startsWith('/') || publicPathExists(trimmed);
  });
}

function validateLink(scope: string, link: unknown, index: number) {
  const candidate = link && typeof link === 'object' ? (link as Record<string, unknown>) : {};
  const label = typeof candidate.label === 'string' ? candidate.label.trim() : '';
  const url = typeof candidate.url === 'string' ? candidate.url.trim() : '';

  if (!label) {
    addFailure(scope, `links[${index}].label must not be empty`);
  }

  if (!url) {
    addFailure(scope, `links[${index}].url must not be empty`);
    return;
  }

  try {
    const parsed = new URL(url);
    if (!['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
      addFailure(scope, `links[${index}].url has unsupported scheme: ${url}`);
    }
  } catch {
    addFailure(scope, `links[${index}].url is not a valid URL/mailto: ${url}`);
  }
}

function collectAssetPaths(value: unknown, paths: string[] = []): string[] {
  if (typeof value === 'string') {
    if (value.startsWith('/assets/')) {
      paths.push(value);
    }
    return paths;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectAssetPaths(item, paths));
    return paths;
  }

  if (value && typeof value === 'object') {
    Object.values(value).forEach((item) => collectAssetPaths(item, paths));
  }

  return paths;
}

const localAssets = JSON.parse(await readFile(localAssetsFile, 'utf8')) as { shared?: unknown };
const validCategories = new Set<string>(projectCategories);
const priorityOwners = new Map<number, string>();
const projectFiles = await readProjectFiles();
const projects: Array<{ scope: string; data: ProjectFrontmatter }> = [];

for (const filePath of projectFiles) {
  const source = await readFile(filePath, 'utf8');
  const data = parseFrontmatter(filePath, source);
  if (!data) continue;

  const scope = `src/content/projects/${path.basename(filePath)}`;
  projects.push({ scope, data });

  if (typeof data.priority !== 'number') {
    addFailure(scope, 'priority must be a number');
  } else if (priorityOwners.has(data.priority)) {
    addFailure(scope, `priority ${data.priority} duplicates ${priorityOwners.get(data.priority)}`);
  } else {
    priorityOwners.set(data.priority, scope);
  }

  const category = typeof data.category === 'string' ? data.category : '';
  if (!category) {
    addFailure(scope, 'category must be a string');
  } else if (!validCategories.has(category)) {
    addFailure(scope, `category "${category}" is not one of: ${Array.from(validCategories).join(', ')}`);
  }

  validateOptionalRenderFacingPath(scope, 'thumbnail', data.thumbnail);
  validateOptionalRenderFacingPath(scope, 'image', data.image);
  validateRenderFacingPathArray(scope, 'media', data.media);
  validateRenderFacingPathArray(scope, 'screenshots', data.screenshots);

  if (data.showMediaBanner && !data.image && !data.thumbnail) {
    addFailure(scope, 'showMediaBanner is true but neither image nor thumbnail is set');
  }

  if (category !== 'AI' && !hasRenderableProjectVisual(data)) {
    addFailure(scope, 'non-AI projects must define at least one renderable thumbnail, image, or screenshot');
  }

  if (!Array.isArray(data.links)) {
    addFailure(scope, 'links must be an array');
  } else {
    data.links.forEach((link, index) => validateLink(scope, link, index));
  }
}

if (projects.length === 0) {
  addFailure('src/content/projects', 'no project MDX files found');
}

for (const [index, assetPath] of collectAssetPaths(localAssets.shared).entries()) {
  validateRenderFacingPath('src/data/local-assets.json', `shared asset ${index}`, assetPath);
}

for (const [index, assetPath] of collectAssetPaths(siteAssets).entries()) {
  validateRenderFacingPath('src/data/assets.ts', `site asset ${index}`, assetPath);
}

if (failures.length > 0) {
  console.error('Content integrity check failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Content integrity checks passed for ${projects.length} projects.`);
