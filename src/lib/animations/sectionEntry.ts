export function initSectionEntry() {
  const journey = document.querySelector<HTMLElement>(".homepage-journey");
  if (!journey || journey.dataset.entryReady) return;
  journey.dataset.entryReady = "true";
  const sections = [...journey.querySelectorAll<HTMLElement>(":scope > section, :scope > footer")];
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    sections.forEach((section) => section.classList.add("is-section-current"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle("is-section-current", entry.isIntersecting));
  }, { rootMargin: "-18% 0px -34%", threshold: .12 });
  sections.forEach((section) => observer.observe(section));
  document.addEventListener("astro:before-swap", () => observer.disconnect(), { once: true });
}
