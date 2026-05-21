import { playVideo, reducedMotionQuery } from './helpers';
import type { ProjectMediaElements, ProjectMediaSlide, ProjectMediaState } from './helpers';

interface BannerCarouselOptions {
  elements: ProjectMediaElements;
  slides: ProjectMediaSlide[];
  state: ProjectMediaState;
  onActiveChange: () => void;
}

const autoSwipeDelay = 4_600;

export function createBannerCarousel({ elements, slides, state, onActiveChange }: BannerCarouselOptions) {
  const {
    lightbox,
    dialog,
    carousel,
    viewport,
    track,
    previousButton,
    nextButton,
    dots,
  } = elements;
  const hasMultipleSlides = slides.length > 1;
  const shouldAutoSwipe = hasMultipleSlides && carousel?.dataset.bannerAutoplay === 'true';
  let pointerStartX = 0;
  let pointerStartY = 0;
  let suppressOpenUntil = 0;
  let autoSwipeTimer: number | undefined;
  let isPointerInside = false;
  let isFocusInside = false;

  const syncCarouselVideoPlayback = () => {
    for (const [index, slide] of slides.entries()) {
      if (!(slide.media instanceof HTMLVideoElement)) continue;

      if (index === state.activeIndex) {
        playVideo(slide.media);
      } else {
        slide.media.pause();
      }
    }
  };

  const pauseCarouselVideos = () => {
    for (const slide of slides) {
      if (slide.media instanceof HTMLVideoElement) {
        slide.media.pause();
      }
    }
  };

  const updateActiveBanner = (nextIndex: number) => {
    if (slides.length === 0) return;

    state.activeIndex = (nextIndex + slides.length) % slides.length;

    if (track) {
      track.style.transform = `translate3d(${-state.activeIndex * 100}%, 0, 0)`;
    }

    slides.forEach((slide, index) => {
      const isActive = index === state.activeIndex;
      slide.button.tabIndex = isActive ? 0 : -1;
      slide.button.setAttribute('aria-hidden', String(!isActive));
    });

    dots.forEach((dot, index) => {
      dot.setAttribute('aria-current', String(index === state.activeIndex));
    });

    onActiveChange();
    syncCarouselVideoPlayback();
  };

  const showPreviousBanner = () => {
    updateActiveBanner(state.activeIndex - 1);
  };

  const showNextBanner = () => {
    updateActiveBanner(state.activeIndex + 1);
  };

  const stopAutoSwipe = () => {
    if (autoSwipeTimer !== undefined) {
      window.clearInterval(autoSwipeTimer);
      autoSwipeTimer = undefined;
    }
  };

  const startAutoSwipe = () => {
    if (!shouldAutoSwipe || reducedMotionQuery.matches || dialog.open || isPointerInside || isFocusInside) {
      return;
    }

    stopAutoSwipe();
    autoSwipeTimer = window.setInterval(showNextBanner, autoSwipeDelay);
  };

  const restartAutoSwipe = () => {
    stopAutoSwipe();
    startAutoSwipe();
  };

  const shouldSuppressOpen = () => Date.now() < suppressOpenUntil;

  const bindEvents = () => {
    previousButton?.addEventListener('click', () => {
      showPreviousBanner();
      restartAutoSwipe();
    });

    nextButton?.addEventListener('click', () => {
      showNextBanner();
      restartAutoSwipe();
    });

    for (const dot of dots) {
      dot.addEventListener('click', () => {
        updateActiveBanner(Number(dot.dataset.bannerIndex ?? 0));
        restartAutoSwipe();
      });
    }

    viewport?.addEventListener('pointerenter', () => {
      isPointerInside = true;
      stopAutoSwipe();
    });

    viewport?.addEventListener('pointerleave', () => {
      isPointerInside = false;
      startAutoSwipe();
    });

    lightbox.addEventListener('focusin', () => {
      isFocusInside = true;
      stopAutoSwipe();
    });

    lightbox.addEventListener('focusout', () => {
      window.setTimeout(() => {
        isFocusInside = lightbox.contains(document.activeElement);
        startAutoSwipe();
      }, 0);
    });

    viewport?.addEventListener('pointerdown', (event) => {
      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
    });

    viewport?.addEventListener('pointerup', (event) => {
      if (!hasMultipleSlides) return;

      const deltaX = event.clientX - pointerStartX;
      const deltaY = event.clientY - pointerStartY;

      if (Math.abs(deltaX) < 44 || Math.abs(deltaX) < Math.abs(deltaY)) {
        return;
      }

      suppressOpenUntil = Date.now() + 350;

      if (deltaX < 0) {
        showNextBanner();
      } else {
        showPreviousBanner();
      }

      restartAutoSwipe();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoSwipe();
      } else {
        startAutoSwipe();
      }
    });
  };

  const initialize = () => {
    bindEvents();
    updateActiveBanner(0);
    startAutoSwipe();
  };

  return {
    initialize,
    updateActiveBanner,
    startAutoSwipe,
    stopAutoSwipe,
    restartAutoSwipe,
    shouldSuppressOpen,
    syncCarouselVideoPlayback,
    pauseCarouselVideos,
  };
}
