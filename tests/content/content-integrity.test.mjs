import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const projectsDir = path.join(repoRoot, 'src/content/projects');
const siteDataFile = path.join(repoRoot, 'src/data/site.ts');
const localAssetsFile = path.join(repoRoot, 'src/data/local-assets.json');
const publicDir = path.join(repoRoot, 'public');
const rawWixMediaPattern = /wix:(image|video):\/\//;

const failures = [];

function addFailure(scope, message) {
  failures.push(`${scope}: ${message}`);
}

async function readProjectFiles() {
  const entries = await readdir(projectsDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.mdx'))
    .map((entry) => path.join(projectsDir, entry.name))
    .sort();
}

function parseFrontmatter(filePath, source) {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    addFailure(path.relative(repoRoot, filePath), 'missing JSON frontmatter fence');
    return null;
  }

  try {
    return JSON.parse(match[1]);
  } catch (error) {
    addFailure(path.relative(repoRoot, filePath), `invalid JSON frontmatter: ${error.message}`);
    return null;
  }
}

function readProjectCategories(source) {
  const match = source.match(/projectCategories\s*=\s*\[([\s\S]*?)\]\s+as const/);
  if (!match) {
    addFailure('src/data/site.ts', 'could not read projectCategories');
    return new Set();
  }

  return new Set(Array.from(match[1].matchAll(/'([^']+)'/g), ([, category]) => category));
}

function publicPathExists(value) {
  const publicPath = path.join(publicDir, value.replace(/^\//, ''));
  return existsSync(publicPath);
}

function validateRenderFacingPath(scope, field, value) {
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

function validateOptionalRenderFacingPath(scope, field, value) {
  if (value === undefined || value === null) return;
  validateRenderFacingPath(scope, field, value);
}

function validateRenderFacingPathArray(scope, field, values) {
  if (values === undefined || values === null) return;
  if (!Array.isArray(values)) {
    addFailure(scope, `${field} must be an array`);
    return;
  }

  values.forEach((value, index) => validateRenderFacingPath(scope, `${field}[${index}]`, value));
}

function hasRenderableProjectVisual(data) {
  const screenshotCandidates = Array.isArray(data.screenshots) ? data.screenshots : [];
  const candidates = [data.thumbnail, data.image, ...screenshotCandidates];

  return candidates.some((candidate) => {
    if (typeof candidate !== 'string') return false;

    const trimmed = candidate.trim();
    if (!trimmed || rawWixMediaPattern.test(trimmed)) return false;

    return !trimmed.startsWith('/') || publicPathExists(trimmed);
  });
}

function validateLink(scope, link, index) {
  const label = typeof link?.label === 'string' ? link.label.trim() : '';
  const url = typeof link?.url === 'string' ? link.url.trim() : '';

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

function collectStringPaths(value, paths = []) {
  if (typeof value === 'string') {
    paths.push(value);
    return paths;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectStringPaths(item, paths));
    return paths;
  }

  if (value && typeof value === 'object') {
    Object.values(value).forEach((item) => collectStringPaths(item, paths));
  }

  return paths;
}

const siteSource = await readFile(siteDataFile, 'utf8');
const localAssets = JSON.parse(await readFile(localAssetsFile, 'utf8'));
const validCategories = readProjectCategories(siteSource);
const priorityOwners = new Map();
const projectFiles = await readProjectFiles();
const projects = [];

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

  if (!validCategories.has(data.category)) {
    addFailure(scope, `category "${data.category}" is not one of: ${Array.from(validCategories).join(', ')}`);
  }

  validateOptionalRenderFacingPath(scope, 'thumbnail', data.thumbnail);
  validateOptionalRenderFacingPath(scope, 'image', data.image);
  validateRenderFacingPathArray(scope, 'media', data.media);
  validateRenderFacingPathArray(scope, 'screenshots', data.screenshots);

  if (data.showMediaBanner && !data.image && !data.thumbnail) {
    addFailure(scope, 'showMediaBanner is true but neither image nor thumbnail is set');
  }

  if (data.category !== 'AI' && !hasRenderableProjectVisual(data)) {
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

for (const [index, assetPath] of collectStringPaths(localAssets.shared).entries()) {
  validateRenderFacingPath('src/data/local-assets.json', `shared asset ${index}`, assetPath);
}

for (const [, assetPath] of siteSource.matchAll(/['"]((?:\/assets\/)[^'"]+)['"]/g)) {
  validateRenderFacingPath('src/data/site.ts', assetPath, assetPath);
}

if (failures.length > 0) {
  console.error('Content integrity check failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Content integrity checks passed for ${projects.length} projects.`);
