import { getSupabaseBrowserClient } from "./supabaseBrowser";

export const initAccountNavigation = async () => {
  const links =
    document.querySelectorAll<HTMLAnchorElement>("[data-account-nav]");
  if (!links.length) return;
  try {
    const supabase = getSupabaseBrowserClient();
    const sync = (
      user: { email?: string; user_metadata?: Record<string, unknown> } | null,
    ) => {
      links.forEach((link) => {
        const label = link.querySelector<HTMLElement>(
          "[data-account-nav-label]",
        );
        if (label)
          label.textContent = user
            ? String(user.user_metadata?.full_name ?? user.email ?? "Account")
            : "Sign In";
        link.href = user ? "/account" : "/account/login";
      });
    };
    const { data } = await supabase.auth.getSession();
    sync(data.session?.user ?? null);
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => sync(session?.user ?? null),
    );
    document.addEventListener(
      "astro:before-swap",
      () => subscription.subscription.unsubscribe(),
      { once: true },
    );
  } catch {
    // Signed-out navigation is the safe fallback when public configuration is absent.
  }
};
