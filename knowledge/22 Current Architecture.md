# RANGBASTRA.LUXURY — CURRENT ARCHITECTURE

Status: Production structure after July 2026 cleanup

## Application flow

`src/pages` defines routes. Route files compose page-specific experiences through `BaseLayout` or `PageLayout`. `BaseLayout` owns global CSS, SEO, navigation and the page transition.

## Homepage

`src/pages/index.astro` is composition-only. Its rendered sequence is:

1. `src/sections/home/Hero.astro`
2. `src/components/layout/HomepageAtmosphere.astro`
3. `src/sections/home/FeaturedCollections.astro`
4. `src/components/journey/Journey.astro`
5. `src/sections/home/AtelierExperience.astro`
6. `src/sections/home/BrideStories.astro`
7. `src/sections/home/Craftsmanship.astro`
8. `src/sections/home/SignatureCustomization.astro`
9. `src/sections/home/EditorialLookbook.astro`
10. `src/sections/home/LuxuryConsultationCTA.astro`
11. `src/sections/home/Footer.astro`

The Hero has one active markup/style owner, `Hero.astro`, and one substantial interaction controller, `src/lib/animations/livingHero.ts`. The homepage cursor is intentionally separate because it crosses section boundaries; its view is `HomepageAtmosphere.astro` and its controller is `src/lib/animations/homepageGlow.ts`.

## Shared systems

- `src/components/primitives`: reusable UI foundations.
- `src/components/navigation`: shared Navbar system.
- `src/components/layout`: SEO and cross-section presentation layers.
- `src/styles/foundation`: global color, typography, spacing, accessibility and layer tokens.
- `src/styles/motion`: shared motion tokens and reusable global motion rules.
- `src/styles/tokens`: component-system tokens used across routes.
- `src/data`: typed business and editorial content.
- `src/lib`: shared domain, navigation and substantial interaction controllers.
- `src/data/analytics` and `src/lib/analytics`: extensible performance-report data and behavior.

## Rules

- A route composes experiences; it does not own section styling.
- A homepage section has one obvious primary Astro component.
- Small behavior and responsive CSS stay scoped with the component.
- Separate controllers are reserved for substantial logic or cross-section systems.
- Files are removed only after inbound-reference and production-build verification.
