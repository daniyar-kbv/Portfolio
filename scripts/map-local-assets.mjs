#!/usr/bin/env node

import { copyFile, mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const portfolioRoot = '/Users/daniyar.kbv/Documents/Work/Portfolio';
const publicAssetsRoot = path.join(repoRoot, 'public/assets');
const manifestPath = path.join(repoRoot, 'src/data/local-assets.json');

const acceptedExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.mp4', '.mov', '.svg']);

const projectSpecs = [
  {
    name: 'SlackLess',
    slug: 'slackless',
    sourceDirs: ['Projects/SlackLess'],
    thumbnailCandidates: ['Projects/SlackLess/SlackLess Thumbnail.png'],
  },
  {
    name: 'Revenue Sharing iOS SDK',
    slug: 'apprevshare-ios-sdk',
    sourceDirs: ['Projects/AppRevShare SDK'],
    thumbnailCandidates: ['Projects/AppRevShare SDK/AppRevShare Thumbnail.png'],
    imageCandidates: ['Banners/AppRevShare iOS SDK Banner.png'],
    screenshotDirs: ['Projects/AppRevShare SDK/Screenshots'],
  },
  {
    name: 'DeviceCluster',
    slug: 'devicecluster',
    sourceDirs: ['Projects/Device Cluster'],
    thumbnailCandidates: ['Projects/Device Cluster/DeviceCluster Thumbnail.png'],
    screenshotDirs: ['Projects/Device Cluster/Screenshots'],
  },
  {
    name: 'AirbaFresh',
    slug: 'airbafresh',
    sourceDirs: ['Projects/AirbaFresh'],
    thumbnailCandidates: ['Projects/AirbaFresh/AirbaFresh Thumbnail.png'],
  },
  {
    name: 'KEX',
    slug: 'kex',
    sourceDirs: ['Projects/KEX'],
    thumbnailCandidates: ['Projects/KEX/KEX Thumbnail.png'],
    imageCandidates: ['Projects/KEX/KEX Banner.png'],
  },
  {
    name: 'HashtagGenerator',
    slug: 'hashtaggenerator',
    sourceDirs: ['Projects/HashtagGenerator'],
    thumbnailCandidates: ['Projects/HashtagGenerator/HashtagGenerator Thumbnail.png'],
    screenshotDirs: ['Projects/HashtagGenerator/Screenshots'],
  },
  {
    name: '24Goals',
    slug: '24goals',
    sourceDirs: ['Projects/24Goals'],
    thumbnailCandidates: ['Projects/24Goals/24Goals Thumbnail.png'],
  },
  {
    name: 'MentalMind',
    slug: 'mentalmind',
    sourceDirs: ['Projects/MentalMind'],
    thumbnailCandidates: ['Projects/MentalMind/MentalMind Thumbnail.png'],
    imageCandidates: ['Projects/MentalMind/MentalMind Banner.png'],
  },
  {
    name: 'UniClub',
    slug: 'uniclub',
    sourceDirs: ['Projects/UniClub'],
    thumbnailCandidates: ['Projects/UniClub/UniClub Thumbnail.png'],
    imageCandidates: ['Projects/UniClub/UniClub Banner.png'],
    screenshotCandidates: [
      'Projects/UniClub/UniClub Web Banner.png',
      'Projects/UniClub/UniClub Bot Banner.png',
    ],
  },
  {
    name: 'Kaz Tour Telegram Bot',
    slug: 'kaz-tour-telegram-bot',
    sourceDirs: ['Projects/Kaz Tour'],
    thumbnailCandidates: ['Projects/Kaz Tour/KAZTOUR Thumbnail.png'],
    imageCandidates: ['Projects/Kaz Tour/Kaz Tour Banner.png'],
  },
  {
    name: 'ISTOKHOME',
    slug: 'istokhome',
    sourceDirs: ['Projects/ISTOKHOME'],
    thumbnailCandidates: ['Projects/ISTOKHOME/ISTOKHOME Thumbnail.png'],
  },
  {
    name: 'Driver Drowsiness Detection',
    slug: 'driver-drowsiness-detection',
    mediaCandidates: ['Banners/Drowsiness Detection Banner 1.mp4'],
    imageCandidates: ['Banners/Drowsiness Detection Banner 2.png'],
  },
  {
    name: 'ASL Recognition',
    slug: 'asl-recognition',
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
    imageCandidates: ['Banners/Disaster Tweets Banner 1.png'],
    screenshotCandidates: ['Banners/Disaster Tweets Banner 2.png'],
  },
  {
    name: 'MIG',
    slug: 'mig',
    sourceDirs: ['Projects/MIG'],
    thumbnailCandidates: ['Projects/MIG/MIG Thumbnail.png'],
    imageCandidates: ['Projects/MIG/MIG Banner.png'],
  },
  {
    name: 'Magazinchik',
    slug: 'magazinchik',
    sourceDirs: ['Projects/Magazinchik'],
    thumbnailCandidates: ['Projects/Magazinchik/Magazinchik Thumbnail.png'],
    imageCandidates: ['Projects/Magazinchik/Magazinchik Banner.png'],
  },
  {
    name: 'SwiftNetworkRouting',
    slug: 'swiftnetworkrouting',
    sourceDirs: ['Projects/SwiftNetworkRouting'],
    thumbnailCandidates: ['Projects/SwiftNetworkRouting/SwiftNetworkRouting Thumbnail.png'],
  },
];

function slugifySegment(segment) {
  return segment
    .replace(/\.icon$/i, '')
    .replace(/\.[^.]+$/, (match) => match)
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
  const roots = [
    ['Projects', path.join(portfolioRoot, 'Projects')],
    ['Banners', path.join(portfolioRoot, 'Banners')],
    ['Hero', path.join(portfolioRoot, 'Hero')],
    ['Icons', path.join(portfolioRoot, 'Icons')],
    ['Logo', path.join(portfolioRoot, 'Logo')],
  ];

  const byRelative = new Map();
  const byBaseName = new Map();
  const allFiles = [];

  for (const [label, root] of roots) {
    const files = await walkFiles(root);
    for (const absolute of files) {
      const relative = toPosixPath(path.relative(portfolioRoot, absolute));
      const normalized = relative.toLowerCase();
      const baseName = path.basename(absolute).toLowerCase();
      const ext = path.extname(absolute).toLowerCase();
      const record = { label, absolute, relative, normalized, baseName, ext };
      allFiles.push(record);
      byRelative.set(normalized, record);
      const baseList = byBaseName.get(baseName) ?? [];
      baseList.push(record);
      byBaseName.set(baseName, baseList);
    }
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

function sharedOutputPath(rootLabel, relativePath) {
  const rest = toPosixPath(relativePath).split('/').slice(1);
  const fileName = rest.pop();
  const outputDir = [rootLabel, ...rest.map(slugifySegment)].join('/');
  const parsed = path.parse(fileName);
  const outputFile = `${slugifySegment(parsed.name)}${parsed.ext.toLowerCase()}`;
  return `/assets/${outputDir}/${outputFile}`;
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

  for (const spec of projectSpecs) {
    const collected = [];
    for (const sourceDir of spec.sourceDirs ?? []) {
      const absDir = path.join(portfolioRoot, sourceDir);
      const files = await walkFiles(absDir).catch(() => []);
      for (const absolute of files) {
        collected.push({
          absolute,
          relative: toPosixPath(path.relative(portfolioRoot, absolute)),
          ext: path.extname(absolute).toLowerCase(),
          baseName: path.basename(absolute).toLowerCase(),
        });
      }
    }

    const used = new Set();
    const missing = [];
    const outputs = {
      thumbnail: null,
      image: null,
      media: [],
      screenshots: [],
    };

    function takeCandidate(candidates) {
      for (const candidate of candidates ?? []) {
        const resolved = resolveSource(index, candidate);
        if (resolved && !used.has(resolved.absolute)) {
          used.add(resolved.absolute);
          return resolved;
        }
      }
      return null;
    }

    const thumbnailSource = takeCandidate(spec.thumbnailCandidates);
    if (thumbnailSource) {
      const destination = path.join(publicAssetsRoot, projectOutputPath(spec.slug, 'thumbnail', 1, thumbnailSource.ext).replace('/assets/', ''));
      const result = await copyIfChanged(thumbnailSource.absolute, destination);
      manifest.counts[result] += 1;
      const output = projectOutputPath(spec.slug, 'thumbnail', 1, thumbnailSource.ext);
      outputs.thumbnail = output;
      keepSet.add(output);
    } else {
      missing.push('thumbnail');
    }

    const imageSource = takeCandidate(spec.imageCandidates);
    if (imageSource) {
      const destination = path.join(publicAssetsRoot, projectOutputPath(spec.slug, 'image', 1, imageSource.ext).replace('/assets/', ''));
      const result = await copyIfChanged(imageSource.absolute, destination);
      manifest.counts[result] += 1;
      const output = projectOutputPath(spec.slug, 'image', 1, imageSource.ext);
      outputs.image = output;
      keepSet.add(output);
    }

    const mediaCandidates = spec.mediaCandidates ?? [];
    for (let i = 0; i < mediaCandidates.length; i += 1) {
      const candidate = mediaCandidates[i];
      const resolved = resolveSource(index, candidate);
      if (!resolved) {
        missing.push(`media-${i + 1}`);
        continue;
      }
      if (used.has(resolved.absolute)) continue;
      used.add(resolved.absolute);
      const output = projectOutputPath(spec.slug, 'media', i + 1, resolved.ext);
      const destination = path.join(publicAssetsRoot, output.replace('/assets/', ''));
      const result = await copyIfChanged(resolved.absolute, destination);
      manifest.counts[result] += 1;
      outputs.media.push(output);
      keepSet.add(output);
    }

    const screenshotCandidates = [...(spec.screenshotCandidates ?? [])];
    const screenshotDirs = spec.screenshotDirs ?? [];
    for (const screenshotDir of screenshotDirs) {
      const absDir = path.join(portfolioRoot, screenshotDir);
      const files = await walkFiles(absDir).catch(() => []);
      for (const absolute of files) {
        screenshotCandidates.push(toPosixPath(path.relative(portfolioRoot, absolute)));
      }
    }

    for (const candidate of screenshotCandidates) {
      const resolved = resolveSource(index, candidate);
      if (!resolved || used.has(resolved.absolute)) continue;
      used.add(resolved.absolute);
      const output = projectOutputPath(spec.slug, 'screenshot', outputs.screenshots.length + 1, resolved.ext);
      const destination = path.join(publicAssetsRoot, output.replace('/assets/', ''));
      const result = await copyIfChanged(resolved.absolute, destination);
      manifest.counts[result] += 1;
      outputs.screenshots.push(output);
      keepSet.add(output);
    }

    for (const file of collected) {
      if (used.has(file.absolute)) continue;
      if (file.ext === '.pdf') continue;
      if (file.ext === '.json') continue;
      if (file.ext === '.ds_store') continue;
      if (!isAcceptedAsset(file.absolute)) continue;
      used.add(file.absolute);
      const output = projectOutputPath(spec.slug, 'screenshot', outputs.screenshots.length + 1, file.ext);
      const destination = path.join(publicAssetsRoot, output.replace('/assets/', ''));
      const result = await copyIfChanged(file.absolute, destination);
      manifest.counts[result] += 1;
      outputs.screenshots.push(output);
      keepSet.add(output);
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
    { label: 'hero', root: path.join(portfolioRoot, 'Hero') },
    { label: 'icons', root: path.join(portfolioRoot, 'Icons') },
    { label: 'logo', root: path.join(portfolioRoot, 'Logo') },
  ];

  for (const shared of sharedRoots) {
    const files = await walkFiles(shared.root).catch(() => []);
    for (const absolute of files) {
      const relative = toPosixPath(path.relative(portfolioRoot, absolute));
      const output = sharedOutputPath(shared.label, relative);
      const destination = path.join(publicAssetsRoot, output.replace('/assets/', ''));
      const result = await copyIfChanged(absolute, destination);
      manifest.counts[result] += 1;
      keepSet.add(output);
      if (!manifest.shared[shared.label].includes(output)) {
        manifest.shared[shared.label].push(output);
      }
    }
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
