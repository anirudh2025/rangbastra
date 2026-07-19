declare global {
  interface Window {
    RangbastraAudio?: ReturnType<typeof createAudioController>;
  }
}

type Cue =
  | "selection"
  | "glitter"
  | "whatsapp"
  | "instagram"
  | "wishlist"
  | "wishlistOpen"
  | "creative"
  | "collection"
  | "consultation"
  | "imageSlide"
  | "dropdown"
  | "progress"
  | "google"
  | "portal"
  | "signout"
  | "success"
  | "error"
  | "reveal"
  | "detail"
  | "reset"
  | "transition"
  | "stageTick";

const createAudioController = () => {
  let unlocked = false;
  const unlock = () => {
    unlocked = true;
  };
  document.addEventListener("pointerdown", unlock, {
    once: true,
    passive: true,
  });
  document.addEventListener("keydown", unlock, { once: true });
  let context: AudioContext | null = null,
    master: GainNode | null = null,
    limiter: DynamicsCompressorNode | null = null,
    noise: AudioBuffer | null = null;
  const active = new Set<AudioScheduledSourceNode>(),
    last = new Map<Cue, number>();
  const cooldown: Partial<Record<Cue, number>> = {
    selection: 100,
    imageSlide: 180,
    dropdown: 120,
    progress: 180,
    wishlist: 300,
    whatsapp: 300,
    instagram: 300,
    glitter: 650,
    reveal: 650,
    transition: 450,
  };
  const storedVolume = () =>
    Math.max(
      0,
      Math.min(
        1,
        Number(localStorage.getItem("rangbastraVolume") ?? "0.72") || 0,
      ),
    );
  const muted = () =>
    localStorage.getItem("rangbastraSound") === "off" || storedVolume() === 0;
  const ensure = () => {
    if (muted()) return null;
    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return null;
    context ??= new AudioContextClass();
    if (!master) {
      master = context.createGain();
      limiter = context.createDynamicsCompressor();
      limiter.threshold.value = -20;
      limiter.knee.value = 16;
      limiter.ratio.value = 10;
      limiter.attack.value = 0.004;
      limiter.release.value = 0.18;
      master.connect(limiter).connect(context.destination);
    }
    master.gain.setTargetAtTime(storedVolume(), context.currentTime, 0.015);
    if (context.state === "suspended") void context.resume().catch(() => {});
    return context;
  };
  const allowed = (cue: Cue) => {
    const now = performance.now(),
      wait = cooldown[cue] ?? 220;
    if (now - (last.get(cue) ?? 0) < wait) return false;
    last.set(cue, now);
    return true;
  };
  const register = <T extends AudioScheduledSourceNode>(source: T) => {
    active.add(source);
    source.addEventListener("ended", () => active.delete(source), {
      once: true,
    });
    return source;
  };
  const tone = (
    frequency: number,
    gainValue: number,
    delay = 0,
    duration = 0.12,
    endFrequency?: number,
    type: OscillatorType = "sine",
  ) => {
    const audio = ensure();
    if (!audio || !master) return;
    const oscillator = register(audio.createOscillator()),
      gain = audio.createGain(),
      start = audio.currentTime + delay;
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    if (endFrequency)
      oscillator.frequency.exponentialRampToValueAtTime(
        endFrequency,
        start + duration,
      );
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(master);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.025);
  };
  const sweep = (
    gainValue = 0.025,
    delay = 0,
    duration = 0.16,
    highpass = 700,
  ) => {
    const audio = ensure();
    if (!audio || !master) return;
    if (!noise) {
      noise = audio.createBuffer(
        1,
        Math.ceil(audio.sampleRate * 0.35),
        audio.sampleRate,
      );
      const data = noise.getChannelData(0);
      for (let i = 0; i < data.length; i++)
        data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }
    const source = register(audio.createBufferSource()),
      filter = audio.createBiquadFilter(),
      gain = audio.createGain(),
      start = audio.currentTime + delay;
    source.buffer = noise;
    filter.type = "highpass";
    filter.frequency.value = highpass;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(gainValue, start + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(filter).connect(gain).connect(master);
    source.start(start);
    source.stop(start + duration + 0.02);
  };
  const cue = (name: Cue, play: () => void) => {
    if (!unlocked || !allowed(name) || muted()) return;
    active.forEach((source) => {
      try {
        source.stop();
      } catch {}
    });
    active.clear();
    play();
  };
  const api = {
    selection: () => cue("selection", () => tone(540, 0.055, 0, 0.09, 480)),
    glitter: () =>
      cue("glitter", () => {
        sweep(0.018, 0, 0.24, 1500);
        tone(880, 0.075, 0.05, 0.18, 1320);
        tone(1568, 0.045, 0.15, 0.2);
      }),
    whoosh: (kind: "whatsapp" | "instagram") =>
      cue(kind, () =>
        kind === "whatsapp"
          ? (sweep(0.035, 0, 0.13, 500), tone(420, 0.085, 0.035, 0.13, 720))
          : (sweep(0.022, 0, 0.2, 1400), tone(1046.5, 0.06, 0.12, 0.18, 1568)),
      ),
    wishlist: (saved = true) =>
      cue("wishlist", () => {
        tone(saved ? 440 : 554.37, 0.12, 0, 0.14, saved ? 554.37 : 440);
        tone(saved ? 659.25 : 392, 0.1, 0.09, 0.2);
      }),
    inspiration: (saved = true) => api.wishlist(saved),
    wishlistOpen: () =>
      cue("wishlistOpen", () => {
        sweep(0.02, 0, 0.19, 650);
        tone(349.23, 0.07, 0.04, 0.15, 523.25);
      }),
    creative: () =>
      cue("creative", () => {
        sweep(0.023, 0, 0.16, 900);
        tone(293.66, 0.065, 0.035, 0.13, 370);
        tone(880, 0.045, 0.14, 0.18);
      }),
    collection: () =>
      cue("collection", () => {
        sweep(0.03, 0, 0.22, 600);
        tone(329.63, 0.052, 0.09, 0.17, 493.88);
      }),
    consultation: () =>
      cue("consultation", () => {
        tone(440, 0.07, 0, 0.15);
        tone(659.25, 0.065, 0.13, 0.22);
      }),
    imageSlide: () => cue("imageSlide", () => sweep(0.012, 0, 0.12, 500)),
    dropdown: () => cue("dropdown", () => tone(587.33, 0.035, 0, 0.075, 540)),
    progress: () => cue("progress", () => tone(392, 0.055, 0, 0.12, 466.16)),
    detail: () =>
      cue("detail", () => tone(510, 0.095, 0, 0.075, 455, "triangle")),
    stageTick: (complete = false) =>
      cue("stageTick", () =>
        tone(
          complete ? 320 : 410,
          0.035,
          0,
          0.065,
          complete ? 270 : 360,
          "triangle",
        ),
      ),
    reset: () =>
      cue("reset", () => {
        sweep(0.022, 0, 0.16, 620);
        tone(466.16, 0.055, 0.02, 0.16, 293.66);
      }),
    google: () => cue("google", () => tone(440, 0.045, 0, 0.11, 493.88)),
    portal: () =>
      cue("portal", () => {
        tone(392, 0.085, 0, 0.15);
        tone(587.33, 0.07, 0.12, 0.2);
      }),
    signout: () =>
      cue("signout", () => {
        tone(493.88, 0.06, 0, 0.12);
        tone(329.63, 0.055, 0.1, 0.18);
      }),
    success: () =>
      cue("success", () => {
        tone(523.25, 0.12, 0, 0.18);
        tone(659.25, 0.115, 0.1, 0.2);
        tone(783.99, 0.1, 0.2, 0.24);
      }),
    error: () =>
      cue("error", () => tone(246.94, 0.105, 0, 0.18, 196, "triangle")),
    reveal: () =>
      cue("reveal", () => {
        sweep(0.024, 0, 0.28, 400);
        tone(220, 0.04, 0.08, 0.24, 329.63);
      }),
    transition: () => cue("transition", () => sweep(0.012, 0, 0.14, 800)),
    preview: () => {
      last.delete("success");
      api.success();
    },
    setMuted: (value: boolean) => {
      localStorage.setItem("rangbastraSound", value ? "off" : "on");
      if (master && context)
        master.gain.setTargetAtTime(
          value ? 0 : storedVolume(),
          context.currentTime,
          0.02,
        );
    },
    setVolume: (value: number) => {
      const normalized = Math.max(0, Math.min(1, value));
      localStorage.setItem("rangbastraVolume", String(normalized));
      localStorage.setItem("rangbastraSound", normalized === 0 ? "off" : "on");
      if (master && context)
        master.gain.setTargetAtTime(normalized, context.currentTime, 0.015);
    },
    getVolume: storedVolume,
    isMuted: muted,
    stop: () => {
      active.forEach((source) => {
        try {
          source.stop();
        } catch {}
      });
      active.clear();
    },
  };
  return api;
};

