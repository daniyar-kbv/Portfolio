const parallaxHeroes = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax-hero]'));
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let parallaxFrameRequested = false;

const updateParallaxHeroes = () => {
  parallaxFrameRequested = false;

  for (const hero of parallaxHeroes) {
    const image = hero.querySelector<HTMLElement>('[data-parallax-image]');
    if (!image) continue;

    if (prefersReducedMotion.matches) {
      image.style.setProperty('--parallax-y', '0px');
      continue;
    }

    const travel = Number(hero.dataset.parallaxTravel || 36);
    const rect = hero.getBoundingClientRect();
    const y = Math.max(-travel, Math.min(travel, -rect.top * 0.22));
    image.style.setProperty('--parallax-y', `${y.toFixed(2)}px`);
  }
};

const requestParallaxUpdate = () => {
  if (parallaxFrameRequested) return;
  parallaxFrameRequested = true;
  window.requestAnimationFrame(updateParallaxHeroes);
};

if (parallaxHeroes.length > 0) {
  updateParallaxHeroes();
  window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
  window.addEventListener('resize', requestParallaxUpdate);
  prefersReducedMotion.addEventListener('change', requestParallaxUpdate);
}
