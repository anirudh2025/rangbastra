import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "./supabaseBrowser";

const privateCacheKeys = [
  "rangbastra-account-cache",
  "rangbastra-account-profile",
  "rangbastra-account-notifications",
];

const safeReturnPath = () =>
  `${location.pathname}${location.search}${location.hash}`.startsWith("/account/")
    ? "/account"
    : `${location.pathname}${location.search}${location.hash}`;

const displayName = (user: User) => {
  const raw = String(
    user.user_metadata?.display_name ??
      user.user_metadata?.full_name ??
      user.user_metadata?.name ??
      user.email?.split("@")[0] ??
      "Account",
  ).trim();
  return raw.split(/\s+/)[0] || "Account";
};

const setAvatar = (host: HTMLElement, user: User) => {
  const source = user.user_metadata?.avatar_url ?? user.user_metadata?.picture;
  host.replaceChildren();
  if (typeof source === "string" && /^https:\/\//.test(source)) {
    const image = document.createElement("img");
    image.src = source;
    image.alt = "";
    image.referrerPolicy = "no-referrer";
    host.append(image);
  } else {
    host.textContent = displayName(user).slice(0, 1).toUpperCase();
  }
};

export const initAccountNavigation = async () => {
  const pending = [...document.querySelectorAll<HTMLElement>("[data-auth-pending]")];
  const signedOut = [...document.querySelectorAll<HTMLElement>("[data-auth-signed-out]")];
  const signedIn = [...document.querySelectorAll<HTMLElement>("[data-auth-signed-in]")];
  if (!pending.length && !signedOut.length && !signedIn.length) return;

  const reveal = (user: User | null) => {
    pending.forEach((item) => (item.hidden = true));
    signedOut.forEach((item) => (item.hidden = Boolean(user)));
    signedIn.forEach((item) => (item.hidden = !user));
    document.documentElement.dataset.authState = user ? "signed-in" : "signed-out";
    document.querySelectorAll<HTMLElement>("[data-auth-name]").forEach((item) => {
      item.textContent = user ? displayName(user) : "Account";
    });
    if (user)
      document.querySelectorAll<HTMLElement>("[data-auth-avatar]").forEach((item) => setAvatar(item, user));
  };

  const next = encodeURIComponent(safeReturnPath());
  document.querySelectorAll<HTMLAnchorElement>("[data-auth-login]").forEach((link) => (link.href = `/account/login?next=${next}`));
  document.querySelectorAll<HTMLAnchorElement>("[data-auth-signup]").forEach((link) => (link.href = `/account/signup?next=${next}`));

  const dialog = document.querySelector<HTMLDialogElement>("[data-logout-dialog]");
  let logoutTrigger: HTMLElement | null = null;
  document.querySelectorAll<HTMLButtonElement>("[data-auth-logout]").forEach((button) =>
    button.addEventListener("click", () => {
      logoutTrigger = button;
      dialog?.showModal();
    }),
  );
  dialog?.querySelector<HTMLButtonElement>("[data-logout-cancel]")?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("close", () => logoutTrigger?.focus());

  try {
    const supabase = getSupabaseBrowserClient();
    dialog?.querySelector<HTMLButtonElement>("[data-logout-confirm]")?.addEventListener("click", async () => {
      const confirm = dialog.querySelector<HTMLButtonElement>("[data-logout-confirm]")!;
      confirm.disabled = true;
      const { error } = await supabase.auth.signOut({ scope: "local" });
      confirm.disabled = false;
      if (error) return;
      privateCacheKeys.forEach((key) => sessionStorage.removeItem(key));
      dialog.close();
      reveal(null);
      location.assign("/");
    });
    const { data, error } = await supabase.auth.getSession();
    reveal(error ? null : (data.session?.user ?? null));
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => reveal(session?.user ?? null));
    document.addEventListener("astro:before-swap", () => subscription.subscription.unsubscribe(), { once: true });
  } catch {
    reveal(null);
  }
};
