type TimelineState = {
  element: HTMLElement;
  milestones: HTMLElement[];
  top: number;
  height: number;
  milestoneProgress: number[];
  observer: ResizeObserver;
};

let states: TimelineState[] = [];
let frame = 0;
let measureFrame = 0;
let listening = false;

const clamp = (value: number) => Math.max(0, Math.min(1, value));

const render = () => {
  frame = 0;
  const activationY = scrollY + innerHeight * .55;
  states.forEach((state) => {
    const progress = clamp((activationY - state.top) / state.height);
    state.element.style.setProperty("--timeline-progress", progress.toFixed(4));
    let current = -1;
    state.milestones.forEach((milestone, index) => {
      const complete = progress >= state.milestoneProgress[index];
      milestone.classList.toggle("is-complete", complete);
      milestone.classList.remove("is-current");
      if (complete) current = index;
    });
    if (current >= 0) state.milestones[current].classList.add("is-current");
  });
};

const scheduleRender = () => { if (!frame) frame = requestAnimationFrame(render); };

const measure = () => {
  measureFrame = 0;
  states.forEach((state) => {
    const rect = state.element.getBoundingClientRect();
    const milestoneCenters = state.milestones.map((milestone) => {
      const dot = milestone.getBoundingClientRect();
      return dot.top + dot.height / 2 - rect.top;
    });
    const lineStart = milestoneCenters[0] ?? 0;
    const lineEnd = milestoneCenters.at(-1) ?? rect.height;
    state.top = rect.top + scrollY + lineStart;
    state.height = Math.max(1, lineEnd - lineStart);
    state.element.style.setProperty("--timeline-line-start", `${lineStart}px`);
    state.element.style.setProperty("--timeline-line-length", `${state.height}px`);
    state.milestoneProgress = milestoneCenters.map((center) =>
      clamp((center - lineStart) / state.height),
    );
  });
  scheduleRender();
};

const scheduleMeasure = () => { if (!measureFrame) measureFrame = requestAnimationFrame(measure); };

export function initTimelineProgress() {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll<HTMLElement>("[data-scroll-timeline]").forEach((element) => {
    if (element.dataset.timelineReady) return;
    element.dataset.timelineReady = "true";
    const milestones = [...element.querySelectorAll<HTMLElement>("[data-timeline-milestone]")];
    if (reduced) {
      element.style.setProperty("--timeline-progress", "1");
      milestones.forEach((milestone) => milestone.classList.add("is-complete"));
      milestones.at(-1)?.classList.add("is-current");
      requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const centers = milestones.map((milestone) => {
          const dot = milestone.getBoundingClientRect();
          return dot.top + dot.height / 2 - rect.top;
        });
        const start = centers[0] ?? 0;
        const end = centers.at(-1) ?? rect.height;
        element.style.setProperty("--timeline-line-start", `${start}px`);
        element.style.setProperty(
          "--timeline-line-length",
          `${Math.max(1, end - start)}px`,
        );
      });
      return;
    }
    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(element);
    element.querySelectorAll("img").forEach((image) => { if (!image.complete) image.addEventListener("load", scheduleMeasure, { once: true }); });
    states.push({ element, milestones, top: 0, height: 1, milestoneProgress: [], observer });
  });
  if (!listening && states.length) {
    listening = true;
    addEventListener("scroll", scheduleRender, { passive: true });
    addEventListener("resize", scheduleMeasure, { passive: true });
    addEventListener("orientationchange", scheduleMeasure, { passive: true });
    document.fonts?.ready.then(scheduleMeasure);
    document.addEventListener("astro:before-swap", () => {
      states.forEach((state) => state.observer.disconnect());
      states = []; listening = false;
      cancelAnimationFrame(frame); cancelAnimationFrame(measureFrame);
      frame = 0; measureFrame = 0;
    }, { once: true });
  }
  scheduleMeasure();
}
