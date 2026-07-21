import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "./supabaseBrowser";

// The visible Google control uses Supabase OAuth below. No direct Google
// Identity Services client is required in the browser.

const safeMessage = (error: unknown, fallback: string) => {
  if (import.meta.env.DEV && error instanceof Error)
    console.error("Rangbastra auth:", error.message);
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (message.includes("network") || message.includes("fetch"))
    return "We could not reach the secure account service. Check your connection and try again.";
  if (message.includes("invalid login"))
    return "That email and password combination was not recognized.";
  if (message.includes("configured"))
    return "Account access is not configured yet. Please contact Rangbastra.";
  return fallback;
};
const getSafeNext = () => {
  const next = new URLSearchParams(location.search).get("next");
  return next?.startsWith("/") && !next.startsWith("//") ? next : "/account";
};

export const initAccountExperience = async () => {
  const root = document.querySelector<HTMLElement>(".account-room");
  if (!root || root.dataset.authReady) return;
  root.dataset.authReady = "true";
  const note = root.querySelector<HTMLElement>("[data-account-note]");
  let supabase;
  try {
    supabase = getSupabaseBrowserClient();
  } catch (error) {
    if (note)
      note.textContent = safeMessage(
        error,
        "Account access is not configured yet.",
      );
    root
      .querySelector<HTMLButtonElement>(".google-auth")
      ?.addEventListener("click", () => {
        if (note)
          note.textContent = "Google sign-in configuration is unavailable.";
      });
    return;
  }

  root
    .querySelectorAll<HTMLButtonElement>("[data-password-toggle]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        const input =
          button.parentElement?.querySelector<HTMLInputElement>("input");
        if (!input) return;
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        button.textContent = show ? "Hide" : "Show";
        button.setAttribute("aria-label", `${show ? "Hide" : "Show"} password`);
      }),
    );

  const form = root.querySelector<HTMLFormElement>("[data-account-form]");
  if (form && note) {
    let submitting = false;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (submitting) return;
      const values = new FormData(form),
        email = String(values.get("email") ?? "").trim(),
        password = String(values.get("password") ?? "");
      if (
        form.dataset.mode === "signup" &&
        password !== String(values.get("confirmPassword") ?? "")
      ) {
        note.textContent = "Passwords must match.";
        return;
      }
      submitting = true;
      const submit = form.querySelector<HTMLButtonElement>(
        'button[type="submit"]',
      );
      if (submit) submit.disabled = true;
      note.textContent = "Preparing secure access…";
      try {
        if (form.dataset.mode === "signup") {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: String(values.get("name") ?? ""),
                phone: String(values.get("phone") ?? ""),
              },
            },
          });
          if (error) throw error;
          note.textContent =
            "Check your email to verify and activate your client room.";
        } else {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          window.RangbastraAudio?.portal();
          location.assign(getSafeNext());
        }
      } catch (error) {
        note.textContent = safeMessage(
          error,
          "We could not complete sign-in. Please try again.",
        );
      } finally {
        submitting = false;
        if (submit) submit.disabled = false;
      }
    });
    root
      .querySelector<HTMLButtonElement>("[data-forgot]")
      ?.addEventListener("click", async () => {
        const email = String(new FormData(form).get("email") ?? "").trim();
        if (!email) {
          note.textContent = "Enter your email first.";
          return;
        }
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${location.origin}/account/login`,
        });
        note.textContent = error
          ? safeMessage(error, "We could not send the recovery email.")
          : "A password recovery link is on its way.";
      });

    /* Retired direct-GIS implementation retained temporarily for history only.
    const googleHost = root.querySelector<HTMLElement>("[data-google-button]");
    const clientId = import.meta.env.PUBLIC_GOOGLE_CLIENT_ID;
    if (googleHost && clientId) {
      try {
        await loadGoogleIdentity();
        const { nonce, hashedNonce } = await createNonce();
        window.google!.accounts.id.initialize({
          client_id: clientId,
          nonce: hashedNonce,
          ux_mode: "popup",
          use_fedcm_for_prompt: true,
          context: "signin",
          callback: async (response: { credential?: string }) => {
            if (!response.credential) {
              note.textContent = "Google sign-in was closed before completion.";
              return;
            }
            note.textContent = "Completing secure Google sign-in…";
            const { error } = await supabase.auth.signInWithIdToken({
              provider: "google",
              token: response.credential,
              nonce,
            });
            if (error) {
              note.textContent = safeMessage(
                error,
                "Google authentication could not be completed.",
              );
              return;
            }
            window.RangbastraAudio?.success();
            note.textContent = "Welcome to your private client room.";
            location.assign(getSafeNext());
          },
        });
        window.google!.accounts.id.renderButton(googleHost, {
          type: "standard",
          theme: "filled_black",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          width: Math.min(400, Math.floor(googleHost.clientWidth || 400)),
        });
      } catch (error) {
        note.textContent = safeMessage(
          error,
          "Google authentication is temporarily unavailable.",
        );
      }
    } else if (googleHost)
      note.textContent = "Google account access is not configured yet.";
    */

    let googleBusy = false;
    root
      .querySelector<HTMLButtonElement>(".google-auth")
      ?.addEventListener("click", async (event) => {
        if (googleBusy) return;
        googleBusy = true;
        const button = event.currentTarget as HTMLButtonElement;
        button.disabled = true;
        note.textContent = "Opening Google’s secure sign-in…";
        const next = getSafeNext();
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });
        if (error) {
          googleBusy = false;
          button.disabled = false;
          note.textContent = safeMessage(
            error,
            "Google authentication could not be started.",
          );
        }
      });
  }

  const dashboard = root.querySelector<HTMLElement>("[data-account-dashboard]");
  const allowedPanels = new Set([
    "overview",
    "profile",
    "saved",
    "requests",
    "appointments",
    "settings",
  ]);
  const openPanel = (requested?: string | null) => {
    if (!dashboard) return;
    const panel = requested && allowedPanels.has(requested) ? requested : "overview";
    dashboard.querySelectorAll<HTMLElement>("[data-dashboard-panel]").forEach(
      (item) => (item.hidden = item.dataset.dashboardPanel !== panel),
    );
    dashboard.querySelectorAll<HTMLElement>("[data-dashboard-tab]").forEach((item) =>
      item.classList.toggle("is-active", item.dataset.dashboardTab === panel),
    );
    dashboard.querySelector<HTMLElement>(`[data-dashboard-panel="${panel}"]`)?.focus({
      preventScroll: true,
    });
  };
  dashboard?.querySelectorAll<HTMLAnchorElement>("[data-dashboard-tab]").forEach((link) =>
    link.addEventListener("click", () => openPanel(link.dataset.dashboardTab)),
  );
  dashboard?.querySelectorAll<HTMLAnchorElement>("[data-dashboard-open]").forEach((link) =>
    link.addEventListener("click", () => openPanel(link.dataset.dashboardOpen)),
  );
  dashboard?.querySelector<HTMLAnchorElement>(".dashboard-open-saved")?.addEventListener(
    "click",
    () => openPanel("saved"),
  );
  openPanel(location.hash.slice(1));
  window.addEventListener("hashchange", () => openPanel(location.hash.slice(1)));

  const escapeHtml = (value: unknown) =>
    String(value ?? "").replace(
      /[&<>'"]/g,
      (character) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
          character
        ] ?? character,
    );

  const loadPrivateDashboard = async (user: User) => {
    if (!dashboard) return;
    const profileForm = dashboard.querySelector<HTMLFormElement>("[data-profile-form]");
    const [profileResult, savedResult, requestResult] = await Promise.all([
      supabase
        .from("profiles")
        .select("full_name,phone,city,country,preferred_contact_method,marketing_consent")
        .eq("id", user.id)
        .maybeSingle(),
      supabase.from("saved_inspirations").select("id", { count: "exact", head: true }),
      supabase
        .from("customization_requests")
        .select("id,reference_number,product_name_snapshot,status,created_at")
        .order("created_at", { ascending: false }),
    ]);

    const savedCount = dashboard.querySelector<HTMLElement>("[data-saved-count]");
    if (savedCount) savedCount.textContent = String(savedResult.count ?? 0);

    const requests = requestResult.data ?? [];
    const requestCount = dashboard.querySelector<HTMLElement>("[data-request-count]");
    if (requestCount) requestCount.textContent = String(requests.length);
    const requestList = dashboard.querySelector<HTMLElement>("[data-request-list]");
    if (requestList) {
      requestList.innerHTML = requests
        .map(
          (request) =>
            `<article><div><span>${escapeHtml(request.reference_number)}</span><strong>${escapeHtml(request.product_name_snapshot)}</strong></div><span class="request-status">${escapeHtml(String(request.status).replaceAll("_", " "))}</span><p>${new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(request.created_at))}</p></article>`,
        )
        .join("");
    }
    const requestEmpty = dashboard.querySelector<HTMLElement>("[data-request-empty]");
    if (requestEmpty) requestEmpty.hidden = requests.length > 0;

    if (profileForm) {
      profileForm.hidden = false;
      const profile = profileResult.data ?? {};
      Object.entries(profile).forEach(([name, value]) => {
        const field = profileForm.elements.namedItem(name);
        if (field instanceof HTMLInputElement) {
          if (field.type === "checkbox") field.checked = Boolean(value);
          else field.value = String(value ?? "");
        }
      });
      if (!profileForm.dataset.ready) {
        profileForm.dataset.ready = "true";
        profileForm.addEventListener("submit", async (event) => {
          event.preventDefault();
          const values = new FormData(profileForm);
          const payload = {
            full_name: String(values.get("full_name") ?? "").trim() || null,
            phone: String(values.get("phone") ?? "").trim() || null,
            city: String(values.get("city") ?? "").trim() || null,
            country: String(values.get("country") ?? "").trim() || null,
            preferred_contact_method:
              String(values.get("preferred_contact_method") ?? "").trim() || null,
            marketing_consent: values.get("marketing_consent") === "on",
            marketing_consent_at:
              values.get("marketing_consent") === "on" ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          };
          const profileNote = profileForm.querySelector<HTMLElement>("[data-profile-note]");
          const { error } = await supabase.from("profiles").update(payload).eq("id", user.id);
          if (profileNote)
            profileNote.textContent = error
              ? "We could not save your profile. Please try again."
              : "Your profile has been updated securely.";
        });
      }
    }
  };

  const renderUser = (user: User | null) => {
    if (!dashboard) return;
    const identity = dashboard.querySelector<HTMLElement>(
        "[data-account-identity]",
      ),
      avatar = dashboard.querySelector<HTMLImageElement>(
        "[data-account-avatar]",
      ),
      signout = dashboard.querySelector<HTMLButtonElement>("[data-signout]");
    dashboard
      .querySelectorAll<HTMLElement>(".account-login")
      .forEach((item) => (item.hidden = Boolean(user)));
    if (signout) signout.hidden = !user;
    if (identity)
      identity.textContent = user
        ? `${String(user.user_metadata.full_name ?? user.user_metadata.name ?? "Rangbastra client")} · ${user.email ?? ""}`
        : "Sign in or create an account to enter your private dashboard.";
    const picture =
      user?.user_metadata.avatar_url ?? user?.user_metadata.picture;
    if (avatar) {
      avatar.hidden = !picture;
      if (picture) avatar.src = String(picture);
    }
    if (user) void loadPrivateDashboard(user);
  };
  const { data, error } = await supabase.auth.getSession();
  if (error && dashboard)
    dashboard.querySelector<HTMLElement>(
      "[data-account-identity]",
    )!.textContent = "We could not restore your session. Please sign in again.";
  renderUser(data.session?.user ?? null);
  dashboard
    ?.querySelector<HTMLButtonElement>("[data-signout]")
    ?.addEventListener("click", () => {
      document.querySelector<HTMLDialogElement>("[data-logout-dialog]")?.showModal();
    });
  const { data: authListener } = supabase.auth.onAuthStateChange(
    (_event, session) => renderUser(session?.user ?? null),
  );
  document.addEventListener(
    "astro:before-swap",
    () => {
      authListener.subscription.unsubscribe();
    },
    { once: true },
  );
};
