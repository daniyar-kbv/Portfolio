const lightboxes = Array.from(document.querySelectorAll<HTMLElement>('[data-project-lightbox]'));

for (const lightbox of lightboxes) {
  const openButton = lightbox.querySelector<HTMLButtonElement>('[data-lightbox-open]');
  const dialog = lightbox.querySelector<HTMLDialogElement>('[data-lightbox-dialog]');
  const closeButton = lightbox.querySelector<HTMLButtonElement>('[data-lightbox-close]');
  const zoomInButton = lightbox.querySelector<HTMLButtonElement>('[data-lightbox-zoom-in]');
  const zoomOutButton = lightbox.querySelector<HTMLButtonElement>('[data-lightbox-zoom-out]');
  const resetButton = lightbox.querySelector<HTMLButtonElement>('[data-lightbox-reset]');
  const stage = lightbox.querySelector<HTMLElement>('[data-lightbox-stage]');
  const image = lightbox.querySelector<HTMLImageElement>('[data-lightbox-image]');

  if (!openButton || !dialog || !closeButton || !zoomInButton || !zoomOutButton || !resetButton || !stage || !image) {
    continue;
  }

  const minScale = 1;
  const maxScale = 4;
  const zoomStep = 0.25;
  let scale = minScale;
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let startOffsetX = 0;
  let startOffsetY = 0;

  const updateTransform = () => {
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

  openButton.addEventListener('click', () => {
    resetZoom();
    document.documentElement.classList.add('wix-lightbox-open');

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }

    closeButton.focus();
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
    openButton.focus();
  });

  dialog.addEventListener('cancel', () => {
    document.documentElement.classList.remove('wix-lightbox-open');
  });

  stage.addEventListener(
    'wheel',
    (event) => {
      event.preventDefault();
      zoomBy(event.deltaY < 0 ? zoomStep : -zoomStep);
    },
    { passive: false },
  );

  stage.addEventListener('dblclick', () => {
    if (scale > minScale) {
      resetZoom();
    } else {
      scale = 2;
      updateTransform();
    }
  });

  stage.addEventListener('pointerdown', (event) => {
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
}
