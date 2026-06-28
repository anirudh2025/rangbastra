# RANGBASTRA.LUXURY

# COMPONENT LIBRARY

Version: 1.0

---

# PURPOSE

This document defines every reusable component used throughout Rangbastra.luxury.

Every component must be modular, reusable, accessible, responsive and production ready.

Components should never contain business logic.

Components should receive data through properties.

---

# COMPONENT PHILOSOPHY

One Component

↓

One Responsibility

↓

One Purpose

↓

One Experience

Never create large multi-purpose components.

Composition is preferred over complexity.

---

# COMPONENT HIERARCHY

Application

↓

Layout

↓

Experience

↓

Section

↓

Component

↓

UI Element

---

# GLOBAL RULES

Every component must:

Support dark mode

Support responsive layouts

Support keyboard navigation

Support reduced motion

Support accessibility

Accept typed properties

Avoid duplicated logic

Remain presentation focused

---

# RESPONSIVE STANDARD

Every component must support

xs

sm

md

lg

xl

2xl

Never use fixed widths.

Prefer clamp()

max-width

fluid spacing

responsive typography

---

# LAYOUT COMPONENTS

Container

Purpose

Maintain maximum readable width.

Responsibilities

Responsive width

Horizontal padding

Center alignment

No business logic

---

Section

Purpose

Provide consistent vertical rhythm.

Responsibilities

Spacing

Container wrapping

Background management

Reveal animation hook

---

Grid

Purpose

Responsive layout system.

Supports

1 column

2 column

3 column

4 column

Editorial layouts

---

Stack

Purpose

Vertical spacing utility.

---

Spacer

Purpose

Maintain consistent rhythm.

---

# NAVIGATION COMPONENTS

Navbar

Sticky

Glass morphism

Blur on scroll

Logo

Navigation

CTA

Mobile Menu

Mega Menu

Animated underline

Scroll progress

---

Mobile Drawer

Slide animation

Focus trap

Accessible navigation

---

Mega Menu

Luxury editorial layout

Collection previews

Minimal typography

---

# TYPOGRAPHY COMPONENTS

DisplayHeading

Hero typography

Editorial scale

Large spacing

---

SectionHeading

Section titles

Consistent hierarchy

---

Paragraph

Readable body copy

Maximum width

Accessible line height

---

Caption

Supporting text

Muted color

---

LuxuryQuote

Founder message

Editorial style

---

# BUTTON COMPONENTS

PrimaryButton

Gradient

Filled

Magnetic hover

Luxury motion

---

OutlineButton

Border only

Minimal

---

GhostButton

Transparent

Underline animation

---

WhatsAppButton

Brand optimized

Floating variant

Inline variant

---

IconButton

Minimal

Accessible

Hover elevation

---

# CARD COMPONENTS

CollectionCard

Large imagery

Minimal copy

Hover zoom

Gradient overlay

---

FeatureCard

Icon

Heading

Description

Glass morphism

---

GlassCard

Reusable transparent surface

---

TestimonialCard

Client image

Review

Rating

Location

---

StoryCard

Image

Narrative

CTA

---

# MEDIA COMPONENTS

LuxuryImage

Cloudinary optimized

Responsive

Lazy

Blur placeholder

---

HeroVideo

Autoplay

Muted

Loop

Optimized

---

EditorialGallery

Masonry

Fullscreen

Smooth transitions

---

CampaignMedia

Large immersive presentation

---

# FORM COMPONENTS

LuxuryInput

Floating label

Focus glow

Rounded

---

LuxuryTextarea

Resizable

Accessible

---

LuxurySelect

Custom dropdown

Keyboard support

---

UploadZone

Drag and drop

Image preview

Progress indicator

---

ConsultationForm

Multi step

Progress tracking

Validation

---

# CTA COMPONENTS

ConsultationCTA

Primary conversion

---

WhatsAppCTA

Instant inquiry

---

VisitStoreCTA

Location focused

---

BookAppointmentCTA

Luxury consultation

---

# MODAL COMPONENTS

ImageModal

Fullscreen

Keyboard support

ESC close

---

VideoModal

Autoplay

Responsive

---

ConfirmationModal

Minimal

Accessible

---

# FEEDBACK COMPONENTS

Toast

Minimal

Glass style

---

Loader

Luxury spinner

Gradient animation

---

ProgressIndicator

Section progress

---

# SOCIAL COMPONENTS

InstagramFeed

Responsive grid

Hover interaction

---

ReviewCarousel

Auto progression

Pause on hover

---

# FOOTER COMPONENTS

FooterNavigation

FooterContact

FooterNewsletter

FooterSocial

FooterLegal

---

# COMPONENT STATES

Every interactive component supports

Default

Hover

Focus

Active

Loading

Disabled

Success

Error

---

# ACCESSIBILITY

Semantic HTML

ARIA Labels

Keyboard Navigation

Visible Focus

Reduced Motion

Color Contrast AA

Screen Reader Support

Accessibility is mandatory.

---

# PERFORMANCE

Every component

Lazy loads media

Uses optimized assets

Prevents layout shift

Avoids unnecessary rerenders

Uses minimal JavaScript

---

# ANIMATION

Motion communicates hierarchy.

Never decoration.

Animation priority

Hover

↓

Reveal

↓

Section

↓

Experience

↓

Page

Preferred easing

power4.out

---

# DESIGN TOKENS

Components never contain

Hardcoded Colors

Hardcoded Typography

Hardcoded Radius

Hardcoded Shadows

Hardcoded Spacing

Everything originates from

Design System

---

# NAMING

PascalCase

HeroSection.astro

LuxuryButton.astro

CollectionCard.astro

ConsultationForm.astro

---

# FUTURE COMPONENTS

AIStyleAssistant

MeasurementAssistant

VirtualConsultation

AppointmentCalendar

LanguageSwitcher

LuxurySearch

These components should integrate without changing architecture.

---

# FINAL OBJECTIVE

Every component should feel handcrafted.

Every interaction should communicate elegance.

Every reusable element should strengthen the perception of Rangbastra as a luxury couture house rather than a traditional ecommerce platform.