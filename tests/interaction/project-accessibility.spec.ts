import { expect, test, type Page } from '@playwright/test';

async function openSlackLessProject(page: Page) {
  await page.setViewportSize({ width: 1512, height: 900 });
  await page.goto('/projects/slackless', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('button', { name: 'Open SlackLess banner fullscreen' })).toBeVisible();
}

async function focusBannerOpenButton(page: Page) {
  const openButton = page.getByRole('button', { name: 'Open SlackLess banner fullscreen' });

  for (let index = 0; index < 16; index += 1) {
    if (await openButton.evaluate((button) => button === document.activeElement).catch(() => false)) {
      return openButton;
    }

    await page.keyboard.press('Tab');
  }

  await expect(openButton).toBeFocused();
  return openButton;
}

test('project banner opens with Enter and returns focus after Escape', async ({ page }) => {
  await openSlackLessProject(page);

  const openButton = await focusBannerOpenButton(page);
  const dialog = page.getByRole('dialog', { name: 'SlackLess banner fullscreen' });

  await page.keyboard.press('Enter');
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close fullscreen banner' })).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(openButton).toBeFocused();
});

test('homepage and project pages do not overflow horizontally on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const path of ['/', '/projects/slackless', '/projects/devicecluster', '/projects/swiftnetworkrouting']) {
    await page.goto(path, { waitUntil: 'networkidle' });

    await expect
      .poll(() =>
        page.evaluate(() => ({
          viewportWidth: window.innerWidth,
          documentWidth: document.documentElement.scrollWidth,
        })),
      )
      .toEqual({ viewportWidth: 390, documentWidth: 390 });
  }
});

test('homepage does not overflow horizontally at tablet nav breakpoint', async ({ page }) => {
  await page.setViewportSize({ width: 834, height: 1112 });
  await page.goto('/', { waitUntil: 'networkidle' });

  await expect
    .poll(() =>
      page.evaluate(() => ({
        viewportWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
      })),
    )
    .toEqual({ viewportWidth: 834, documentWidth: 834 });
});

test('mobile navigation opens, closes with Escape, and closes after link selection', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'networkidle' });

  const toggle = page.getByRole('button', { name: 'Open navigation menu' });
  const navigation = page.getByRole('navigation', { name: 'Primary' });

  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();

  await expect(page.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await expect(navigation).toHaveClass(/is-open/);
  const flagshipLink = navigation.getByRole('link', { name: 'Flagship' });
  await expect(flagshipLink).toBeVisible();

  const navBox = await navigation.boundingBox();
  const flagshipBox = await flagshipLink.boundingBox();
  if (!navBox || !flagshipBox) {
    throw new Error('Expected mobile navigation and Flagship link to have visible bounds.');
  }
  expect(flagshipBox.x - navBox.x).toBeLessThan(24);

  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(navigation).not.toHaveClass(/is-open/);

  await toggle.click();
  await navigation.getByRole('link', { name: 'Contact' }).click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(navigation).not.toHaveClass(/is-open/);
});

test('mobile navigation can be opened from the keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'networkidle' });

  const toggle = page.getByRole('button', { name: 'Open navigation menu' });

  for (let index = 0; index < 6; index += 1) {
    if (await toggle.evaluate((button) => button === document.activeElement).catch(() => false)) {
      break;
    }

    await page.keyboard.press('Tab');
  }

  await expect(toggle).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
});

test('tablet navigation uses the disclosure menu before desktop width', async ({ page }) => {
  await page.setViewportSize({ width: 834, height: 1112 });
  await page.goto('/', { waitUntil: 'networkidle' });

  const toggle = page.getByRole('button', { name: 'Open navigation menu' });
  const navigation = page.getByRole('navigation', { name: 'Primary' });

  await expect(toggle).toBeVisible();
  await expect(navigation).not.toHaveClass(/is-open/);

  await toggle.click();
  await expect(page.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await expect(navigation).toHaveClass(/is-open/);
});

test('project banner opens with Space and exposes zoom controls to keyboard users', async ({ page }) => {
  await openSlackLessProject(page);

  await focusBannerOpenButton(page);
  await page.keyboard.press('Space');

  const image = page.locator('[data-lightbox-image]');
  const closeButton = page.getByRole('button', { name: 'Close fullscreen banner' });
  const resetButton = page.getByRole('button', { name: 'Reset zoom' });
  const zoomInButton = page.getByRole('button', { name: 'Zoom in' });
  const zoomOutButton = page.getByRole('button', { name: 'Zoom out' });

  await expect(closeButton).toBeFocused();

  await page.keyboard.press('Shift+Tab');
  await expect(resetButton).toBeFocused();

  await page.keyboard.press('Shift+Tab');
  await expect(zoomInButton).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(image).toHaveAttribute('style', /scale\(1\.25\)/);

  await page.keyboard.press('Shift+Tab');
  await expect(zoomOutButton).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(image).toHaveAttribute('style', /scale\(1\)/);

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(resetButton).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(image).toHaveAttribute('style', /scale\(1\)/);
});

test('reduced motion keeps parallax images still', async ({ page }) => {
  await page.setViewportSize({ width: 1512, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/projects/slackless', { waitUntil: 'domcontentloaded' });
  const parallaxImage = page.locator('[data-parallax-image]').first();

  await expect(parallaxImage).toBeVisible();
  await expect(parallaxImage).toHaveCSS('transform', 'none');
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(100);
  await expect(parallaxImage).toHaveCSS('transform', 'none');
  await expect
    .poll(() => parallaxImage.evaluate((image) => image.style.getPropertyValue('--parallax-y')))
    .toBe('0px');
});
