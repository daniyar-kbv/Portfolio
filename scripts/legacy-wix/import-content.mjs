#!/usr/bin/env node
/**
 * Legacy migration script: generate project MDX and contact data from the Wix CSV export.
 *
 * Files under src/content/projects are generated and may be overwritten. Do not run for
 * routine site edits; Astro MDX and checked-in assets are now the source of truth.
 */

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const wixContentRoot = '/Users/daniyar.kbv/Documents/Work/Portfolio/Wix content';
const wixDataDir = path.join(wixContentRoot, 'Data');
const outDir = path.join(repoRoot, 'src/content/projects');
const contactOutFile = path.join(repoRoot, 'src/data/contact.ts');
const localAssetsManifestFile = path.join(repoRoot, 'src/data/local-assets.json');

const expectedCounts = {
  projects: 17,
  projectTexts: 136,
  textTypes: 8,
  projectLinks: 24,
  linkTypes: 7,
  contactLinks: 2,
};

const sectionOrder = [
  'Quick facts',
  'Summary',
  'Problem',
  'Solution',
  'Architecture',
  'Hard problems solved',
  'Impact / Results',
  'Tech stack',
];

function resolveSectionOrder(textTypesCsv) {
  const orderColumns = ['Manual sort', 'Sort', 'Order', 'Position'];

  for (const column of orderColumns) {
    const hasExplicitOrder = textTypesCsv.some((row) => String(row[column] ?? '').trim() !== '');
    if (!hasExplicitOrder) continue;

    return [...textTypesCsv]
      .map((row, index) => ({
        row,
        index,
        value: Number(String(row[column] ?? '').trim()),
      }))
      .sort((a, b) => {
        const aScore = Number.isFinite(a.value) ? a.value : Number.POSITIVE_INFINITY;
        const bScore = Number.isFinite(b.value) ? b.value : Number.POSITIVE_INFINITY;
        if (aScore !== bScore) return aScore - bScore;
        return a.index - b.index;
      })
      .map(({ row }) => row.Name)
      .filter(Boolean);
  }

  return sectionOrder;
}

const projectSlugsByName = new Map([
  ['SlackLess', 'slackless'],
  ['Revenue Sharing iOS SDK', 'apprevshare-ios-sdk'],
  ['DeviceCluster', 'devicecluster'],
  ['AirbaFresh', 'airbafresh'],
  ['KEX', 'kex'],
  ['HashtagGenerator', 'hashtaggenerator'],
  ['24Goals', '24goals'],
  ['MentalMind', 'mentalmind'],
  ['UniClub', 'uniclub'],
  ['Kaz Tour Telegram Bot', 'kaz-tour-telegram-bot'],
  ['ISTOKHOME', 'istokhome'],
  ['Driver Drowsiness Detection', 'driver-drowsiness-detection'],
  ['ASL Recognition', 'asl-recognition'],
  ['Disaster Tweets', 'disaster-tweets'],
  ['MIG', 'mig'],
  ['Magazinchik', 'magazinchik'],
  ['SwiftNetworkRouting', 'swiftnetworkrouting'],
]);

function parseCsv(input) {
  const text = input.replace(/^\uFEFF/, '');
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ',') {
      row.push(cell);
      cell = '';
      continue;
    }

    if (char === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }

    if (char === '\r') {
      continue;
    }

    cell += char;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  const headers = rows.shift() ?? [];
  return rows
    .filter((currentRow) => currentRow.some((value) => value !== ''))
    .map((currentRow) => {
      const record = {};
      headers.forEach((header, index) => {
        record[header] = currentRow[index] ?? '';
      });
      return record;
    });
}

function readCsvFile(filename) {
  return readFile(path.join(wixDataDir, filename), 'utf8').then(parseCsv);
}

async function readJsonFileIfExists(filename) {
  try {
    return JSON.parse(await readFile(filename, 'utf8'));
  } catch {
    return null;
  }
}

function splitList(value) {
  return String(value)
    .split('·')
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeText(value) {
  return String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/^\t+/gm, '')
    .trim();
}

