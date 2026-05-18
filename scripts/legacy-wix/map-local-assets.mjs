#!/usr/bin/env node
/**
 * Legacy migration script: map assets from the Wix export into public/assets.
 *
 * This can rewrite src/data/local-assets.json and tracked assets. Do not run for
 * routine site edits; Astro MDX and checked-in assets are now the source of truth.
 */

import { copyFile, mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const wixContentRoot = '/Users/daniyar.kbv/Documents/Work/Portfolio/Wix content';
const wixAssetsRoot = path.join(wixContentRoot, 'Assets');
const publicAssetsRoot = path.join(repoRoot, 'public/assets');
const manifestPath = path.join(repoRoot, 'src/data/local-assets.json');

const acceptedExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.mp4', '.mov', '.svg']);

const projectSpecs = [
  {
    name: 'SlackLess',
    slug: 'slackless',
    thumbnailCandidates: ['Thumbnails/SlackLess Thumbnail.png'],
    imageCandidates: ['Banners/SlackLess Banner.png'],
  },
  {
    name: 'Revenue Sharing iOS SDK',
    slug: 'apprevshare-ios-sdk',
    thumbnailCandidates: ['Thumbnails/AppRevShare Thumbnail.png'],
    imageCandidates: ['Banners/AppRevShare iOS SDK Banner.png'],
  },
  {
    name: 'DeviceCluster',
    slug: 'devicecluster',
    thumbnailCandidates: ['Thumbnails/DeviceCluster Thumbnail.png'],
    imageCandidates: ['Banners/DeviceCluster Banner.png'],
  },
  {
    name: 'AirbaFresh',
    slug: 'airbafresh',
    thumbnailCandidates: ['Thumbnails/AirbaFresh Thumbnail.png'],
    imageCandidates: ['Banners/AirbaFresh Banner.png'],
  },
  {
    name: 'KEX',
    slug: 'kex',
    thumbnailCandidates: ['Thumbnails/KEX Thumbnail.png'],
    imageCandidates: ['Banners/KEX Banner.png'],
  },
  {
    name: 'HashtagGenerator',
    slug: 'hashtaggenerator',
    thumbnailCandidates: ['Thumbnails/HashtagGenerator Thumbnail.png'],
    imageCandidates: ['Banners/HashtagGenerator Banner.png'],
  },
  {
    name: '24Goals',
    slug: '24goals',
    thumbnailCandidates: ['Thumbnails/24Goals Thumbnail.png'],
    imageCandidates: ['Banners/24Goals Banner.png'],
  },
  {
    name: 'MentalMind',
    slug: 'mentalmind',
    thumbnailCandidates: ['Thumbnails/MentalMind Thumbnail.png'],
    imageCandidates: ['Banners/MentalMind Banner.png'],
  },
  {
    name: 'UniClub',
    slug: 'uniclub',
    thumbnailCandidates: ['Thumbnails/UniClub Thumbnail.png'],
    imageCandidates: ['Banners/UniClub Banner.png'],
    screenshotCandidates: [
      'Banners/UniClub Web Banner.png',
      'Banners/UniClub Bot Banner.png',
    ],
  },
  {
    name: 'Kaz Tour Telegram Bot',
    slug: 'kaz-tour-telegram-bot',
    thumbnailCandidates: ['Thumbnails/KAZTOUR Thumbnail.png'],
    imageCandidates: ['Banners/Kaz Tour Banner.png'],
  },
  {
    name: 'ISTOKHOME',
    slug: 'istokhome',
    thumbnailCandidates: ['Thumbnails/ISTOKHOME Thumbnail.png'],
    imageCandidates: ['Banners/ISTOKHOME Banner.png'],
  },
  {
    name: 'Driver Drowsiness Detection',
    slug: 'driver-drowsiness-detection',
    thumbnailCandidates: ['Banners/Drowsiness Detection Banner 2.png'],
    imageCandidates: ['Banners/Drowsiness Detection Banner 2.png'],
    mediaCandidates: ['Banners/16 - Drowsiness Detection Banner 1.mov'],
  },
  {
    name: 'ASL Recognition',
    slug: 'asl-recognition',
    thumbnailCandidates: ['Banners/ASL Recognition Banner 1.png'],
    imageCandidates: ['Banners/ASL Recognition Banner 1.png'],
    screenshotCandidates: [
      'Banners/ASL Recognition Banner 2.png',
      'Banners/ASL Recognition Banner 3.avif',
      'Banners/ASL Recognition Banner 4.png',
    ],
  },
  {
    name: 'Disaster Tweets',
    slug: 'disaster-tweets',
    thumbnailCandidates: ['Banners/Disaster Tweets Banner 1.png'],
    imageCandidates: ['Banners/Disaster Tweets Banner 1.png'],
    screenshotCandidates: ['Banners/Disaster Tweets Banner 2.png'],
  },
  {
    name: 'MIG',
    slug: 'mig',
    thumbnailCandidates: ['Thumbnails/MIG Thumbnail.png'],
    imageCandidates: ['Banners/MIG Banner.png'],
  },
  {
    name: 'Magazinchik',
    slug: 'magazinchik',
    thumbnailCandidates: ['Thumbnails/Magazinchik Thumbnail.png'],
    imageCandidates: ['Banners/Magazinchik Banner.png'],
  },
  {
    name: 'SwiftNetworkRouting',
    slug: 'swiftnetworkrouting',
    thumbnailCandidates: ['Thumbnails/Placeholder App Thumbnail.png'],
  },
];

function slugifySegment(segment) {
  return String(segment)
    .replace(/\.icon$/i, '')
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function toPosixPath(filePath) {
  return filePath.split(path.sep).join('/');
}

function isAcceptedAsset(filePath) {
  return acceptedExtensions.has(path.extname(filePath).toLowerCase());
}

async function walkFiles(rootDir) {
  const entries = [];
  async function visit(currentDir) {
    const dirents = await readdir(currentDir, { withFileTypes: true });
    for (const dirent of dirents) {
      if (dirent.name === '.DS_Store') continue;
      const absolute = path.join(currentDir, dirent.name);
      if (dirent.isDirectory()) {
        await visit(absolute);
      } else if (dirent.isFile() && isAcceptedAsset(absolute)) {
        entries.push(absolute);
      }
    }
  }
  await visit(rootDir);
  return entries;
}

async function buildSourceIndex() {
  const byRelative = new Map();
  const byBaseName = new Map();
  const allFiles = [];

  const files = await walkFiles(wixAssetsRoot);
  for (const absolute of files) {
    const relative = toPosixPath(path.relative(wixAssetsRoot, absolute));
    const normalized = relative.toLowerCase();
    const baseName = path.basename(absolute).toLowerCase();
    const ext = path.extname(absolute).toLowerCase();
    const record = { absolute, relative, normalized, baseName, ext };
    allFiles.push(record);
    byRelative.set(normalized, record);
    const baseList = byBaseName.get(baseName) ?? [];
    baseList.push(record);
    byBaseName.set(baseName, baseList);
  }

  return { byRelative, byBaseName, allFiles };
}

function resolveSource(index, candidate) {
  if (!candidate) return null;
  const normalized = candidate.toLowerCase();
  const exact = index.byRelative.get(normalized);
  if (exact) return exact;

  const baseName = path.basename(candidate).toLowerCase();
  const matches = index.byBaseName.get(baseName) ?? [];
  if (matches.length === 1) return matches[0];

  if (matches.length > 1) {
    const preferred = matches.find((entry) => entry.relative.toLowerCase().endsWith(normalized));
    if (preferred) return preferred;
  }

  return null;
}

function projectOutputPath(slug, kind, index, ext) {
  const baseDir = `/assets/projects/${slug}`;
  switch (kind) {
    case 'thumbnail':
      return `${baseDir}/thumbnail${ext}`;
    case 'image':
      return `${baseDir}/banner${ext}`;
    case 'media':
      return `${baseDir}/media-${index}${ext}`;
    case 'screenshot':
      return `${baseDir}/screenshots/screenshot-${index}${ext}`;
    default:
      return `${baseDir}/${kind}-${index}${ext}`;
  }
}

function sharedAssetOutputPath(kind, fileName) {
  const parsed = path.parse(fileName);
  const baseName = slugifySegment(parsed.name);
  const ext = parsed.ext.toLowerCase();

  switch (kind) {
    case 'hero':
      return `/assets/hero/banner-apps${ext}`;
    case 'seo':
      return `/assets/seo/seo-image${ext}`;
    case 'logo':
      return `/assets/logo/logo-horizontal${ext}`;
    case 'icon':
      return `/assets/icons/${baseName}${ext}`;
    default:
      return `/assets/shared/${baseName}${ext}`;
  }
}

async function copyIfChanged(sourceAbsolute, destinationAbsolute) {
  const sourceStat = await stat(sourceAbsolute);
  let destinationStat = null;
  try {
    destinationStat = await stat(destinationAbsolute);
  } catch {
    destinationStat = null;
  }

  if (
    destinationStat &&
    destinationStat.size === sourceStat.size &&
    destinationStat.mtimeMs >= sourceStat.mtimeMs
  ) {
    return 'skipped';
  }

  await mkdir(path.dirname(destinationAbsolute), { recursive: true });
  await copyFile(sourceAbsolute, destinationAbsolute);
  return 'copied';
}

async function removeStaleFiles(rootDir, keepSet) {
  async function visit(currentDir) {
    const dirents = await readdir(currentDir, { withFileTypes: true });
    for (const dirent of dirents) {
      const absolute = path.join(currentDir, dirent.name);
      if (dirent.isDirectory()) {
        await visit(absolute);
        const remaining = await readdir(absolute).catch(() => []);
        if (remaining.length === 0) {
          await rm(absolute, { recursive: true, force: true });
        }
        continue;
      }

      const relative = `/assets/${toPosixPath(path.relative(publicAssetsRoot, absolute))}`;
      if (!keepSet.has(relative)) {
        await rm(absolute, { force: true });
      }
    }
  }

  await visit(rootDir).catch(() => {});
}

async function main() {
  const index = await buildSourceIndex();
  const manifest = {
    generatedAt: new Date().toISOString(),
    projects: {},
    shared: {
      hero: [],
      seo: [],
      icons: [],
      logo: [],
    },
    counts: {
      copied: 0,
      skipped: 0,
      missing: 0,
    },
  };

  const keepSet = new Set();

  function selectSource(candidates = []) {
    for (const candidate of candidates) {
      const resolved = resolveSource(index, candidate);
      if (resolved) return resolved;
    }
    return null;
  }

  async function copyResolvedAsset(source, outputPath) {
    const destination = path.join(publicAssetsRoot, outputPath.replace('/assets/', ''));
    const result = await copyIfChanged(source.absolute, destination);
    manifest.counts[result] += 1;
    keepSet.add(outputPath);
    return outputPath;
  }

  async function copySharedAsset(kind, sourceFileName) {
    const source = resolveSource(index, sourceFileName);
    if (!source) return null;
    const output = sharedAssetOutputPath(kind, sourceFileName);
    await copyResolvedAsset(source, output);
    return output;
  }

  for (const spec of projectSpecs) {
    const missing = [];
    const outputs = {
      thumbnail: null,
      image: null,
      media: [],
      screenshots: [],
    };

    const thumbnailSource =
      selectSource(spec.thumbnailCandidates) ||
      selectSource(spec.imageCandidates) ||
      selectSource(spec.screenshotCandidates) ||
      selectSource(spec.mediaCandidates);
    if (thumbnailSource) {
      outputs.thumbnail = await copyResolvedAsset(
        thumbnailSource,
        projectOutputPath(spec.slug, 'thumbnail', 1, thumbnailSource.ext),
      );
    } else {
      missing.push('thumbnail');
    }

    const imageSource =
      selectSource(spec.imageCandidates) ||
      thumbnailSource ||
      selectSource(spec.screenshotCandidates) ||
      selectSource(spec.mediaCandidates);
    if (imageSource) {
      outputs.image = await copyResolvedAsset(
        imageSource,
        projectOutputPath(spec.slug, 'image', 1, imageSource.ext),
      );
    }

    for (let i = 0; i < (spec.mediaCandidates ?? []).length; i += 1) {
      const candidate = spec.mediaCandidates[i];
      const resolved = resolveSource(index, candidate);
      if (!resolved) {
        missing.push(`media-${i + 1}`);
        continue;
      }
      const output = projectOutputPath(spec.slug, 'media', i + 1, resolved.ext);
      await copyResolvedAsset(resolved, output);
      outputs.media.push(output);
    }

    for (const candidate of spec.screenshotCandidates ?? []) {
      const resolved = resolveSource(index, candidate);
      if (!resolved) continue;
      const output = projectOutputPath(spec.slug, 'screenshot', outputs.screenshots.length + 1, resolved.ext);
      await copyResolvedAsset(resolved, output);
      outputs.screenshots.push(output);
    }

    if (!outputs.thumbnail && outputs.image) {
      outputs.thumbnail = outputs.image;
    }

    if (!outputs.image) {
      missing.push('image');
    }

    manifest.projects[spec.slug] = {
      thumbnail: outputs.thumbnail,
      image: outputs.image,
      media: outputs.media,
      screenshots: outputs.screenshots,
      missing,
    };
    manifest.counts.missing += missing.length;
  }

  const sharedRoots = [
    { label: 'hero', source: 'Banner Apps.jpg' },
    { label: 'seo', source: 'SEO Image.png' },
    { label: 'logo', source: 'Logo Horizontal.png' },
  ];

  for (const shared of sharedRoots) {
    const output = await copySharedAsset(shared.label, shared.source);
    if (output && !manifest.shared[shared.label].includes(output)) {
      manifest.shared[shared.label].push(output);
    }
  }

  const iconFiles = await walkFiles(path.join(wixAssetsRoot, 'Icons')).catch(() => []);
  for (const absolute of iconFiles) {
    const source = {
      absolute,
      ext: path.extname(absolute).toLowerCase(),
      relative: toPosixPath(path.relative(wixAssetsRoot, absolute)),
    };
    const output = sharedAssetOutputPath('icon', path.basename(source.absolute));
    await copyResolvedAsset(source, output);
    if (!manifest.shared.icons.includes(output)) {
      manifest.shared.icons.push(output);
    }
  }

  for (const key of Object.keys(manifest.shared)) {
    manifest.shared[key].sort();
  }

  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  await removeStaleFiles(publicAssetsRoot, keepSet);

  console.log(
    [
      `Projects mapped: ${Object.keys(manifest.projects).length}`,
      `Copied assets: ${manifest.counts.copied}`,
      `Skipped assets: ${manifest.counts.skipped}`,
      `Missing asset slots: ${manifest.counts.missing}`,
      `Manifest: ${path.relative(repoRoot, manifestPath)}`,
    ].join('\n'),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exit(1);
});
