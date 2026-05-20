const lightboxes = Array.from(document.querySelectorAll<HTMLElement>('[data-project-lightbox]'));
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

for (const lightbox of lightboxes) {
  const openButtons = Array.from(lightbox.querySelectorAll<HTMLButtonElement>('[data-lightbox-open]'));
  const dialog = lightbox.querySelector<HTMLDialogElement>('[data-lightbox-dialog]');
  const closeButton = lightbox.querySelector<HTMLButtonElement>('[data-lightbox-close]');
  const zoomInButton = lightbox.querySelector<HTMLButtonElement>('[data-lightbox-zoom-in]');
  const zoomOutButton = lightbox.querySelector<HTMLButtonElement>('[data-lightbox-zoom-out]');
  const resetButton = lightbox.querySelector<HTMLButtonElement>('[data-lightbox-reset]');
  const imageControls = Array.from(lightbox.querySelectorAll<HTMLButtonElement>('[data-lightbox-image-control]'));
  const stage = lightbox.querySelector<HTMLElement>('[data-lightbox-stage]');
  const image = lightbox.querySelector<HTMLImageElement>('[data-lightbox-image]');
  const video = lightbox.querySelector<HTMLVideoElement>('[data-lightbox-video]');
  const carousel = lightbox.querySelector<HTMLElement>('[data-banner-carousel]');
  const viewport = lightbox.querySelector<HTMLElement>('[data-banner-viewport]');
  const track = lightbox.querySelector<HTMLElement>('[data-banner-track]');
  const previousButton = lightbox.querySelector<HTMLButtonElement>('[data-banner-prev]');
  const nextButton = lightbox.querySelector<HTMLButtonElement>('[data-banner-next]');
  const dots = Array.from(lightbox.querySelectorAll<HTMLButtonElement>('[data-banner-dot]'));

  if (
    openButtons.length === 0 ||
    !dialog ||
    !closeButton ||
    !zoomInButton ||
    !zoomOutButton ||
    !resetButton ||
    !stage ||
    !image ||
    !video
  ) {
    continue;
  }

  const slides = openButtons.map((button) => {
    const slideMedia = button.querySelector<HTMLImageElement | HTMLVideoElement>('[data-banner-media]');

    return {
      button,
      media: slideMedia,
      src: slideMedia?.getAttribute('src') ?? '',
      alt: slideMedia instanceof HTMLImageElement ? (slideMedia.getAttribute('alt') ?? '') : button.getAttribute('aria-label') ?? '',
      type: button.dataset.bannerType === 'video' ? 'video' : 'image',
    };
  });

  const minScale = 1;
  const maxScale = 4;
  const zoomStep = 0.25;
  const autoSwipeDelay = 4_600;
  let scale = minScale;
  let offsetX = 0;
  let offsetY = 0;
  let activeIndex = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let startOffsetX = 0;
  let startOffsetY = 0;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let suppressOpenUntil = 0;
  let autoSwipeTimer: number | undefined;
  let isPointerInside = false;
  let isFocusInside = false;

  const hasMultipleSlides = slides.length > 1;
  const shouldAutoSwipe = hasMultipleSlides && carousel?.dataset.bannerAutoplay === 'true';
  const shouldPlayMotion = () => !reducedMotionQuery.matches;

  const playVideo = (target: HTMLVideoElement) => {
    if (!shouldPlayMotion()) return;
    target.play().catch(() => undefined);
  };

  const syncCarouselVideoPlayback = () => {
    for (const [index, slide] of slides.entries()) {
      if (!(slide.media instanceof HTMLVideoElement)) continue;

      if (index === activeIndex) {
        playVideo(slide.media);
      } else {
        slide.media.pause();
      }
    }
  };

  const syncLightboxMedia = () => {
    const activeSlide = slides[activeIndex];
    const isVideo = activeSlide?.type === 'video';

    image.hidden = isVideo;
    video.hidden = !isVideo;
    stage.classList.toggle('is-video', isVideo);
    imageControls.forEach((control) => {
      control.hidden = isVideo;
    });

    if (isVideo) {
      image.removeAttribute('src');
      video.src = activeSlide.src;
      video.setAttribute('aria-label', activeSlide.alt);
      resetZoom();
      if (dialog.open) {
        playVideo(video);
      } else {
        video.pause();
      }
      return;
    }

    video.pause();
    video.removeAttribute('src');

    if (activeSlide?.src) {
      image.src = activeSlide.src;
    }

    if (activeSlide?.alt) {
      image.alt = activeSlide.alt;
    }
  };

  const updateTransform = () => {
    if (image.hidden) {
      stage.classList.remove('is-zoomed');
      return;
    }

    if (scale <= minScale) {
      offsetX = 0;
      offsetY = 0;
    }

    image.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${scale})`;
    stage.classList.toggle('is-zoomed', scale > minScale);
  };

  const resetZoom = () => {
    scale = minScale;
    offsetX = 0;
    offsetY = 0;
    updateTransform();
  };

  const stopAutoSwipe = () => {
    if (autoSwipeTimer !== undefined) {
      window.clearInterval(autoSwipeTimer);
      autoSwipeTimer = undefined;
    }
  };

  const updateActiveBanner = (nextIndex: number) => {
    if (slides.length === 0) return;

    activeIndex = (nextIndex + slides.length) % slides.length;

    if (track) {
      track.style.transform = `translate3d(${-activeIndex * 100}%, 0, 0)`;
    }

    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      slide.button.tabIndex = isActive ? 0 : -1;
      slide.button.setAttribute('aria-hidden', String(!isActive));
    });

    dots.forEach((dot, index) => {
      dot.setAttribute('aria-current', String(index === activeIndex));
    });

    syncLightboxMedia();
    syncCarouselVideoPlayback();
  };

  const showPreviousBanner = () => {
    updateActiveBanner(activeIndex - 1);
  };

  const showNextBanner = () => {
    updateActiveBanner(activeIndex + 1);
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

  const zoomBy = (delta: number) => {
    scale = Math.min(maxScale, Math.max(minScale, Number((scale + delta).toFixed(2))));
    updateTransform();
  };

  const closeDialog = () => {
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
      document.documentElement.classList.remove('wix-lightbox-open');
    }
  };

  const openDialog = () => {
    resetZoom();
    stopAutoSwipe();
    syncLightboxMedia();
    document.documentElement.classList.add('wix-lightbox-open');

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }

    closeButton.focus();
  };

  for (const [index, openButton] of openButtons.entries()) {
    openButton.addEventListener('click', (event) => {
      if (Date.now() < suppressOpenUntil) {
        event.preventDefault();
        return;
      }

      updateActiveBanner(index);
      openDialog();
    });
  }

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

  closeButton.addEventListener('click', closeDialog);
  zoomInButton.addEventListener('click', () => zoomBy(zoomStep));
  zoomOutButton.addEventListener('click', () => zoomBy(-zoomStep));
  resetButton.addEventListener('click', resetZoom);

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      closeDialog();
    }
  });

  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('wix-lightbox-open');
    video.pause();
    slides[activeIndex]?.button.focus();
    startAutoSwipe();
  });

  dialog.addEventListener('cancel', () => {
    document.documentElement.classList.remove('wix-lightbox-open');
    video.pause();
    startAutoSwipe();
  });

  stage.addEventListener(
    'wheel',
    (event) => {
      if (image.hidden) return;

      event.preventDefault();
      zoomBy(event.deltaY < 0 ? zoomStep : -zoomStep);
    },
    { passive: false },
  );

  stage.addEventListener('dblclick', () => {
    if (image.hidden) return;

    if (scale > minScale) {
      resetZoom();
    } else {
      scale = 2;
      updateTransform();
    }
  });

  stage.addEventListener('pointerdown', (event) => {
    if (image.hidden) return;
    if (scale <= minScale) return;

    isDragging = true;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    startOffsetX = offsetX;
    startOffsetY = offsetY;
    stage.classList.add('is-dragging');
    stage.setPointerCapture(event.pointerId);
  });

  stage.addEventListener('pointermove', (event) => {
    if (!isDragging) return;

    offsetX = startOffsetX + event.clientX - dragStartX;
    offsetY = startOffsetY + event.clientY - dragStartY;
    updateTransform();
  });

  const stopDragging = (event: PointerEvent) => {
    if (!isDragging) return;

    isDragging = false;
    stage.classList.remove('is-dragging');

    if (stage.hasPointerCapture(event.pointerId)) {
      stage.releasePointerCapture(event.pointerId);
    }
  };

  stage.addEventListener('pointerup', stopDragging);
  stage.addEventListener('pointercancel', stopDragging);

  reducedMotionQuery.addEventListener('change', () => {
    if (reducedMotionQuery.matches) {
      video.pause();
      for (const slide of slides) {
        if (slide.media instanceof HTMLVideoElement) {
          slide.media.pause();
        }
      }
    } else {
      syncCarouselVideoPlayback();
      if (dialog.open && slides[activeIndex]?.type === 'video') {
        playVideo(video);
      }
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

  updateActiveBanner(0);
  startAutoSwipe();
}