function markdownizeText(value) {
  return normalizeText(value)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .split('\n')
    .map((line) => line.replace(/^\s*•\s*/, '- '))
    .join('\n');
}

function jsonForFrontmatter(value) {
  return JSON.stringify(value, null, 2);
}

function parseJsonOrFallback(value, fallback) {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return fallback;

  try {
    return JSON.parse(trimmed);
  } catch {
    return fallback;
  }
}

function isMediaFilename(value) {
  return /\.(mp4|mov|webm|m4v)$/i.test(String(value ?? '').trim());
}

function isRenderableMediaRef(value) {
  const trimmed = String(value ?? '').trim();
  if (!trimmed || trimmed.startsWith('wix:')) return false;
  if (trimmed.startsWith('/assets/')) return true;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return true;
  if (trimmed.startsWith('./') || trimmed.startsWith('../')) return true;
  return /^[^:/?#][^?#]*$/.test(trimmed);
}

function wixImageToStaticUrl(value) {
  const trimmed = String(value ?? '').trim();
  const match = trimmed.match(/^wix:image:\/\/v1\/([^/]+)\//);
  return match ? `https://static.wixstatic.com/media/${match[1]}` : undefined;
}

function toRenderableMediaRef(value) {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return undefined;
  if (isRenderableMediaRef(trimmed)) return trimmed;
  return wixImageToStaticUrl(trimmed);
}

function normalizeUrl(value) {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith('/') || trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('mailto:')) {
    return trimmed.split(/\s+/)[0];
  }
  return trimmed;
}

function hasRawWixRef(value) {
  if (typeof value !== 'string') return false;
  return /^wix:(image|video):\/\//.test(value.trim());
}

function assertRenderableMediaFields(slug, frontmatter) {
  const fields = [
    ['thumbnail', frontmatter.thumbnail],
    ['image', frontmatter.image],
  ];

  if (Array.isArray(frontmatter.media)) {
    frontmatter.media.forEach((value, index) => {
      fields.push([`media[${index}]`, value]);
    });
  }

  if (Array.isArray(frontmatter.screenshots)) {
    frontmatter.screenshots.forEach((value, index) => {
      fields.push([`screenshots[${index}]`, value]);
    });
  }

  for (const [field, value] of fields) {
    if (hasRawWixRef(value)) {
      throw new Error(`Renderable field ${slug}.${field} contains raw Wix media ref: ${value}`);
    }
  }
}

function mapSectionBlocks(textRows, typeNameById, projectId) {
  const grouped = new Map();

  for (const row of textRows) {
    if (row.Project !== projectId) continue;
    const typeName = typeNameById.get(row.Type);
    if (!typeName) continue;
    const current = grouped.get(typeName) ?? [];
    current.push(normalizeText(row.Text));
    grouped.set(typeName, current);
  }

  return grouped;
}

function extractQuickFacts(sectionText) {
  const facts = {};
  for (const line of normalizeText(sectionText).split('\n')) {
    const match = line.match(/^[-•]\s*(.+?):\s*(.+)$/);
    if (!match) continue;
    facts[match[1].trim()] = match[2].trim();
  }
  return facts;
}

function extractHighlights(summaryText) {
  return normalizeText(summaryText)
    .split('\n')
    .map((line) => line.replace(/^\t+/g, '').trim())
    .filter((line) => /^[-•]/.test(line))
    .map((line) => line.replace(/^[-•]\s*/, '').trim());
}

function formatMdxFile(frontmatter, sections, sectionNames = sectionOrder) {
  const body = [];

  for (const sectionName of sectionNames) {
    const blocks = sections.get(sectionName);
    if (!blocks?.length) continue;
    body.push(`## ${sectionName}`);
    body.push('');
    body.push(blocks.map(markdownizeText).join('\n\n'));
    body.push('');
  }

  return `---\n${jsonForFrontmatter(frontmatter)}\n---\n\n${body.join('\n').trim()}\n`;
}

async function main() {
  const localAssetsManifest = await readJsonFileIfExists(localAssetsManifestFile);
  const [projectsCsv, textsCsv, textTypesCsv, projectLinksCsv, linkTypesCsv, contactLinksCsv] =
    await Promise.all([
      readCsvFile('Projects.csv'),
      readCsvFile('Texts.csv'),
      readCsvFile('Text+Types.csv'),
      readCsvFile('Project+Links.csv'),
      readCsvFile('Link+Types.csv'),
      readCsvFile('Contact+Links.csv'),
    ]);

  const orderedSectionNames = resolveSectionOrder(textTypesCsv);

  const typeNameById = new Map(textTypesCsv.map((row) => [row.ID, row.Name]));
  const linkTypeNameById = new Map(linkTypesCsv.map((row) => [row.ID, row.Name]));
  const projectLinksByProjectId = new Map();
  for (const row of projectLinksCsv) {
    const current = projectLinksByProjectId.get(row.Project) ?? [];
    current.push(row);
    projectLinksByProjectId.set(row.Project, current);
  }

  const projectRows = [...projectsCsv]
    .filter((row) => projectSlugsByName.has(row.Name))
    .sort((a, b) => {
      const aSort = String(a['Manual sort'] ?? '').trim();
      const bSort = String(b['Manual sort'] ?? '').trim();
      if (aSort !== bSort) return aSort.localeCompare(bSort);
      return String(a.Name ?? '').localeCompare(String(b.Name ?? ''));
    });

  const normalizedProjects = projectRows.map((projectRow, index) => {
    const name = projectRow.Name;
    const projectId = projectRow.ID;
    const slug = projectSlugsByName.get(name);
    if (!slug) {
      throw new Error(`Missing slug mapping for project: ${name}`);
    }

    const textSections = mapSectionBlocks(textsCsv, typeNameById, projectId);
    const summaryText = textSections.get('Summary')?.[0] ?? '';
    const quickFactsText = textSections.get('Quick facts')?.[0] ?? '';
    const quickFacts = extractQuickFacts(quickFactsText);
    const highlights = extractHighlights(summaryText);
    const typeTags = splitList(projectRow['Type tags']);
    const techTags = splitList(projectRow['Tech tags']);
    const projectLinks = (projectLinksByProjectId.get(projectId) ?? []).map((row) => {
      const typeName = linkTypeNameById.get(row.Type);
      return {
        type: typeName ?? row.Type,
        label: row['Custom Label']?.trim() || typeName || 'Link',
        url: normalizeUrl(row.URL),
      };
    });

    const bannerData = parseJsonOrFallback(projectRow.Banners, []);
    const localProjectAssets = localAssetsManifest?.projects?.[slug] ?? {};
    const localThumbnail = toRenderableMediaRef(localProjectAssets.thumbnail);
    const localImage = toRenderableMediaRef(localProjectAssets.image);
    const localMedia = Array.isArray(localProjectAssets.media)
      ? localProjectAssets.media.map(toRenderableMediaRef).filter(Boolean)
      : [];
    const localScreenshots = Array.isArray(localProjectAssets.screenshots)
      ? localProjectAssets.screenshots.map(toRenderableMediaRef).filter(Boolean)
      : [];
    const wixThumbnailSrc = projectRow.Thumbnail.trim() || undefined;
    const wixBannerSrc = bannerData.find((banner) => banner?.type === 'image')?.src;
    const thumbnail = localThumbnail || wixImageToStaticUrl(wixThumbnailSrc) || undefined;
    const image =
      localImage ||
      wixImageToStaticUrl(wixBannerSrc) ||
      localThumbnail ||
      localScreenshots[0] ||
      undefined;
    const media = localMedia.length ? localMedia : undefined;
    const screenshots = localScreenshots.length ? localScreenshots : undefined;
    const rawCoverAlt =
      bannerData[0]?.alt?.trim() ||
      bannerData[0]?.title?.trim() ||
      `${name} cover`;
    const coverAlt = isMediaFilename(rawCoverAlt) ? `${name} banner` : rawCoverAlt;
    const categories = parseJsonOrFallback(projectRow.Type, []);
    const category = Array.isArray(categories) && categories.length
      ? String(categories[0]).trim()
      : String(projectRow.Type || '').trim() || 'Project';

    const frontmatter = {
      title: name,
      slug,
      subtitle: typeTags.join(' · ') || category,
      description: projectRow['Short description'].trim(),
      category,
      typeTags,
      techTags,
      status: quickFacts.Status || undefined,
      featured: category.toLowerCase() === 'flagship',
      priority: index + 1,
      role: quickFacts.Role || undefined,
      stack: techTags,
      links: projectLinks,
      thumbnail,
      image,
      media,
      screenshots,
      coverAlt,
      highlights: highlights.length ? highlights : undefined,
      wix: {
        id: projectId,
        path: projectRow['Projects (Item)'],
        thumbnail: wixThumbnailSrc
          ? {
              src: wixThumbnailSrc,
              fileName: projectRow.Name ? `${projectRow.Name} Thumbnail` : undefined,
              title: `${name} Thumbnail`,
              alt: `${name} thumbnail`,
            }
          : undefined,
        banners: bannerData,
        manualSort: projectRow['Manual sort'] || undefined,
        status: projectRow.Status || undefined,
        createdAt: projectRow['Created Date'] || undefined,
        updatedAt: projectRow['Updated Date'] || undefined,
      },
    };

    assertRenderableMediaFields(slug, frontmatter);

    return {
      name,
      slug,
      frontmatter,
      sections: textSections,
    };
  });

  const projectCount = normalizedProjects.length;
  const textCount = textsCsv.length;
  const textTypeCount = textTypesCsv.length;
  const projectLinkCount = projectLinksCsv.length;
  const linkTypeCount = linkTypesCsv.length;
  const contactCount = contactLinksCsv.length;

  if (
    projectCount !== expectedCounts.projects ||
    textCount !== expectedCounts.projectTexts ||
    textTypeCount !== expectedCounts.textTypes ||
    projectLinkCount !== expectedCounts.projectLinks ||
    linkTypeCount !== expectedCounts.linkTypes ||
    contactCount !== expectedCounts.contactLinks
  ) {
    throw new Error(
      [
        'Unexpected Wix export counts:',
        `projects=${projectCount} (expected ${expectedCounts.projects})`,
        `projectTexts=${textCount} (expected ${expectedCounts.projectTexts})`,
        `textTypes=${textTypeCount} (expected ${expectedCounts.textTypes})`,
        `projectLinks=${projectLinkCount} (expected ${expectedCounts.projectLinks})`,
        `linkTypes=${linkTypeCount} (expected ${expectedCounts.linkTypes})`,
        `contactLinks=${contactCount} (expected ${expectedCounts.contactLinks})`,
      ].join('\n'),
    );
  }

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const writtenFiles = [];
  for (const project of normalizedProjects) {
    const sections = new Map();
    for (const sectionName of orderedSectionNames) {
      const blocks = project.sections.get(sectionName);
      if (blocks?.length) {
        sections.set(sectionName, blocks);
      }
    }

    const mdx = formatMdxFile(project.frontmatter, sections, orderedSectionNames);
    const filePath = path.join(outDir, `${project.slug}.mdx`);
    await writeFile(filePath, mdx, 'utf8');
    writtenFiles.push(filePath);
  }

  const contactLinks = contactLinksCsv.map((row) => {
    const typeName = linkTypeNameById.get(row.Type) ?? row.Type;
    return {
      type: typeName,
      label: row.Label,
      url: normalizeUrl(row.URL),
    };
  });

  await mkdir(path.dirname(contactOutFile), { recursive: true });
  await writeFile(
    contactOutFile,
    `export const contactLinks = ${jsonForFrontmatter(contactLinks)};\n`,
    'utf8',
  );

  console.log(
    [
      `Imported ${projectCount} projects`,
      `Text blocks: ${textCount}`,
      `Text types: ${textTypeCount}`,
      `Project links: ${projectLinkCount}`,
      `Link types: ${linkTypeCount}`,
      `Contact links: ${contactCount}`,
      `Generated MDX files: ${writtenFiles.length}`,
      `Contact data: ${path.relative(repoRoot, contactOutFile)}`,
    ].join('\n'),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exit(1);
});
