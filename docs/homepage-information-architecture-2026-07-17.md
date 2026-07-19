# Homepage Information Architecture — 2026-07-17

## Strategic intent

The homepage should move a visitor through one continuous decision journey: desire, recognition, guided discovery, trust, process clarity, and a personal invitation to begin. Product browsing and customization remain available throughout, but the page has one primary conversion path rather than several competing endings.

## Section audit and decision record

| Previous section | Visitor question | Unique value | Repetition or weakness | CTA role | Decision and new destination |
| --- | --- | --- | --- | --- | --- |
| Hero | Is this world for me? | Immediate brand desire and emotional permission | None; strongest opener | Explore and begin | Retained first |
| Featured Collections | What can I wear? | Product recognition by occasion | Used separate editorial records instead of the current catalogue | Open a piece | Retained, now powered by published couture data |
| Journey | What happens if I begin? | Makes an unfamiliar couture process legible | Overlapped with Atelier Experience | Learn the process | Retained later and expanded to six concrete stages |
| Atelier Experience | Who will guide me? | Personal service and fittings | Repeated Journey and Signature Customization | Visit or consult | Merged into Rangbastra Difference and Journey |
| Bride Stories | Has this worked for someone like me? | Potential social proof | Current records do not contain verification or consent provenance | Explore stories | Removed from the homepage pending verified client attribution; route and content remain intact |
| Craftsmanship | Why is this worth trusting? | Handwork and material detail | Overlapped with Signature Customization and remained mostly declarative | Learn craft | Merged into Rangbastra Difference and interactive Craft Details |
| Signature Customization | Can this become mine? | Personalization promise | Repeated Atelier and Craftsmanship | Customize | Merged into Difference and product-led invitation |
| Editorial Lookbook | What else can I browse? | Visual discovery | Restarted browsing late, after the page had begun explaining conversion | Explore lookbook | Removed from homepage; dedicated route remains in navigation |
| Consultation Invitation | What should I do next? | Clear human handoff | Previously generic and disconnected from earlier browsing | Begin consultation | Retained as the single primary close, now context-aware |

## New homepage order

1. Hero — desire and emotional permission.
2. Featured Couture — recognition through live product data.
3. Couture Finder — three-question guided discovery.
4. The Rangbastra Difference — concise proof of service, personalization and handcraft.
5. Craft Details — interactive, product-grounded material education.
6. Your Rangbastra Journey — six-step process clarity from vision to celebration.
7. Personal Invitation — context-aware customization or consultation handoff.
8. Editorial Footer — quiet brand close and secondary navigation.

## Measurement and privacy

Homepage measurement uses a small event vocabulary: `collection_selected`, `product_opened`, `couture_finder_completed`, `product_saved`, `customization_started`, `consultation_submitted`, `bride_story_explored`, and `craft_detail_explored`. Only anonymous interaction dimensions such as product slug, category, occasion, feeling, detail, and source are eligible. The implementation forwards events only when an existing `dataLayer` is present; it introduces no tracker, cookie, fingerprint, or network request.

## Editorial guardrails

- Add Bride Stories back to the homepage only after each published story has confirmed consent, attribution, and source-image provenance.
- Keep Featured Couture connected to the published product catalogue rather than maintaining parallel homepage product data.
- Treat the Personal Invitation as the only dominant closing action; Instagram, saved inspirations, WhatsApp and account access remain secondary.
- Review finder choices against actual consultation language and catalogue coverage as the product assortment changes.

## Documentation recommendation

If this homepage spine is approved as permanent, record the section order and single-primary-conversion principle in the architecture decision log and changelog.