const initSoundControls = () =>
  document
    .querySelectorAll<HTMLElement>("[data-sound-control]")
    .forEach((root) => {
      if (root.dataset.ready) return;
      root.dataset.ready = "true";
      const trigger = root.querySelector<HTMLButtonElement>(
          "[data-sound-trigger]",
        )!,
        popover = root.querySelector<HTMLElement>("[data-sound-popover]")!,
        slider = root.querySelector<HTMLInputElement>("[data-sound-slider]")!,
        mute = root.querySelector<HTMLButtonElement>("[data-sound-mute]")!,
        percent = root.querySelector<HTMLElement>("[data-sound-percent]")!;
      const sync = () => {
        const audio = window.RangbastraAudio!,
          value = Math.round(audio.getVolume() * 100),
          isMuted = audio.isMuted();
        slider.value = String(value);
        slider.style.setProperty("--sound-level", `${isMuted ? 0 : value}%`);
        percent.textContent = isMuted ? "Muted" : `${value}%`;
        mute.textContent = isMuted ? "Unmute" : "Mute";
        mute.setAttribute("aria-pressed", String(isMuted));
        const level = isMuted
          ? "muted"
          : value < 34
            ? "low"
            : value < 67
              ? "medium"
              : "high";
        trigger.dataset.soundLevel = level;
        trigger.setAttribute(
          "aria-label",
          `Website sounds, ${isMuted ? "muted" : `${value} percent`}`,
        );
      };
      const close = () => {
        popover.hidden = true;
        trigger.setAttribute("aria-expanded", "false");
      };
      trigger.addEventListener("click", () => {
        const opening = popover.hidden;
        document
          .querySelectorAll<HTMLElement>("[data-sound-popover]")
          .forEach((item) => (item.hidden = true));
        popover.hidden = !opening;
        trigger.setAttribute("aria-expanded", String(opening));
        if (opening) slider.focus();
      });
      slider.addEventListener("input", () => {
        window.RangbastraAudio?.setVolume(Number(slider.value) / 100);
        sync();
      });
      mute.addEventListener("click", () => {
        window.RangbastraAudio?.setMuted(!window.RangbastraAudio.isMuted());
        sync();
      });
      root
        .querySelector("[data-sound-preview]")
        ?.addEventListener("click", () => window.RangbastraAudio?.preview());
      document.addEventListener("pointerdown", (event) => {
        if (!root.contains(event.target as Node)) close();
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !popover.hidden) {
          close();
          trigger.focus();
        }
      });
      sync();
    });

