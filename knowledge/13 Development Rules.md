# RANGBASTRA.LUXURY

# DEVELOPMENT RULES

Version: 1.0

Last Updated: June 2026

Status: Production Ready

Owner: Cloutora

---

# PURPOSE

Define the engineering standards for Rangbastra.luxury.

Every developer and every AI assistant must follow these rules without exception.

Consistency is more important than personal preference.

---

# DEVELOPMENT PHILOSOPHY

Business

↓

Experience

↓

Architecture

↓

Components

↓

Code

↓

Optimization

Never reverse this order.

---

# CORE PRINCIPLES

Single Responsibility

Composition Over Complexity

Readability First

Maintainability First

Performance By Default

Accessibility By Default

Documentation Before Implementation

---

# TECHNOLOGY STACK

Framework: Astro

Styling: Tailwind CSS

Animations: GSAP

Content: Astro Content Collections

Media: Cloudinary

Language: TypeScript

Deployment: Vercel

Version Control: Git

---

# FILE NAMING

Documentation: Title Case

Example:

04 Component Library.md

---

Components: PascalCase

HeroSection.astro

LuxuryButton.astro

CollectionCard.astro

---

Variables: camelCase

heroTitle

productCollection

featuredImage

---

Constants: UPPER_CASE

MAX_WIDTH

DEFAULT_DURATION

PRIMARY_GRADIENT

---

Assets: kebab-case

hero-video.webm

founder-image.avif

bridal-lookbook.webp

---

Folders: lowercase

components

sections

layouts

animations

styles

utils

---

# COMPONENT RULES

One Component

↓

One Responsibility

Maximum component size: 300 lines

If larger, split into smaller components.

---

# PAGE RULES

Pages compose experiences.

Pages never contain business logic.

Pages orchestrate components only.

---

# BUSINESS LOGIC

Never inside components.

Never inside pages.

Keep logic isolated and reusable.

---

# STYLING RULES

No inline styles

No hardcoded colors

No hardcoded spacing

No duplicated utilities

No !important

Use Design Tokens everywhere.

---

# RESPONSIVE RULES

Mobile First

Fluid Layouts

Clamp Typography

Responsive Images

Flexible Grids

No fixed widths unless absolutely necessary.

---

# TYPESCRIPT RULES

Strict Mode

Explicit Types

Meaningful Interfaces

No any

Reusable Types

Shared Definitions

---

# ANIMATION RULES

Use GSAP

Animate transform and opacity only

Destroy timelines on cleanup

Support reduced motion

Animations should communicate hierarchy

Never distract users

---

# CONTENT RULES

Never hardcode products

Never hardcode navigation

Never hardcode testimonials

Use Content Collections

Use JSON driven architecture

---

# IMAGE RULES

Preferred Format: AVIF

Fallback: WebP

Responsive Sizes

Lazy Loading

Cloudinary Optimization

Width and Height Required

---

# PERFORMANCE RULES

Initial Payload: < 1 MB

Initial JavaScript: < 150 KB

Initial CSS: < 80 KB

Lighthouse: 98+

CLS: < 0.05

LCP: < 2 seconds

---

# ACCESSIBILITY RULES

WCAG 2.2 AA

Semantic HTML

Keyboard Navigation

Visible Focus

Reduced Motion

Screen Reader Support

Accessibility is mandatory.

---

# SEO RULES

One H1

Logical Heading Hierarchy

Canonical URLs

Structured Data

Meaningful Metadata

Readable URLs

---

# GIT RULES

Feature Branches

Atomic Commits

Meaningful Messages

Review Before Merge

Never commit generated files unnecessarily.

---

# DOCUMENTATION RULES

Document first

Code second

Update documentation whenever architecture changes

Documentation is the source of truth

---

# AI DEVELOPMENT RULES

AI never guesses architecture

AI always reads

CLAUDE.md

↓

Project Documentation

↓

Current Task

↓

Generates Code

AI must never bypass documentation.

---

# CODE REVIEW CHECKLIST

Readable

Reusable

Accessible

Responsive

Performant

Typed

Documented

Testable

Maintainable

---

# REFACTORING RULE

If code feels difficult to understand,

rewrite it.

Readable code is premium code.

---

# LUXURY STANDARD

Every interaction should feel

Intentional

Elegant

Fast

Minimal

Timeless

Never trendy for the sake of trends.

---

# FINAL RULE

If a future developer opens this repository three years from now,

they should understand the complete architecture within fifteen minutes.

Every engineering decision should move the project closer to that objective.

---

Document Status: Production Ready

Framework: Cloutora Luxury Framework

Version: 1.0