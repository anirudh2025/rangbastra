export function initializeNavbar(): void {
  const navbar = document.querySelector<HTMLElement>("[data-navbar]");
  const button = document.querySelector<HTMLButtonElement>("[data-menu-button]");
  const menu = document.querySelector<HTMLElement>("[data-mobile-nav]");

  if (!navbar || !button || !menu) return;

  const mobileBreakpoint = window.matchMedia("(max-width: 768px)");

  let isOpen = false;

  const updateState = () => {
    navbar.dataset.menuOpen = String(isOpen);

    navbar.classList.toggle("navbar--menu-open", isOpen);

    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    menu.setAttribute("aria-hidden", String(!isOpen));

    document.body.classList.toggle("menu-open", isOpen);
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
      closeMenu();
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