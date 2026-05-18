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
