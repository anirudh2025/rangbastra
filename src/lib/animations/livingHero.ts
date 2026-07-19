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
