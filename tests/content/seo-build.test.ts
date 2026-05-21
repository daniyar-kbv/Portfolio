import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const distDir = path.join(repoRoot, 'dist');
const projectsDistDir = path.join(distDir, 'projects');
const failures: string[] = [];

function addFailure(scope: string, message: string) {
  failures.push(`${scope}: ${message}`);
}

async function readBuiltHtml(scope: string, relativePath: string): Promise<string> {
  try {
    return await readFile(path.join(distDir, relativePath), 'utf8');
  } catch (error) {
    addFailure(scope, `unable to read ${relativePath}: ${error instanceof Error ? error.message : String(error)}`);
    return '';
  }
}

function expectIncludes(scope: string, html: string, expected: string, message: string) {
  if (!html.includes(expected)) {
    addFailure(scope, message);
  }
}

function parseJsonLd(scope: string, html: string): Array<Record<string, unknown>> {
  const scripts = Array.from(html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g));

  if (scripts.length === 0) {
    addFailure(scope, 'missing application/ld+json script');
    return [];
  }

  const nodes: Array<Record<string, unknown>> = [];

  for (const [, source] of scripts) {
    try {
      const parsed = JSON.parse(source);
      const graph = Array.isArray(parsed['@graph']) ? parsed['@graph'] : [parsed];
      nodes.push(...graph.filter((node: unknown): node is Record<string, unknown> => Boolean(node)));
    } catch (error) {
      addFailure(scope, `invalid JSON-LD: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return nodes;
}

function hasJsonLdType(nodes: Array<Record<string, unknown>>, type: string): boolean {
  return nodes.some((node) => node['@type'] === type);
}

function assertHomepageSeo(html: string) {
  const scope = 'dist/index.html';
  expectIncludes(
    scope,
    html,
    '<title>Dan Kurman | Senior iOS Developer for Native &amp; AI Apps</title>',
    'homepage title template is missing',
  );
  expectIncludes(
    scope,
    html,
    'Senior native iOS developer building Swift/SwiftUI apps, AI-powered features, StoreKit monetization, Stripe/Apple Pay checkout, and App Store-ready releases.',
    'homepage meta description is missing',
  );
  expectIncludes(scope, html, '<link rel="canonical" href="http://localhost:4321/">', 'homepage canonical is missing');
  expectIncludes(scope, html, 'href="/assets/favicon/favicon-32.png" type="image/png" sizes="32x32"', '32px favicon link is missing');
  expectIncludes(scope, html, 'href="/assets/favicon/favicon-96.png" type="image/png" sizes="96x96"', '96px favicon link is missing');
  expectIncludes(scope, html, 'href="/assets/favicon/apple-touch-icon.png" sizes="180x180"', 'Apple touch icon link is missing');
  expectIncludes(scope, html, 'property="og:image:width" content="2098"', 'Open Graph image width is missing');
  expectIncludes(scope, html, 'property="og:image:height" content="1986"', 'Open Graph image height is missing');
  expectIncludes(scope, html, 'property="og:image:type" content="image/png"', 'Open Graph image type is missing');

  const nodes = parseJsonLd(scope, html);
  for (const type of ['Person', 'ProfilePage', 'WebSite']) {
    if (!hasJsonLdType(nodes, type)) {
      addFailure(scope, `JSON-LD graph is missing ${type}`);
    }
  }
}

function assertProjectSeo(html: string) {
  const scope = 'dist/projects/blackville/index.html';
  expectIncludes(
    scope,
    html,
    '<title>Blackville Case Study | iOS Marketplace · Stripe | Dan Kurman</title>',
    'project title template is missing',
  );
  expectIncludes(
    scope,
    html,
    '<link rel="canonical" href="http://localhost:4321/projects/blackville">',
    'project canonical is missing',
  );

  const nodes = parseJsonLd(scope, html);
  for (const type of ['CreativeWork', 'BreadcrumbList']) {
    if (!hasJsonLdType(nodes, type)) {
      addFailure(scope, `JSON-LD graph is missing ${type}`);
    }
  }
}

async function assertRelatedLinks() {
  const entries = await readdir(projectsDistDir, { withFileTypes: true });
  const projectSlugs = new Set(entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name));

  for (const slug of projectSlugs) {
    const scope = `dist/projects/${slug}/index.html`;
    const html = await readBuiltHtml(scope, `projects/${slug}/index.html`);
    const relatedSection = html.match(/Related case studies([\s\S]*?)project-contact-section/);

    if (!relatedSection) {
      addFailure(scope, 'missing Related case studies section before the project contact CTA');
      continue;
    }

    const relatedLinks = Array.from(relatedSection[1].matchAll(/href="\/projects\/([^"]+)"/g)).map((match) => match[1]);

    if (relatedLinks.length === 0) {
      addFailure(scope, 'Related case studies section has no project links');
    }

    for (const relatedSlug of relatedLinks) {
      if (relatedSlug === slug) {
        addFailure(scope, 'Related case studies must not link to the current project');
      }

      if (!projectSlugs.has(relatedSlug)) {
        addFailure(scope, `Related case studies points to an unknown project route: ${relatedSlug}`);
      }
    }
  }
}

const homepageHtml = await readBuiltHtml('dist/index.html', 'index.html');
assertHomepageSeo(homepageHtml);

const blackvilleHtml = await readBuiltHtml('dist/projects/blackville/index.html', 'projects/blackville/index.html');
assertProjectSeo(blackvilleHtml);
await assertRelatedLinks();

if (failures.length > 0) {
  console.error('SEO build check failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('SEO build checks passed.');
