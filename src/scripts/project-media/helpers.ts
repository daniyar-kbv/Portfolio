export type ProjectMediaType = 'image' | 'video';

export interface ProjectMediaSlide {
  button: HTMLButtonElement;
  media: HTMLImageElement | HTMLVideoElement | null;
  src: string;
  alt: string;
  type: ProjectMediaType;
}

export interface ProjectMediaElements {
  lightbox: HTMLElement;
  openButtons: HTMLButtonElement[];
  dialog: HTMLDialogElement;
  closeButton: HTMLButtonElement;
  zoomInButton: HTMLButtonElement;
  zoomOutButton: HTMLButtonElement;
  resetButton: HTMLButtonElement;
  imageControls: HTMLButtonElement[];
  stage: HTMLElement;
  image: HTMLImageElement;
  video: HTMLVideoElement;
  carousel: HTMLElement | null;
  viewport: HTMLElement | null;
  track: HTMLElement | null;
  previousButton: HTMLButtonElement | null;
  nextButton: HTMLButtonElement | null;
  dots: HTMLButtonElement[];
}

export interface ProjectMediaState {
  activeIndex: number;
}

export const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

export function collectProjectMediaElements(lightbox: HTMLElement): ProjectMediaElements | null {
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
    return null;
  }

  return {
    lightbox,
    openButtons,
    dialog,
    closeButton,
    zoomInButton,
    zoomOutButton,
    resetButton,
    imageControls,
    stage,
    image,
    video,
    carousel,
    viewport,
    track,
    previousButton,
    nextButton,
    dots,
  };
}

export function collectProjectMediaSlides(openButtons: HTMLButtonElement[]): ProjectMediaSlide[] {
  return openButtons.map((button) => {
    const slideMedia = button.querySelector<HTMLImageElement | HTMLVideoElement>('[data-banner-media]');

    return {
      button,
      media: slideMedia,
      src: slideMedia?.getAttribute('src') ?? '',
      alt:
        slideMedia instanceof HTMLImageElement
          ? (slideMedia.getAttribute('alt') ?? '')
          : button.getAttribute('aria-label') ?? '',
      type: button.dataset.bannerType === 'video' ? 'video' : 'image',
    };
  });
}

export function shouldPlayMotion() {
  return !reducedMotionQuery.matches;
}

export function playVideo(target: HTMLVideoElement) {
  if (!shouldPlayMotion()) return;
  target.play().catch(() => undefined);
}
