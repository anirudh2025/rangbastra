# Experience Pages Route Matrix

Status: Preview branch proposal. Production navigation remains unchanged until founder approval.

| Route | Current navigation label | Current purpose | Duplicate route/content | Intended unique purpose | Primary customer action | Recommendation |
| --- | --- | --- | --- | --- | --- | --- |
| `/custom-couture` | Custom Couture | Passive overview of bespoke work | Overlaps `/design-your-outfit` | Guided couture discovery and brief shaping | Build a starter brief | Differentiate |
| `/design-your-outfit` | Designer Consultation / Begin a Consultation | Detailed enquiry form | Used for both booking and final request | Canonical detailed couture-request form | Submit detailed request | Keep and relabel |
| `/designer-consultation` | Designer Consultation | No dedicated route | Previously pointed to `/design-your-outfit` | Consultation formats, preparation and booking expectations | Choose consultation format | Add and differentiate |
| `/begin-a-consultation` | Begin a Consultation | No dedicated route | Duplicate label for `/design-your-outfit` | Legacy consultation entry point | Reach consultation booking | Redirect permanently to `/designer-consultation` |
| `/customization-process` | Customisation Process | No dedicated route | Previously pointed to `/custom-couture` | Transparent interactive production stages | Explore how an outfit is made | Add and differentiate |
| `/rangbastra-journey` | The Rangbastra Journey | No dedicated route | Previously pointed to `/our-story` | Confirmed brand milestones and future mission | Explore milestones | Add and differentiate |
| `/our-story` | Our Philosophy / Our Story | Founder story and philosophy | Two labels currently target the same page | Canonical brand philosophy and founder story | Understand the brand | Keep; use one navigation label |
| `/bride-stories` | Bride Stories | Editorial-style testimonials | Existing content lacks source/consent model | Consent-aware story index | Read a bride story | Differentiate |
| `/bride-stories/[slug]` | None | No detail route | Story content exists only on listing | Dedicated story, garment and gallery context | Read story / explore related pieces | Add |
| `/lookbook` | Lookbook | Editorial imagery | None material | Visual collection discovery | Explore looks | Keep |
| `/journal` | Journal | Educational editorial content | None material | Read couture guidance | Read article | Keep |
| `/contact` | Contact | General contact | Some overlap with consultation | General enquiries only | Contact the team | Keep |
| `/faq` | Frequently Asked Questions | General support | None material | Resolve common questions | Find an answer | Keep |

## Consolidation decision

`Designer Consultation` becomes `/designer-consultation`. `Begin a Consultation` is removed from navigation, and the legacy route redirects to the canonical consultation page. `/design-your-outfit` remains the final detailed request rather than a booking page.
