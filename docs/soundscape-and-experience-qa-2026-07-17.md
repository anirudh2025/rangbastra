# Soundscape and Experience QA — 2026-07-17

## Sound architecture

Rangbastra uses one shared, synthesis-based Web Audio controller. It creates no audio element, requests no microphone permission, loads no third-party media, and creates its `AudioContext` only when a deliberate action calls a sound. A master gain feeds a dynamics compressor/limiter. Every cue is rate-limited and stops prior voices before playing, preventing sound pile-up. The experience remains fully functional when Web Audio is unsupported, blocked, or muted.

Preferences use `rangbastraSound` and `rangbastraVolume` in local storage. The local setting applies immediately. Volume supports 0–100; zero is treated as muted.

## Semantic map

| Interaction | Sound character |
| --- | --- |
| Design Your Outfit | Fabric-noise gesture followed by creative shimmer |
| Create Yours | Pencil/fabric gesture |
| Explore Collection | Silk reveal |
| Save Inspiration | Warm ascending heart confirmation |
| Remove Inspiration | Softer descending heart release |
| Open Wishlist | Gentle unfolding reveal |
| WhatsApp | Short forward push |
| Instagram | Airy high-frequency swipe and crystalline finish |
| Palette selection | Quiet colour-drop tone |
| Completed product-image swipe | Very quiet filtered fabric slide |
| Custom dropdown | Small descending selection tick |
| Couture Finder progression | Gentle rising progress tone; result uses a brief reveal |
| Book Consultation | Calm two-note confirmation |
| Form success | Verified three-note resolution |
| Form error | Muted low triangle response |
| Google sign-in | Neutral transition |
| Account sign-in success | Warm two-note private-portal welcome |
| Sign out | Soft descending closure |
| User-initiated internal navigation | Very quiet silk transition |
| Craft detail reveal | Brief restrained atmospheric reveal |

No sound is attached to hover, scroll, cursor movement, text input, direct page load, or an ambient soundtrack.

## Volume controls

Desktop uses the utility-navigation volume icon. Mobile exposes the same control inside the expanded navigation. Both open a black/cocoa glass panel with a 0–100 slider, mute/unmute, current state, and preview. Escape and outside click close the panel. Controls meet the 44px target and expose names, expanded state, slider value, and mute state to assistive technology.

## Homepage structure

Hero → Live Featured Couture → Couture Finder → Rangbastra Difference → Interactive Craft Details → Six-Step Journey → Personal Invitation → Footer.

## Release guardrails

- Confirm sound character and perceived loudness on real iOS Safari, Android Chrome, macOS Safari, and Windows Chrome before production approval.
- Run Lighthouse against a production-like HTTPS deployment for final performance, accessibility, best-practices, and SEO scores.
- Reintroduce homepage Bride Stories only after consent, attribution, and image provenance are verified.
- If signed-in sound preference sync is later added, local preference must remain authoritative until profile retrieval completes.
