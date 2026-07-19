const WORDS = ["Designed", "Crafted", "Sculpted", "Draped", "Embroidered"];

export function initLivingHero() {
  const hero = document.querySelector<HTMLElement>("[data-living-hero]");
  if (!hero || hero.dataset.ready === "true") return;
  hero.dataset.ready = "true";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  try {
    const visited = sessionStorage.getItem("rangbastra-living-hero");
    hero.classList.add(visited ? "is-return-visit" : "is-first-visit");
    sessionStorage.setItem("rangbastra-living-hero", "seen");
  } catch {
    hero.classList.add("is-return-visit");
  }

  const word = hero.querySelector<HTMLElement>("[data-changing-word]");
  if (!word || reduced) {
    if (word) word.textContent = "Crafted";
    return;
  }

  let scrollFrame = 0;
  let runway = 1;
  const clamp = (value: number) => Math.min(1, Math.max(0, value));
  const range = (value: number, start: number, end: number) =>
    clamp((value - start) / (end - start));
  const measureGeometry = () => {
    runway = Math.max(1, hero.offsetHeight - innerHeight);
  };
  const renderScroll = () => {
    scrollFrame = 0;
    const rect = hero.getBoundingClientRect();
    const progress = clamp(-rect.top / runway);
    hero.style.setProperty("--hero-progress", progress.toFixed(4));
    const imageOpacity = 1 - range(progress, 0.2, 0.68);
    const darkness = range(progress, 0.02, 0.72);
    const gridReveal = 0.04 + range(progress, 0.32, 0.76) * 0.68;
    const featured = range(progress, 0.6, 1);
    hero.style.setProperty("--hero-image-opacity", imageOpacity.toFixed(4));
    hero.style.setProperty("--hero-darkness", darkness.toFixed(4));
    document.documentElement.style.setProperty(
      "--global-grid-opacity",
      gridReveal.toFixed(4),
    );
    document.documentElement.style.setProperty(
      "--featured-content-opacity",
      featured.toFixed(4),
    );
    document.documentElement.style.setProperty(
      "--featured-content-translate",
      `${((1 - featured) * 72).toFixed(2)}px`,
    );
  };
  const queueScroll = () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(renderScroll);
  };
  addEventListener("scroll", queueScroll, { passive: true });
  addEventListener(
    "resize",
    () => {
      measureGeometry();
      queueScroll();
    },
    { passive: true },
  );
  addEventListener(
    "orientationchange",
    () => {
      measureGeometry();
      queueScroll();
    },
    { passive: true },
  );
  visualViewport?.addEventListener(
    "resize",
    () => {
      measureGeometry();
      queueScroll();
    },
    { passive: true },
  );
  measureGeometry();
  document.fonts?.ready.then(() => {
    measureGeometry();
    queueScroll();
  });
  renderScroll();

  let wordIndex = 0,
    timer = 0,
    stopped = false,
    heroVisible = true;
  new IntersectionObserver(
    ([entry]) => {
      heroVisible = entry.isIntersecting;
    },
    { threshold: 0.1 },
  ).observe(hero);
  const wait = (ms: number) =>
    new Promise<void>((resolve) => {
      timer = window.setTimeout(resolve, ms);
    });
  const typeWord = async (value: string) => {
    word.firstChild!.textContent = "";
    for (const character of value) {
      if (stopped) return;
      word.firstChild!.textContent += character;
      await wait(90);
    }
  };
  const eraseWord = async () => {
    while (word.firstChild?.textContent && !stopped) {
      word.firstChild.textContent = word.firstChild.textContent.slice(0, -1);
      await wait(52);
    }
  };
  const loop = async () => {
    await wait(hero.classList.contains("is-first-visit") ? 2200 : 650);
    while (!stopped) {
      if (document.hidden || !heroVisible) {
        await wait(400);
        continue;
      }
      await typeWord(WORDS[wordIndex]);
      await wait(1800);
      await eraseWord();
      await wait(300);
      wordIndex = (wordIndex + 1) % WORDS.length;
    }
  };
  loop();
  document.addEventListener(
    "astro:before-swap",
    () => {
      stopped = true;
      clearTimeout(timer);
    },
    { once: true },
  );
}
