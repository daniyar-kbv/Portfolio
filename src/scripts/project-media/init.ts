import { createBannerCarousel } from './carousel';
import { createProjectLightboxDialog } from './lightbox';
import {
  collectProjectMediaElements,
  collectProjectMediaSlides,
  reducedMotionQuery,
} from './helpers';
import type { ProjectMediaState } from './helpers';

export function initializeProjectMediaLightbox() {
  const lightboxes = Array.from(document.querySelectorAll<HTMLElement>('[data-project-lightbox]'));

  for (const lightbox of lightboxes) {
    const elements = collectProjectMediaElements(lightbox);
    if (!elements) continue;

    const slides = collectProjectMediaSlides(elements.openButtons);
    const state: ProjectMediaState = { activeIndex: 0 };
    let syncLightboxMedia = () => undefined;

    const carousel = createBannerCarousel({
      elements,
      slides,
      state,
      onActiveChange: () => syncLightboxMedia(),
    });
    const dialog = createProjectLightboxDialog({
      elements,
      slides,
      state,
      startAutoSwipe: carousel.startAutoSwipe,
      stopAutoSwipe: carousel.stopAutoSwipe,
    });

    syncLightboxMedia = dialog.syncLightboxMedia;

    for (const [index, openButton] of elements.openButtons.entries()) {
      openButton.addEventListener('click', (event) => {
        if (carousel.shouldSuppressOpen()) {
          event.preventDefault();
          return;
        }

        carousel.updateActiveBanner(index);
        dialog.openDialog();
      });
    }

    reducedMotionQuery.addEventListener('change', () => {
      if (reducedMotionQuery.matches) {
        dialog.pauseDialogVideo();
        carousel.pauseCarouselVideos();
      } else {
        carousel.syncCarouselVideoPlayback();
        dialog.playActiveDialogVideo();
      }

      carousel.restartAutoSwipe();
    });

    dialog.initialize();
    carousel.initialize();
  }
}
