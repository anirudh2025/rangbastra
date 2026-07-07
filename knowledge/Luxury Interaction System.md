# RANGBASTRA.LUXURY

# LUXURY INTERACTION SYSTEM

Version: 1.0  
Status: Core Creative System  
Owner: Anirudh  

---

## Purpose

This document defines how Rangbastra should feel through interaction.

It governs hover states, CTA behavior, image motion, cards, scroll reveals, page transitions, modals, lightboxes, forms, success states and future GSAP animation.

This system exists so no AI or developer has to guess what “premium interaction” means.

---

## Core Principle

Luxury interaction is not decoration.

Luxury interaction is confidence.

Every motion should feel:

- smooth
- intentional
- quiet
- editorial
- responsive
- memorable

Never playful.  
Never bouncy.  
Never flashy.  
Never random.

---

## Interaction Personality

Rangbastra interactions should feel like:

- a silk curtain moving
- a couture box opening
- a page turning in a fashion magazine
- a spotlight slowly revealing embroidery
- a private invitation being extended

They should never feel like:

- gaming UI
- SaaS dashboards
- ecommerce urgency
- social media effects
- template animations

---

## CTA Interaction System

CTA buttons are invitations, not software buttons.

Primary CTA behavior:

Default:

- gradient surface
- calm depth
- strong readability
- premium shadow
- editorial spacing

Hover:

- main button shifts slightly left
- sparkle icon appears on the right
- sparkle sits inside a separate circular/square companion badge
- motion should feel connected, not detached
- button becomes slightly darker, not lighter
- sparkle may rotate subtly
- transition should feel smooth and deliberate

The hover reference:

Button

↓

Button shifts left + sparkle appears right

This becomes the official Rangbastra primary CTA interaction.

---

## CTA Rules

All primary CTAs should share one interaction language.

Do not create different hover behavior for each section.

Primary CTA examples:

- Begin Your Custom Design
- Design Your Outfit
- Explore Collections
- Explore Piece
- Reserve Your Experience

Avoid:

- Book Consultation
- Contact Us
- Submit
- Buy Now
- Add to Cart

---

## Secondary CTA System

Secondary CTAs should be quieter.

They may use:

- underline reveal
- subtle border
- soft opacity change
- small icon movement

They should never compete with the primary CTA.

---

## Card Interaction System

Cards should not jump.

Cards should not bounce.

Cards should not glow aggressively.

Card hover may use:

- subtle translateY
- subtle image scale
- border highlight
- soft shadow
- text reveal
- icon drift

Avoid:

- large lift
- strong scale
- blur animation
- bright glow
- rotating cards
- sudden brightness changes

---

## Image Interaction System

Images should feel alive, not animated.

Image motion may include:

- slow scale
- subtle parallax
- reveal from darkness
- soft opacity transition
- frame expansion

Avoid:

- fast zoom
- heavy filter changes
- blur animation
- layout-shifting reveals
- aggressive hover crop

Photography must remain premium and stable.

---

## Scroll Reveal System

Scroll reveals should guide attention.

Use:

- opacity
- translateY
- clip reveal
- staggered typography
- slow editorial entrance

Avoid:

- blur-heavy reveals
- excessive delay
- every element animating
- repeated identical reveal patterns

Not every element needs animation.

Silence is part of luxury.

---

## Typography Interaction

Typography can animate when it adds emotion.

Allowed:

- line reveal
- word reveal
- soft fade
- subtle tracking shift
- editorial stagger

Avoid:

- typewriter effects everywhere
- bouncing letters
- spinning text
- flashing gradients

Typography must feel composed.

---

## Lightbox Interaction

Lightbox should feel cinematic.

Requirements:

- fullscreen dark experience
- smooth open/close
- keyboard navigation
- swipe support
- image counter
- editorial captions
- no browser-default feeling

Lightbox motion should feel like entering a private viewing room.

---

## Form Interaction System

Forms should feel like guided conversation.

Not administration.

Fields should have:

- clear label
- premium focus state
- calm error state
- soft validation feedback
- accessible keyboard behavior

Avoid:

- harsh red errors
- aggressive warnings
- cramped inputs
- generic form styling

Submission states should feel reassuring.

---

## Success State

After enquiry submission, success should feel emotional.

Not:

“Form submitted.”

Use language like:

“Your story has reached our atelier.”

or

“We have received your couture note.”

Success motion:

- gentle fade
- calm confirmation
- no confetti
- no loud animation

---

## Navigation Interaction

Navigation should feel stable.

Hover may use:

- subtle text color shift
- understated underline
- soft glow
- icon drift if present

Avoid:

- big movement
- heavy scaling
- distracting active states

Navigation should never compete with the page.

---

## Page Transition Philosophy

Future GSAP page transitions should feel editorial.

Possible metaphors:

- curtain reveal
- magazine page turn
- light passing over fabric
- image fading into black
- chapter title reveal

Avoid:

- loader gimmicks
- spinning logos
- progress bars unless meaningful
- overbuilt transitions

---

## Reduced Motion

Reduced motion must always be respected.

When enabled:

- remove large movement
- remove parallax
- remove hover transforms
- keep opacity transitions minimal
- keep usability intact

Luxury includes accessibility.

---

## Performance Rules

Never animate layout-heavy properties unless unavoidable.

Prefer:

- transform
- opacity
- clip-path when controlled
- CSS variables
- motion tokens

Avoid animating:

- width
- height
- top
- left
- margin
- padding
- heavy filters
- large box-shadow changes

Use `will-change` only for intentional isolated elements.

Never apply it globally.

---

## Timing Philosophy

Luxury motion is calm.

Recommended ranges:

- Micro hover: 220ms–320ms
- CTA hover: 320ms–520ms
- Image reveal: 600ms–900ms
- Section reveal: 700ms–1100ms
- Page transition: 900ms–1400ms

Use easing that feels smooth and confident.

Avoid elastic, bounce or playful easing.

---

## Signature Interactions

Every major experience should have one signature interaction.

Examples:

- Homepage: cinematic hero reveal
- Collections: curated rail movement
- Couture Experience: image/story reveal
- Design Your Outfit: guided form progression
- Lookbook: cinematic lightbox
- Bride Stories: handwritten memory reveal
- Journal: magazine page rhythm

If every page uses the same interaction, the system has failed.

---

## Interaction Approval Test

Before approving an interaction, ask:

- Does it feel calm?
- Does it guide attention?
- Does it improve understanding?
- Does it feel premium?
- Is it accessible?
- Is it performant?
- Would Apple remove it?
- Would Dior simplify it?
- Would Rangbastra feel more memorable with it?

If not, remove or refine it.

---

## Final Rule

Interaction should never shout.

It should invite.

Rangbastra should feel like a couture maison where every movement is deliberate, quiet and unforgettable.