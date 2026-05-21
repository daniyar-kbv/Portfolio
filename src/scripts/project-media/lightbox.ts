import { playVideo } from './helpers';
import type { ProjectMediaElements, ProjectMediaSlide, ProjectMediaState } from './helpers';

interface ProjectLightboxDialogOptions {
  elements: ProjectMediaElements;
  slides: ProjectMediaSlide[];
  state: ProjectMediaState;
  startAutoSwipe: () => void;
  stopAutoSwipe: () => void;
}

const minScale = 1;
const maxScale = 4;
const zoomStep = 0.25;

export function createProjectLightboxDialog({
  elements,
  slides,
  state,
  startAutoSwipe,
  stopAutoSwipe,
}: ProjectLightboxDialogOptions) {
  const {
    dialog,
    closeButton,
    zoomInButton,
    zoomOutButton,
    resetButton,
    imageControls,
    stage,
    image,
    video,
  } = elements;
  let scale = minScale;
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let startOffsetX = 0;
  let startOffsetY = 0;

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

  const syncLightboxMedia = () => {
    const activeSlide = slides[state.activeIndex];
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

  const playActiveDialogVideo = () => {
    if (dialog.open && slides[state.activeIndex]?.type === 'video') {
      playVideo(video);
    }
  };

  const pauseDialogVideo = () => {
    video.pause();
  };

  const bindEvents = () => {
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
      slides[state.activeIndex]?.button.focus();
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
  };

  const initialize = () => {
    bindEvents();
  };

  return {
    initialize,
    syncLightboxMedia,
    openDialog,
    pauseDialogVideo,
    playActiveDialogVideo,
  };
}