export const initCoutureInteractions = () => {
  window.RangbastraAudio ??= createAudioController();
  initSoundControls();
  document.querySelectorAll<HTMLElement>(".button").forEach((button) => {
    if (button.dataset.coutureInteraction === "true") return;
    button.dataset.coutureInteraction = "true";
    let cooldown = false;
    const visual = () => {
      if (cooldown) return;
      cooldown = true;
      button.classList.remove("is-shimmering", "is-sparkling");
      void button.offsetWidth;
      button.classList.add("is-shimmering");
      if (button.classList.contains("button--sparkle-enabled"))
        button.classList.add("is-sparkling");
      setTimeout(
        () => button.classList.remove("is-shimmering", "is-sparkling"),
        1750,
      );
      setTimeout(() => (cooldown = false), 2050);
    };
    button.addEventListener("pointerenter", visual);
    button.addEventListener("focus", visual);
    button.addEventListener(
      "pointerdown",
      (event) => {
        if (event.pointerType !== "mouse") visual();
      },
      { passive: true },
    );
    button.addEventListener("click", () => {
      const label = (button.textContent ?? "").trim().toLowerCase();
      if (button.classList.contains("button--whatsapp"))
        window.RangbastraAudio?.whoosh("whatsapp");
      else if (button.classList.contains("button--instagram"))
        window.RangbastraAudio?.whoosh("instagram");
      else if (button.classList.contains("button--cherry"))
        window.RangbastraAudio?.wishlistOpen();
      else if (/design your outfit/.test(label)) {
        window.RangbastraAudio?.creative();
        setTimeout(() => window.RangbastraAudio?.glitter(), 130);
      } else if (/create yours|custom journey/.test(label))
        window.RangbastraAudio?.creative();
      else if (/explore collection/.test(label))
        window.RangbastraAudio?.collection();
      else if (/consultation|book/.test(label))
        window.RangbastraAudio?.consultation();
      else if (/google/.test(label)) window.RangbastraAudio?.google();
    });
  });
  document
    .querySelectorAll<HTMLElement>("[data-selection-sound]")
    .forEach((control) => {
      if (control.dataset.soundReady) return;
      control.dataset.soundReady = "true";
      control.addEventListener("change", () =>
        control.closest("[data-palette-selector]") ||
        control.matches("[data-finder-step]")
          ? window.RangbastraAudio?.selection()
          : control.matches("[data-couture-select]")
            ? window.RangbastraAudio?.dropdown()
            : window.RangbastraAudio?.progress(),
      );
    });
  document.addEventListener("rangbastra:analytics", (event) => {
    const name = (event as CustomEvent<{ name?: string }>).detail?.name;
    if (name === "couture_finder_completed") window.RangbastraAudio?.reveal();
  });
  document.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((link) => {
    if (link.dataset.transitionSoundReady) return;
    link.dataset.transitionSoundReady = "true";
    link.addEventListener("click", (event) => {
      const href = link.href;
      if (/wa\.me|whatsapp/i.test(href))
        window.RangbastraAudio?.whoosh("whatsapp");
      else if (/instagram\.com/i.test(href))
        window.RangbastraAudio?.whoosh("instagram");
      else if (
        link.matches(
          ".navbar a, .mobile-nav a, [data-page-transition-sound]",
        ) &&
        link.getAttribute("href")?.startsWith("/") &&
        !event.defaultPrevented &&
        event.button === 0 &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.shiftKey
      )
        window.RangbastraAudio?.transition();
    });
  });
};
