export function initializeNavbar(): void {
  const navbar = document.querySelector<HTMLElement>("[data-navbar]");
  const button = document.querySelector<HTMLButtonElement>("[data-menu-button]");
  const menu = document.querySelector<HTMLElement>("[data-mobile-nav]");

  if (!navbar || !button || !menu) return;

  const mobileBreakpoint = window.matchMedia("(max-width: 1120px)");

  let isOpen = false;
  let scrollFrame = 0;
  let closeTimer = 0;

  const syncScrollState = () => {
    scrollFrame = 0;
    navbar.classList.toggle("navbar--scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(syncScrollState);
  }, { passive: true });
  syncScrollState();

  const closeDropdowns = (except?: HTMLElement) => {
    navbar.querySelectorAll<HTMLElement>("[data-nav-group]").forEach((group) => {
      if (group === except) return;
      group.classList.remove("is-open");
      group.querySelector<HTMLButtonElement>("[data-dropdown-trigger]")?.setAttribute("aria-expanded", "false");
      const dropdown = group.querySelector<HTMLElement>("[data-dropdown]");
      if (dropdown) dropdown.hidden = true;
    });
  };

  const openDropdown = (group: HTMLElement) => {
    window.clearTimeout(closeTimer);
    closeDropdowns(group);
    group.classList.add("is-open");
    group.querySelector<HTMLButtonElement>("[data-dropdown-trigger]")?.setAttribute("aria-expanded", "true");
    const dropdown = group.querySelector<HTMLElement>("[data-dropdown]");
    if (dropdown) dropdown.hidden = false;
  };

  navbar.querySelectorAll<HTMLElement>("[data-nav-group]").forEach((group) => {
    const trigger = group.querySelector<HTMLButtonElement>("[data-dropdown-trigger]");
    group.addEventListener("pointerenter", () => {if(matchMedia("(hover:hover) and (pointer:fine)").matches)openDropdown(group)});
    group.addEventListener("pointerleave", () => { if(matchMedia("(hover:hover) and (pointer:fine)").matches)closeTimer = window.setTimeout(() => closeDropdowns(), 180); });
    group.addEventListener("focusin", () => openDropdown(group));
    group.addEventListener("focusout", (event) => { if (!group.contains(event.relatedTarget as Node)) closeDropdowns(); });
    trigger?.addEventListener("click", () => group.classList.contains("is-open") ? closeDropdowns() : openDropdown(group));
    trigger?.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") { event.preventDefault(); openDropdown(group); group.querySelector<HTMLAnchorElement>("[data-dropdown] a")?.focus(); }
      if (event.key === "ArrowUp") { event.preventDefault(); openDropdown(group); const links=group.querySelectorAll<HTMLAnchorElement>("[data-dropdown] a");links[links.length-1]?.focus(); }
    });
    group.querySelector<HTMLElement>("[data-dropdown]")?.addEventListener("keydown",event=>{const links=[...group.querySelectorAll<HTMLAnchorElement>("[data-dropdown] a")],index=links.indexOf(document.activeElement as HTMLAnchorElement);if(event.key==="ArrowDown"||event.key==="ArrowUp"){event.preventDefault();links[(index+(event.key==="ArrowDown"?1:-1)+links.length)%links.length]?.focus()}else if(event.key==="Escape"){event.preventDefault();closeDropdowns();trigger?.focus()}});
  });

  const updateState = () => {
    navbar.dataset.menuOpen = String(isOpen);

    navbar.classList.toggle("navbar--menu-open", isOpen);

    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    menu.setAttribute("aria-hidden", String(!isOpen));
    menu.toggleAttribute("inert", !isOpen);

    document.body.classList.toggle("menu-open", isOpen);
    document.documentElement.classList.toggle("menu-open", isOpen);
  };

  const openMenu = () => {
    if (!mobileBreakpoint.matches || isOpen) return;

    isOpen = true;
    updateState();
  };

  const closeMenu = () => {
    if (!isOpen) return;

    isOpen = false;
    updateState();
  };

  const toggleMenu = () => {
    isOpen ? closeMenu() : openMenu();
  };

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleMenu();
  });

  document.addEventListener("click", (event) => {
    if (!isOpen) return;

    const target = event.target as Node;

    if (!navbar.contains(target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const openTrigger = navbar.querySelector<HTMLButtonElement>("[data-dropdown-trigger][aria-expanded='true']");
      closeDropdowns();
      closeMenu();
      openTrigger?.focus({ preventScroll: true });
    }
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  mobileBreakpoint.addEventListener("change", () => {
    closeMenu();
  });

  updateState();
}
