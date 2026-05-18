import { expect, test, type Page } from '@playwright/test';

type VisualPage = {
  name: string;
  path: string;
  viewport: {
    width: number;
    height: number;
  };
};

const pages: VisualPage[] = [
  {
    name: 'homepage-desktop',
    path: '/',
    viewport: { width: 1512, height: 900 },
  },
  {
    name: 'homepage-mobile',
    path: '/',
    viewport: { width: 390, height: 844 },
  },
  {
    name: 'slackless-desktop',
    path: '/projects/slackless',
    viewport: { width: 1512, height: 900 },
  },
  {
    name: 'slackless-mobile',
    path: '/projects/slackless',
    viewport: { width: 390, height: 844 },
  },
  {
    name: 'swiftnetworkrouting-no-project-media',
    path: '/projects/swiftnetworkrouting',
    viewport: { width: 1512, height: 900 },
  },
  {
    name: 'devicecluster-no-project-links',
    path: '/projects/devicecluster',
    viewport: { width: 1512, height: 900 },
  },
];

async function waitForVisualSettling(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');

  await page.evaluate(async () => {
    await document.fonts.ready;

    document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((image) => {
      image.loading = 'eager';
    });

    const scrollStep = window.innerHeight;
    const maxScroll = document.documentElement.scrollHeight;
    for (let scrollY = 0; scrollY < maxScroll; scrollY += scrollStep) {
      window.scrollTo(0, scrollY);
      await new Promise((resolve) => window.setTimeout(resolve, 50));
    }

    window.scrollTo(0, 0);

    const imageSettles = Array.from(document.images).map((image) => {
      if (image.complete) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        image.addEventListener('load', () => resolve(), { once: true });
        image.addEventListener('error', () => resolve(), { once: true });
      });
    });

    await Promise.race([
      Promise.all(imageSettles),
      new Promise((resolve) => window.setTimeout(resolve, 5_000)),
    ]);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

for (const visualPage of pages) {
  test(visualPage.name, async ({ page }) => {
    await page.setViewportSize(visualPage.viewport);
    await page.goto(visualPage.path, { waitUntil: 'networkidle' });
    await waitForVisualSettling(page);

    await expect(page).toHaveScreenshot(`${visualPage.name}.png`, {
      fullPage: true,
    });
  });
}
