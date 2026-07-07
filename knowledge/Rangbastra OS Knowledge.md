# CLOUTORA LUXURY FRAMEWORK v3

## Philosophy

The framework exists to create premium digital experiences that are scalable, predictable, and maintainable.

Every decision must improve consistency before improving appearance.

---

## Layer Order

Foundation

↓

Motion

↓

Component Tokens

↓

Utilities

↓

Components

↓

Pages

---

## Golden Rules

Never hardcode design values inside components.

Always consume component tokens.

Component tokens consume foundation tokens.

Foundation never depends on components.

Utilities never define design.

Utilities only consume design.

Motion is reusable.

Components never invent animations.

Every interaction must feel intentional.

Every spacing decision must come from the spacing system.

Every color must come from design tokens.

Every radius must come from radius tokens.

Every shadow must come from elevation tokens.

Every component must remain replaceable.

Every component must remain reusable.

Every page must feel like the same luxury brand.

---

## Ultimate Goal

Build a framework capable of powering multiple premium brands with minimal code changes.


---


# RANGBASTRA.LUXURY PROJECT BIBLE

## PROJECT TYPE

Luxury Boutique & Custom Couture Website

This is NOT a traditional ecommerce website.

This is a premium digital fashion house designed to communicate craftsmanship, exclusivity and timeless elegance.

The website should feel like a luxury editorial experience rather than an online store.

Every section must tell a story.

Every interaction must feel intentional.

Every animation must feel handcrafted.

Never sacrifice elegance for unnecessary effects.

---

# ROLE

You are acting as:

- Senior Frontend Architect
- Creative Director
- UI/UX Designer
- Performance Engineer
- Motion Designer
- SEO Engineer
- Accessibility Specialist

Always prioritize:

Elegance > Simplicity > Performance > Scalability.

---

# TECH STACK

Framework

Astro Latest Stable

Language

TypeScript

Styling

TailwindCSS Latest

Animations

GSAP

Images

Cloudinary

Content

Astro Content Collections

Data

JSON Architecture

Deployment

Vercel

Package Manager

pnpm

Icons

Lucide Icons

Forms

Resend API

---

# DESIGN PHILOSOPHY

The website should feel inspired by

Apple

Jacquemus

Dior

Sabyasachi

Aesop

Never resemble Shopify templates.

Never use generic ecommerce layouts.

Use whitespace generously.

Typography is a primary design element.

Images should dominate over text.

Sections should breathe.

Scrolling should feel cinematic.

---

# BRAND POSITIONING

Rangbastra does not sell clothing.

Rangbastra creates personalized couture experiences.

Everything should reinforce this positioning.

---

# DESIGN TOKENS

Primary Background

#0F0F10

Secondary Gradient

#6A4E42

Text

#FFFFFF

Accent

#C6A972

Secondary Accent

#BF8E2A

Support

#C68A8A

Success

#7D8A72

Never introduce random colors.

---

# TYPOGRAPHY

Headings

Cormorant Garamond

Body

Montserrat

Product Names

Segoe Script

Segoe Script should ONLY appear for:

Product Names

Collection Names

Luxury Signatures

Never paragraphs.

Never buttons.

Never descriptions.

---

# RESPONSIVE SYSTEM

Always mobile first.

Support

xs

sm

md

lg

xl

2xl

Never use fixed widths.

Use

max-w

container

clamp()

fluid typography

fluid spacing

responsive grids

for every section.

---

# SPACING SYSTEM

Use 8pt design system.

8

16

24

32

40

48

64

80

96

128

Never use random spacing values.

---

# BORDER RADIUS

Soft.

Luxury.

rounded-xl

rounded-2xl

rounded-3xl

Avoid excessive rounding.

---

# SHADOWS

Very subtle.

Luxury depth.

Avoid aggressive shadows.

Prefer contrast and spacing over shadow.

---

# BUTTON SYSTEM

Primary

Filled

Accent gradient

Secondary

Outline

Ghost

Text only

Magnetic hover effect.

Smooth transition.

Never harsh animations.

---

# ICONOGRAPHY

Lucide Icons only.

Minimal stroke.

No colorful icons.

---

# MOTION PRINCIPLES

Motion should communicate hierarchy.

Not decoration.

Use GSAP.

Preferred easing

power4.out

Animations

Fade

Reveal

Mask

Scale

Translate

Parallax

SplitText

Image Zoom

Magnetic Buttons

Scroll Reveal

Luxury Cursor

Never bounce.

Never flashy.

Never exaggerated.

---

# PERFORMANCE

Target Lighthouse

Performance

98+

Accessibility

100

Best Practices

100

SEO

100

Always lazy load images.

Use AVIF.

Fallback WebP.

Optimize Cloudinary transformations.

Prevent layout shift.

Minimize CLS.

---

# IMAGE STRATEGY

Images should occupy visual hierarchy.

Always use

object-cover

responsive sizes

lazy loading

Cloudinary optimization

Use editorial compositions.

Never stretch images.

---

# COMPONENT RULES

Every component must:

Be reusable.

Be typed.

Accept props.

Avoid duplicated logic.

Be isolated.

Be accessible.

---

# FILE STRUCTURE

src/

components/

layouts/

pages/

content/

data/

styles/

animations/

utils/

hooks/

lib/

assets/

---

# JSON STRUCTURE

Products

Collections

Testimonials

FAQs

Navigation

Footer

Everything should be JSON driven.

Never hardcode repeatable content.

---

# CMS

Use Astro Content Collections.

Every product should be generated dynamically.

Adding products should never require editing layout code.

---

# SEO

Every page requires

Meta Title

Meta Description

Canonical

OpenGraph

Twitter Card

Structured Data

Breadcrumb

Local Business Schema

Product Schema

FAQ Schema

---

# ACCESSIBILITY

Semantic HTML

Keyboard Navigation

Focus States

ARIA Labels

Screen Reader Support

Proper Heading Hierarchy

High Contrast

Never sacrifice accessibility for design.

---

# NAVIGATION

Glass Morphism

Sticky

Blur on scroll

Shrink logo

Smooth transitions

Active section indicator

Luxury mobile drawer

Always visible CTA

Book Consultation

---

# HERO

100vh

Video Background

Dark Overlay

Luxury Grain

Floating Gradient

Editorial Typography

Two CTA Buttons

Animated Scroll Indicator

Reveal Animation

---

# COLLECTIONS

Editorial layout.

Large imagery.

Minimal text.

Alternating composition.

Hover zoom.

Gradient overlays.

---

# COUTURE EXPERIENCE

Products are stories.

Never simple ecommerce cards.

Every product page contains

Campaign

Story

Fabric

Embroidery

Customization

Measurements

Consultation

Timeline

Testimonials

Related Products

WhatsApp CTA

---

# CUSTOMIZATION EXPERIENCE

Flow

Choose Outfit

Choose Fabric

Choose Embroidery

Upload Inspiration

Measurements

Occasion

Budget

Timeline

WhatsApp

Advance Payment

Production

---

# ANIMATION SPEED

Fast UI

0.2s

Hover

0.4s

Reveal

0.8s

Section

1.2s

Hero

1.4s

Maintain consistency.

---

# MICRO INTERACTIONS

Cursor Glow

Image Zoom

Button Lift

Gradient Border

Parallax

Magnetic CTA

Luxury Loader

Scroll Progress

Back to Top

Smooth Anchor Scroll

---

# FORMS

Minimal.

Large spacing.

Floating labels.

Luxury inputs.

Inline validation.

Resend API integration.

---

# CODING STANDARDS

Strict TypeScript.

Reusable functions.

No duplicated code.

Meaningful naming.

Small components.

Maintainability first.

---

# DEVELOPMENT PHILOSOPHY

Do NOT generate entire pages at once.

Generate one component.

Review.

Refactor.

Optimize.

Then proceed.

Every component must be production ready.

---

# QUALITY CHECK

Before writing any code ask internally

Is this elegant?

Is this reusable?

Is this performant?

Is this accessible?

Is this scalable?

Would this pass Awwwards quality?

If the answer is no,

rewrite it.

---

# FINAL OBJECTIVE

The visitor should never feel they are browsing an ecommerce website.

They should feel they are experiencing a luxury couture fashion house.

Every decision must reinforce premium positioning.

Build for timelessness rather than trends.

Less but better.

Elegance over complexity.

Craftsmanship over decoration.


---


# RANGBASTRA.LUXURY

# DESIGN SYSTEM v1.0

---

# DESIGN PHILOSOPHY

Luxury is achieved through restraint.

Every pixel should have a purpose.

Every spacing decision should improve readability.

Every animation should communicate hierarchy.

Whitespace is a design element.

Typography is the primary visual language.

Images should dominate over decoration.

Never add something simply because it looks beautiful.

Everything must contribute to the experience.

---

# VISUAL PERSONALITY

Elegant

Editorial

Minimal

Sophisticated

Warm

Timeless

Handcrafted

Premium

Cinematic

Luxury

Never

Flashy

Crowded

Colorful

Noisy

Template-like

---

# GRID SYSTEM

12 Column Grid

Desktop

Container Width

1440px

Max Content Width

1280px

Section Max Width

1600px

Container Padding

xs   16px

sm   20px

md   24px

lg   32px

xl   48px

2xl  64px

Every section should align to this grid.

---

# SPACING SYSTEM

Use only multiples of 8.

4

8

16

24

32

40

48

64

80

96

128

160

192

256

Never use random spacing.

---

# BORDER RADIUS

small

12px

medium

20px

large

28px

extra

36px

pill

999px

Avoid excessive rounding.

---

# COLOR SYSTEM

PRIMARY

Obsidian Black

#0F0F10

SECONDARY

Warm Cocoa

#6A4E42

ACCENT

Champagne Gold

#C6A972

GOLD GRADIENT

#BF8E2A

↓

#FFCB64

↓

#BF8E2A

DUSTY ROSE

#C68A8A

SAGE

#7D8A72

WHITE

#FFFFFF

TEXT SECONDARY

rgba(255,255,255,0.72)

TEXT MUTED

rgba(255,255,255,0.55)

DIVIDER

rgba(255,255,255,0.08)

---

# BACKGROUND SYSTEM

Layer 1

Obsidian Gradient

Layer 2

Radial Overlay

Layer 3

Luxury Grain

Layer 4

Soft Glow

Layer 5

Content

Every page follows this stack.

---

# GRADIENT SYSTEM

Gradient 01

Obsidian

#0F0F10

↓

#6A4E42

Gradient 02

Gold

#BF8E2A

↓

#FFCB64

↓

#BF8E2A

Gradient 03

Rose

#C68A8A

↓

#F4EDE4

Gradient 04

Sage

#7D8A72

↓

#E9F4E4

Never invent new gradients.

---

# TYPOGRAPHY

Display

Cormorant Garamond

Hero

96

80

72

64

56

Heading

64

56

48

40

32

Section

40

36

32

28

24

Body Large

20

Body

18

Small

16

Caption

14

Product Name

Segoe Script

Only product titles.

Never descriptions.

---

# FONT WEIGHTS

Cormorant

300

400

500

600

Montserrat

300

400

500

600

700

---

# LINE HEIGHT

Display

110%

Heading

120%

Body

170%

Caption

160%

---

# LETTER SPACING

Display

-2%

Heading

-1%

Body

0%

Buttons

4%

Uppercase Labels

8%

---

# BUTTON SYSTEM

Primary

Filled

Gradient

Rounded Pill

Magnetic Hover

Secondary

Outline

Ghost

Minimal

Text

Underline Reveal

All buttons

56px minimum height.

---

# CARD SYSTEM

No heavy shadows.

Glass background.

Subtle border.

Luxury blur.

Image first.

Text second.

CTA last.

---

# GLASS MORPHISM

Background

rgba(255,255,255,0.04)

Blur

16px

Border

1px rgba(255,255,255,0.08)

---

# SHADOWS

Small

0 8 24

Large

0 24 80

Opacity

Very low

Prefer contrast instead.

---

# ICON SYSTEM

Lucide only.

24 default.

32 large.

Stroke 1.5

Never filled icons.

---

# FORM SYSTEM

Floating labels

Large inputs

56px height

Rounded xl

Luxury focus glow

Inline validation

Minimal placeholders

---

# IMAGE SYSTEM

Always

object-cover

responsive

lazy

Cloudinary

AVIF

WebP fallback

Blur placeholder

Never stretch images.

---

# GRID COMPONENTS

Desktop

4 columns

Tablet

2 columns

Mobile

1 column

Editorial blocks

Alternate left/right

---

# SECTION SPACING

Hero

160px

Section

128px

Subsection

80px

Cards

32px

Buttons

24px

---

# DIVIDERS

Use opacity.

Never solid lines.

Use gradients.

---

# BADGES

Luxury pill

Uppercase

Letter spacing

Gold border

Transparent fill

---

# MOTION TOKENS

Hover

0.3s

Reveal

0.8s

Hero

1.4s

Section

1.2s

Modal

0.4s

Cursor

0.2s

---

# HOVER STATES

Image

Scale 1.05

Button

Lift 4px

Card

Translate Y -8px

Links

Underline reveal

---

# SCROLL EXPERIENCE

Smooth

Slow

Editorial

Parallax

Reveal

No sudden jumps.

---

# MOBILE EXPERIENCE

Touch friendly

Large tap targets

Thumb reachable

No hover dependency

Everything optimized.

---

# ACCESSIBILITY

Minimum contrast AA

Visible focus

Keyboard support

Screen reader labels

Semantic HTML

---

# DESIGN PRINCIPLES

Less but better.

Luxury through typography.

Luxury through spacing.

Luxury through imagery.

Luxury through motion.

Never through decoration.

---

# FINAL RULE

If any component feels like a template,

redesign it.

If any animation feels distracting,

remove it.

If any spacing feels crowded,

increase it.

Every screen should feel like a premium fashion editorial.


---


# RANGBASTRA.LUXURY

# PROJECT ARCHITECTURE

Version: 1.0

---

# PURPOSE

This document defines the complete engineering architecture for Rangbastra.luxury.

Every component, page, animation, layout, content source, and future feature must follow this specification.

This document is the single source of truth for project organization and development standards.

---

# ARCHITECTURE PHILOSOPHY

The project follows an Experience Driven Architecture (EDA).

The website is designed as a sequence of luxury digital experiences instead of traditional webpages.

Structure:

Website

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

Every component must have a single responsibility.

Reusable architecture is mandatory.

---

# CORE PRINCIPLES

Every implementation must satisfy the following principles.

- Reusable
- Scalable
- Accessible
- Performant
- Elegant

If a component violates any principle it should be redesigned.

---

# PROJECT RESPONSIBILITIES

assets/

Static project resources.

Contains fonts, logos, images, textures, icons and reference materials.

Never contains business logic.

---

data/

Contains JSON business data.

Products

Collections

Navigation

Testimonials

FAQ

Site Settings

No presentation logic should exist inside this directory.

---

docs/

Project documentation.

Contains architecture, design system and development standards.

Never contains production code.

---

public/

Public assets served directly by Astro.

Includes favicon, robots, manifest and generated files.

---

src/

Application source code.

Contains layouts, pages, components, styles, animations and utilities.

---

# APPLICATION HIERARCHY

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

Every level communicates only with the layer directly below it.

---

# EXPERIENCE MODEL

Instead of page-first architecture, the project follows experience-first architecture.

Landing Experience

Brand Experience

Collection Experience

Craftsmanship Experience

Customization Experience

Lookbook Experience

Trust Experience

Consultation Experience

---

# DATA FLOW

JSON

↓

Astro Content Collections

↓

Component Properties

↓

Rendered UI

Business content should never be hardcoded inside components.

---

# CONTENT STRATEGY

Products

Collections

Testimonials

Navigation

Footer

FAQ

SEO

Contact Information

Social Links

All content must remain independent from presentation.

---

# COMPONENT STRATEGY

Every component must:

Have a single responsibility.

Accept typed properties.

Remain reusable.

Remain isolated.

Avoid duplicated logic.

Avoid direct business data access.

---

# LAYOUT STRATEGY

Every page follows:

SEO

↓

Navigation

↓

Content

↓

Footer

↓

Global Scripts

Layout components must remain presentation-only.

---

# IMAGE STRATEGY

Images are managed through Cloudinary.

Preferred format:

AVIF

Fallback:

WebP

Images must:

Be responsive

Be lazy loaded

Use automatic transformations

Prevent layout shift

Maintain aspect ratio

---

# PERFORMANCE STRATEGY

Target Lighthouse Score

Performance

98+

Accessibility

100

Best Practices

100

SEO

100

All implementation decisions must support these targets.

---

# SEO STRATEGY

Every page automatically supports:

Meta Title

Meta Description

Canonical URL

Open Graph

Twitter Cards

Structured Data

Breadcrumb Schema

Local Business Schema

Product Schema

FAQ Schema

---

# ACCESSIBILITY

Semantic HTML

Keyboard Navigation

Visible Focus States

ARIA Labels

Screen Reader Support

Accessible Color Contrast

Accessibility is mandatory.

---

# ANIMATION ARCHITECTURE

Global Motion

↓

Experience Motion

↓

Section Motion

↓

Component Motion

↓

Hover Motion

Animations should communicate hierarchy and improve usability.

Never distract users.

---

# DESIGN TOKEN STRATEGY

Components never contain hardcoded values.

Colors

Typography

Spacing

Radius

Shadows

Motion

must always originate from the Design System.

---

# NAMING CONVENTIONS

Components

PascalCase

HeroSection.astro

LuxuryButton.astro

CollectionCard.astro

Variables

camelCase

Constants

UPPER_CASE

JSON

kebab-case

---

# DEVELOPMENT STANDARDS

Strict TypeScript

Reusable Components

No Duplicated Logic

Meaningful Naming

Composition Over Complexity

Maintainability First

---

# AI DEVELOPMENT RULES

AI should never receive requests such as:

"Build homepage."

Instead AI receives:

Project Documentation

↓

Design System

↓

Project Architecture

↓

Specific Component Specification

↓

Expected Output

Every generated component must be production ready.

---

# FUTURE SCALABILITY

The architecture must support:

Unlimited Products

Unlimited Collections

Multiple Languages

Blog System

AI Styling Assistant

Appointment Booking

Luxury Consultation Flow

Future CMS Expansion

without structural modifications.

---

# FINAL OBJECTIVE

The visitor should never feel they are browsing a traditional ecommerce website.

The experience should communicate craftsmanship, exclusivity and timeless luxury.

Every engineering decision should reinforce this objective.


---


# RANGBASTRA.LUXURY

# LANDING EXPERIENCE

Version: 1.0

---

# OBJECTIVE

The landing experience is designed to communicate luxury, craftsmanship and exclusivity before promoting products.

Visitors should experience Rangbastra as a couture fashion house rather than a traditional ecommerce store.

Every section exists to build emotion, trust and desire.

---

# EXPERIENCE FLOW

Arrival

↓

Brand Story

↓

Collection Discovery

↓

Craftsmanship

↓

Customization

↓

Lookbook

↓

Social Proof

↓

Consultation

↓

Footer

---

# ARRIVAL EXPERIENCE

Purpose

Create an immediate premium impression.

Requirements

Full viewport height

Editorial composition

Luxury motion

Minimal copy

Video or cinematic imagery

Dark Obsidian Cocoa gradient

Large typography

Dual CTA

Background grain texture

Floating gradient overlays

Scroll indicator

Micro interactions

Success Metric

Visitor understands premium positioning within five seconds.

---

# BRAND STORY EXPERIENCE

Purpose

Communicate heritage, personalization and craftsmanship.

Layout

Editorial split layout

Large image

Minimal copy

Founder quote

Story button

Generous whitespace

Motion

Reveal animation

Image parallax

Typography fade

---

# COLLECTION DISCOVERY EXPERIENCE

Purpose

Introduce signature collections.

Layout

Editorial alternating blocks

Large campaign imagery

Collection title

Short description

Luxury CTA

Hover zoom

Subtle motion

Never use traditional ecommerce product grids.

---

# CRAFTSMANSHIP EXPERIENCE

Purpose

Demonstrate quality.

Content

Fabric selection

Embroidery

Measurements

Hand finishing

Personal attention

Presentation

Luxury timeline

Minimal icons

Large imagery

Animated progression

---

# CUSTOMIZATION EXPERIENCE

Purpose

Present Rangbastra's unique process.

Flow

Choose Collection

↓

Choose Design

↓

Choose Fabric

↓

Choose Embroidery

↓

Upload Inspiration

↓

Provide Measurements

↓

Choose Occasion

↓

Consultation

↓

Production

↓

Delivery

Primary CTA

Book Consultation

Secondary CTA

WhatsApp

---

# LOOKBOOK EXPERIENCE

Purpose

Generate aspiration.

Layout

Editorial masonry gallery

Mixed image sizes

Minimal captions

Fullscreen preview

Smooth transitions

Luxury hover effects

---

# SOCIAL PROOF EXPERIENCE

Purpose

Increase trust.

Content

Client testimonials

Wedding photographs

Ratings

Experience stories

Presentation

Glass cards

Carousel

Editorial spacing

Auto progression

---

# CONSULTATION EXPERIENCE

Purpose

Drive conversion.

Headline

Design Something That Belongs Only To You

Content

Luxury consultation explanation

Appointment CTA

WhatsApp CTA

Store visit CTA

Minimal form

---

# FOOTER EXPERIENCE

Purpose

Provide confidence and navigation.

Includes

Logo

Navigation

Collections

Contact

Business hours

Instagram

Location

Legal links

Newsletter

---

# DESIGN RULES

Every experience must contain one primary objective.

Never combine multiple objectives inside one section.

Whitespace is mandatory.

Typography leads the visual hierarchy.

Images dominate copy.

Animations support hierarchy.

Never distract users.

---

# RESPONSIVE RULES

Every experience must be optimized independently for

Mobile

Tablet

Laptop

Desktop

Large Displays

No section should depend on desktop layouts.

---

# ACCESSIBILITY

Semantic structure

Keyboard navigation

Visible focus states

Screen reader compatibility

Accessible contrast

Reduced motion support

---

# PERFORMANCE

Every experience must

Lazy load media

Optimize images

Prevent layout shift

Load progressively

Maintain Lighthouse score above target

---

# FINAL OBJECTIVE

The visitor should finish the landing experience believing that Rangbastra creates personalized couture experiences rather than selling clothing products.

Every interaction must reinforce elegance, exclusivity and craftsmanship.


---


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


---


# RANGBASTRA.LUXURY

# MOTION SYSTEM

Version: 1.0

---

# PURPOSE

Motion exists to communicate hierarchy, elegance and craftsmanship.

Motion should never exist purely for decoration.

Every animation must improve perception, orientation or interaction.

Luxury is expressed through restraint.

---

# MOTION PHILOSOPHY

Slow

Intentional

Elegant

Editorial

Natural

Timeless

Never aggressive.

Never distracting.

Never playful.

---

# MOTION HIERARCHY

Global Motion

↓

Page Motion

↓

Experience Motion

↓

Section Motion

↓

Component Motion

↓

Hover Motion

↓

Micro Interaction

Every layer should feel connected.

---

# MOTION PRINCIPLES

Motion should:

Guide attention

Support storytelling

Communicate state

Increase perceived quality

Improve navigation

Reduce cognitive load

Never confuse users.

---

# EASING

Preferred

power4.out

Secondary

power2.out

Linear

Only for continuous movement.

Never use bounce.

Never use elastic.

Never use exaggerated easing.

---

# DURATION

Micro

0.15s

Hover

0.30s

Button

0.35s

Card

0.40s

Reveal

0.80s

Section

1.00s

Hero

1.40s

Page Transition

0.80s

Maintain consistency across the website.

---

# PAGE LOAD

Sequence

Loader

↓

Navigation

↓

Hero Media

↓

Headline

↓

Description

↓

Primary CTA

↓

Secondary CTA

↓

Scroll Indicator

Visitors should experience progressive discovery.

---

# SCROLL EXPERIENCE

Smooth

Editorial

Progressive

Never abrupt.

Every section reveals itself naturally.

---

# HERO MOTION

Background

Slow scale

Parallax

Opacity transition

Headline

Split reveal

Mask animation

Description

Fade

Translate

Buttons

Sequential appearance

Scroll indicator

Infinite subtle motion

---

# NAVIGATION MOTION

Transparent

↓

Blur

↓

Glass Morphism

↓

Shrink Logo

↓

CTA Transition

Scroll direction determines behavior.

---

# COLLECTION EXPERIENCE

Images

Scale

1 → 1.05

Overlay

Opacity reveal

Typography

Translate

Fade

CTA

Underline animation

---

# GALLERY EXPERIENCE

Images

Reveal

Scale

Fullscreen transition

Fade

Never sudden appearance.

---

# TIMELINE EXPERIENCE

Every step

Fade

Translate

Line progression

Sequential reveal

Maintain visual continuity.

---

# FORM EXPERIENCE

Focus glow

Floating label

Validation transition

Success animation

Error animation

Never shake inputs aggressively.

---

# BUTTON MOTION

Hover

Translate Y

-4px

Glow

Subtle

Scale

1.02

Magnetic interaction

Supported

---

# CARD MOTION

Hover

Translate Y

-8px

Image

Scale

1.05

Overlay

Opacity

0 → 100

---

# CURSOR EXPERIENCE

Optional

Luxury glow

Blend mode

Soft movement

Low opacity

Cursor never blocks content.

---

# PARALLAX

Maximum movement

15%

Foreground

Fastest

Background

Slowest

Movement should remain subtle.

---

# LOADER EXPERIENCE

Luxury gradient

Minimal typography

Fade transition

Maximum duration

1500ms

Never block interaction longer than necessary.

---

# MODAL EXPERIENCE

Fade background

Scale content

Focus trap

ESC support

Restore scroll position

---

# PAGE TRANSITIONS

Opacity

Translate

Blur

Very subtle

Never create dramatic scene changes.

---

# REDUCED MOTION

Respect user preferences.

Disable

Parallax

Cursor

Continuous movement

Reduce reveal distance

Accessibility has priority over aesthetics.

---

# GSAP ORGANIZATION

Global Timeline

↓

Experience Timeline

↓

Section Timeline

↓

Component Timeline

↓

Hover Timeline

Avoid animation duplication.

---

# PERFORMANCE

Animate

transform

opacity

Never animate

width

height

top

left

margin

Avoid layout recalculation.

---

# STAGGER

Default

0.08s

Large groups

0.12s

Hero

0.15s

Maintain rhythm.

---

# INTERSECTION OBSERVER

Initialize animations only when elements enter viewport.

Never animate invisible elements.

---

# MOBILE

Reduce parallax

Reduce stagger

Reduce movement distance

Preserve battery life

Maintain perceived quality.

---

# ACCESSIBILITY

Visible focus

Reduced motion

Keyboard support

Screen reader compatibility

Animation never hides essential information.

---

# FINAL OBJECTIVE

Visitors should not consciously notice animations.

They should simply feel that the website is refined, premium and exceptionally crafted.

Motion should disappear into the experience and elevate the perception of luxury.


---


# RANGBASTRA.LUXURY

# COUTURE EXPERIENCE

Version: 1.0

---

# PURPOSE

Products are not displayed.

Products are experienced.

Every product represents craftsmanship, personalization and luxury.

The visitor should feel emotionally connected before considering consultation.

---

# PRODUCT PHILOSOPHY

Luxury first.

Commerce second.

Story before specification.

Experience before conversion.

---

# PRODUCT JOURNEY

Discovery

↓

Emotion

↓

Craftsmanship

↓

Customization

↓

Trust

↓

Consultation

↓

Production

↓

Delivery

---

# PAGE STRUCTURE

Hero

↓

Campaign Gallery

↓

Story

↓

Craftsmanship

↓

Fabric

↓

Customization

↓

Measurements

↓

Timeline

↓

Testimonials

↓

Consultation CTA

↓

Related Collection

---

# HERO

Purpose

Create emotional connection.

Contains

Editorial Image

Product Name

Signature Typography

Luxury Badge

Consultation CTA

Minimal Description

---

# CAMPAIGN GALLERY

Large imagery.

Mixed composition.

Editorial spacing.

Fullscreen support.

Smooth transitions.

Never use traditional ecommerce sliders.

---

# PRODUCT STORY

Purpose

Explain inspiration.

Tell narrative.

Avoid technical language.

Maximum readability.

Luxury typography.

---

# FABRIC EXPERIENCE

Display

Fabric

Texture

Embroidery

Finish

Care

Presentation

Minimal cards

Macro imagery

Editorial spacing

---

# CRAFTSMANSHIP

Timeline

Fabric Selection

↓

Pattern

↓

Cutting

↓

Embroidery

↓

Hand Finish

↓

Quality Check

↓

Delivery

---

# CUSTOMIZATION

Primary Feature

Visitors can personalize

Fabric

Embroidery

Sleeves

Neck

Length

Occasion

Color

Reference Image

---

# MEASUREMENTS

Luxury experience.

Step by step.

Visual guidance.

Optional consultation.

---

# DELIVERY

Display

Estimated Production

Customization Time

Shipping Timeline

Priority Options

---

# CONSULTATION

Primary conversion.

Contains

WhatsApp

Appointment

Store Visit

Call Request

---

# RELATED COLLECTIONS

Editorial layout.

Maximum four suggestions.

Never infinite grids.

---

# PRODUCT MEDIA

Cloudinary

AVIF

WebP

Responsive

Lazy

Blur placeholder

---

# PRODUCT DATA

Every product originates from

JSON

↓

Content Collection

↓

Component

↓

UI

Never hardcode products.

---

# RESPONSIVE

Mobile

Single column

Tablet

Editorial stack

Desktop

Split experience

Large screens

Expanded whitespace

---

# ACCESSIBILITY

Semantic structure

Keyboard support

Screen reader compatibility

Visible focus

Accessible media

---

# PERFORMANCE

Media optimized

Code split

Minimal JavaScript

Progressive loading

Lighthouse target maintained

---

# FINAL OBJECTIVE

Visitors should leave believing they are commissioning a handcrafted couture experience rather than purchasing a product from a conventional ecommerce website.


---


# RANGBASTRA.LUXURY

# CONTENT COLLECTIONS

Version: 1.0

---

# PURPOSE

Content Collections provide a structured and scalable content architecture for Rangbastra.luxury.

Business content must remain completely independent from presentation.

Adding or modifying content should never require layout changes.

---

# CONTENT PHILOSOPHY

Content

↓

Structure

↓

Presentation

↓

Experience

Presentation must adapt to content.

Content should never adapt to layouts.

---

# CONTENT TYPES

Products

Collections

Lookbook

Testimonials

FAQ

Navigation

Footer

Site Settings

Policies

Brand Story

Founder Story

Campaigns

---

# PRODUCTS

Required Fields

slug

name

signatureName

category

description

story

fabric

embroidery

occasion

deliveryTime

featuredImage

gallery

seo

status

---

# COLLECTIONS

Required Fields

slug

title

subtitle

description

coverImage

products

featured

order

---

# LOOKBOOK

Required Fields

slug

title

images

campaign

year

description

featured

---

# TESTIMONIALS

Required Fields

name

location

review

rating

image

featured

occasion

---

# FAQ

question

answer

category

order

---

# NAVIGATION

label

url

children

featured

external

---

# FOOTER

title

links

social

contact

businessHours

legal

---

# SITE SETTINGS

siteName

tagline

domain

email

whatsapp

instagram

location

businessHours

seo

---

# BRAND STORY

headline

subheadline

story

mission

vision

founderMessage

---

# CAMPAIGNS

title

year

coverImage

gallery

description

featured

---

# FILE ORGANIZATION

Every content type should remain isolated.

Collections should never reference layout logic.

Presentation layers consume content only through typed interfaces.

---

# RELATIONSHIPS

Collection

↓

Products

↓

Lookbook

↓

Testimonials

↓

Consultation

Relationships remain data driven.

---

# CONTENT RULES

No HTML

No inline styles

No business logic

No duplicated content

No presentation decisions

Content should remain platform independent.

---

# LOCALIZATION

Every collection should support future multilingual expansion.

Content architecture must remain locale agnostic.

---

# MEDIA

Every media asset originates from Cloudinary.

Preferred

AVIF

Fallback

WebP

Responsive

Lazy

Optimized

---

# VERSIONING

Every collection should support version control through Git.

Every major content update should create a changelog entry.

---

# FUTURE EXPANSION

Blog

AI Styling

Appointments

Events

Workshops

Luxury Membership

Journal

Editorial

should integrate without structural changes.

---

# FINAL OBJECTIVE

The content system should support unlimited growth while remaining independent from presentation, allowing Rangbastra to evolve without redesigning its architecture.


---


# RANGBASTRA.LUXURY

# BRAND VOICE

Version: 1.0

Last Updated

June 2026

Status

Production Ready

Owner

Cloutora

---

# PURPOSE

This document defines the verbal identity of Rangbastra.

Every communication across website, social media, advertisements, emails, WhatsApp, campaigns and future AI systems must follow this voice.

Consistency is mandatory.

---

# BRAND ESSENCE

Rangbastra creates personalized couture experiences inspired by craftsmanship, elegance and individuality.

The brand does not sell outfits.

The brand creates memories.

---

# BRAND PERSONALITY

Elegant

Warm

Sophisticated

Confident

Minimal

Timeless

Personal

Artistic

Luxury

Approachable

---

# BRAND PROMISE

Every design is created with intention.

Every client receives personal attention.

Every outfit tells a unique story.

---

# COMMUNICATION PHILOSOPHY

Speak like a luxury fashion consultant.

Never sound like a salesperson.

Guide.

Inspire.

Educate.

Recommend.

Never pressure.

---

# TONE

Calm

Refined

Editorial

Premium

Human

Authentic

Never loud.

Never aggressive.

Never desperate.

---

# VOCABULARY

Preferred Words

Craftsmanship

Personalized

Curated

Timeless

Elegant

Handcrafted

Luxury

Experience

Consultation

Couture

Artistry

Refined

Exclusive

Statement

Heritage

---

# AVOID

Cheap

Discount

Sale

Lowest Price

Offer Ending Soon

Hurry

Limited Stock

Mass Produced

Fast Fashion

---

# WRITING STYLE

Short paragraphs.

Natural rhythm.

Confident language.

Minimal adjectives.

Meaningful storytelling.

Every sentence should create imagery.

---

# HEADLINE STYLE

Elegant.

Emotional.

Minimal.

Examples

Designed Around You.

Crafted For Moments That Last Forever.

Luxury Is Personal.

Every Thread Has A Story.

---

# CTA STYLE

Preferred

Book A Consultation

Discover The Collection

Visit The Boutique

Begin Your Custom Journey

Create Your Signature Look

---

Avoid

Buy Now

Order Fast

Shop Cheap

Limited Offer

---

# PRODUCT LANGUAGE

Start with inspiration.

Then craftsmanship.

Then customization.

Then experience.

Specifications come last.

---

# CUSTOMER ADDRESS

Always respectful.

Warm.

Personal.

Never overly formal.

Never overly casual.

---

# EMOTIONAL PILLARS

Confidence

Celebration

Individuality

Craftsmanship

Beauty

Tradition

Luxury

Belonging

---

# STORYTELLING

Every collection should communicate

Inspiration

↓

Design Process

↓

Craftsmanship

↓

Personal Expression

↓

Celebration

---

# SOCIAL MEDIA VOICE

Educational

Inspirational

Elegant

Conversational

Minimal

Value First

Promotion Second

---

# WEBSITE VOICE

Editorial

Luxury

Calm

Immersive

Readable

Premium

---

# WHATSAPP VOICE

Friendly

Professional

Helpful

Luxury Consultation

Never robotic

Never scripted

---

# EMAIL VOICE

Personal

Thoughtful

Minimal

Well spaced

Luxury presentation

---

# AI COMMUNICATION

Future AI assistants should communicate exactly like a senior luxury fashion consultant.

Never generic.

Never transactional.

Always personalized.

---

# LANGUAGE PRINCIPLES

Clarity over complexity.

Confidence over exaggeration.

Elegance over decoration.

Emotion over promotion.

Experience over commerce.

---

# FINAL OBJECTIVE

Every interaction should make the customer feel understood, valued and inspired.

Visitors should remember Rangbastra not as a boutique, but as a luxury couture house that creates deeply personal experiences.


---


# RANGBASTRA.LUXURY

# COPYWRITING SYSTEM

Version: 1.0

Last Updated

June 2026

Status

Production Ready

Owner

Cloutora

---

# PURPOSE

This document defines the copywriting principles for Rangbastra.

Every word published by the brand should communicate elegance, craftsmanship and personalization.

Copy should create desire through storytelling rather than promotion.

---

# COPY PHILOSOPHY

Story

↓

Emotion

↓

Trust

↓

Consultation

↓

Conversion

Never reverse this order.

---

# CORE PRINCIPLES

Clarity

Elegance

Emotion

Confidence

Consistency

Minimalism

Every sentence should have a purpose.

---

# WRITING FORMULA

Hook

↓

Story

↓

Value

↓

Proof

↓

Action

---

# BRAND POSITIONING

Never describe Rangbastra as

Online Store

Clothing Shop

Fashion Seller

Retail Brand

Always position Rangbastra as

Luxury Boutique

Custom Couture House

Personal Design Studio

Craftsmanship Atelier

Luxury Experience

---

# HEADLINE PRINCIPLES

Maximum

8 words

Use simple language.

Create curiosity.

Avoid complexity.

Examples

Designed Around Your Story.

Luxury Made Personal.

Crafted For Celebrations.

Every Detail Matters.

Timeless Starts Here.

---

# SUBHEADLINE PRINCIPLES

Expand the promise.

Maximum

2 lines.

Focus on emotion before information.

---

# BODY COPY

Short paragraphs.

Readable rhythm.

Natural flow.

Avoid large text blocks.

Maximum

3 sentences per paragraph.

---

# CTA PHILOSOPHY

Guide.

Never push.

Preferred

Book A Consultation

Explore The Collection

Visit The Boutique

Create Your Signature Look

Begin Your Journey

Schedule A Personal Session

---

Avoid

Buy Now

Add To Cart

Limited Offer

Order Fast

Shop Today

---

# PRODUCT COPY

Structure

Inspiration

↓

Story

↓

Craftsmanship

↓

Customization

↓

Fabric

↓

Details

↓

Consultation

Never start with specifications.

---

# COLLECTION COPY

Begin with

Emotion

Occasion

Identity

Craftsmanship

Never start with product quantity.

---

# HERO COPY

Headline

Emotional

Minimal

Editorial

Subheadline

Luxury positioning

CTA

Consultation focused

---

# ABOUT COPY

Focus on

Vision

Craftsmanship

Founder

Personalization

Community

Never write corporate language.

---

# CONSULTATION COPY

Calm

Professional

Helpful

Luxury

Personal

Every consultation should feel exclusive.

---

# TESTIMONIAL COPY

Authentic

Natural

Conversational

Never over edited.

Never exaggerated.

---

# MICROCOPY

Buttons

Short

Clear

Confident

Forms

Helpful

Minimal

Navigation

Readable

Simple

Elegant

---

# FORM LABELS

Preferred

Your Name

Occasion

Preferred Date

Customization Ideas

Reference Images

Avoid

Field 1

Message

Input

---

# ERROR MESSAGES

Helpful

Respectful

Human

Example

Please enter a valid email address.

Never

Invalid Input.

---

# SUCCESS MESSAGES

Warm

Personal

Example

Thank you.

Our design consultant will connect with you shortly.

---

# WHATSAPP COPY

Friendly

Professional

Minimal

Luxury consultation focused

Never automated sounding.

---

# EMAIL COPY

Editorial

Personal

Well spaced

Premium typography

Clear CTA

---

# SEO COPY

Natural language.

Keyword integration should feel invisible.

Never keyword stuff.

Always prioritize readability.

---

# SOCIAL MEDIA COPY

Education

↓

Inspiration

↓

Story

↓

Engagement

↓

Promotion

Promotion is always the last priority.

---

# LUXURY VOCABULARY

Crafted

Curated

Refined

Personalized

Signature

Timeless

Artistry

Elegance

Experience

Consultation

Journey

Couture

Handcrafted

Exclusive

---

# AVOID VOCABULARY

Cheap

Discount

Lowest Price

Sale

Hurry

Offer Ends

Mass Produced

Instant Purchase

Fast Fashion

---

# CONTENT HIERARCHY

Headline

↓

Subheadline

↓

Story

↓

Supporting Information

↓

CTA

---

# AI COPY RULES

Future AI systems must

Maintain luxury tone

Avoid repetition

Avoid generic marketing language

Prefer storytelling

Keep copy concise

Always align with Brand Voice

---

# FINAL OBJECTIVE

Every piece of copy should make the customer feel that Rangbastra is creating something uniquely personal rather than selling a product.

Words should build trust, emotion and aspiration before encouraging action.

---

Document Status

Production Ready

Framework

Cloutora Luxury Framework

Version

1.0


---


# RANGBASTRA.LUXURY

# SEO STRATEGY

Version: 1.0

Last Updated

June 2026

Status

Production Ready

Owner

Cloutora

---

# PURPOSE

This document defines the complete search engine optimization strategy for Rangbastra.luxury.

SEO should increase discoverability while preserving the luxury experience.

Search optimization must always support brand positioning, readability and long-term authority.

---

# SEO PHILOSOPHY

Brand

↓

Content

↓

Authority

↓

Experience

↓

Ranking

Luxury perception always has priority over keyword density.

---

# SEO OBJECTIVES

Increase qualified organic traffic

Increase consultation requests

Strengthen local authority

Build topical expertise

Support long-term growth

Maintain premium positioning

---

# BRAND POSITIONING

Search engines should understand Rangbastra as

Luxury Boutique

Custom Couture House

Designer Studio

Bridal Consultation Boutique

Luxury Ethnic Fashion Experience

Never position the brand as a discount clothing store.

---

# TARGET AUDIENCE

Brides

Wedding Families

Luxury Fashion Buyers

Festive Wear Customers

Custom Clothing Clients

Premium Lifestyle Consumers

---

# KEYWORD STRATEGY

Primary

Custom Boutique Anand

Luxury Boutique Anand

Designer Boutique Gujarat

Custom Bridal Wear

Luxury Ethnic Boutique

---

Secondary

Customized Lehenga

Designer Saree Boutique

Wedding Outfit Consultation

Luxury Bridal Collection

Premium Boutique Gujarat

---

Long Tail

Best Custom Boutique In Anand

Luxury Bridal Boutique Gujarat

Personalized Wedding Outfit Consultation

Custom Ethnic Wear Boutique

Designer Boutique Near Vallabh Vidyanagar

---

# URL STRUCTURE

/

Home

/collections/

/collections/{slug}

/products/{slug}

/lookbook/

/journal/

/contact/

/consultation/

Readable

Simple

Human friendly

---

# PAGE STRUCTURE

One H1

Logical H2

Supporting H3

Supporting H4

Never skip hierarchy.

---

# META STANDARDS

Every page includes

Meta Title

Meta Description

Canonical URL

Robots

Open Graph

Twitter Card

Theme Color

Language

Author

---

# TITLE RULES

Maximum

60 characters

Include

Primary keyword

Brand name

Readable structure

No keyword stuffing

---

# DESCRIPTION RULES

Maximum

160 characters

Natural language

Luxury positioning

Strong value proposition

Clear action

---

# IMAGE SEO

Every image requires

Descriptive filename

Alt text

Width

Height

Responsive sizes

Cloudinary optimization

Lazy loading

Modern formats

---

# INTERNAL LINKING

Every page connects naturally to

Collections

Products

Lookbook

Consultation

Brand Story

FAQ

Journal

Store Visit

---

# STRUCTURED DATA

Organization

LocalBusiness

Product

Breadcrumb

FAQ

ImageObject

Review

WebSite

Future Event

---

# LOCAL SEO

Google Business Profile

Consistent NAP

Business Hours

WhatsApp

Instagram

Google Maps

Store Address

Location Pages

---

# CONTENT STRATEGY

Educational

Inspirational

Luxury Editorial

Fashion Guidance

Customization

Craftsmanship

Styling Advice

Care Guides

Promotion is always secondary.

---

# JOURNAL STRATEGY

Topics

Bridal Styling

Wedding Fashion

Color Selection

Fabric Education

Embroidery

Luxury Trends

Customization

Designer Insights

Occasion Styling

---

# TECHNICAL SEO

Automatic Sitemap

Robots.txt

Canonical URLs

Schema

Semantic HTML

Structured Metadata

XML Sitemap

Clean URLs

---

# PERFORMANCE SEO

Core Web Vitals

Largest Contentful Paint

Interaction To Next Paint

Cumulative Layout Shift

Optimized Fonts

Optimized Images

Minimal JavaScript

---

# MOBILE SEO

Responsive Layout

Touch Friendly

Accessible Navigation

Readable Typography

Fast Loading

Thumb Reachability

---

# ANALYTICS

Google Search Console

Google Analytics

Microsoft Clarity

Consultation Tracking

WhatsApp Tracking

Form Tracking

Future Event Tracking

---

# SUCCESS METRICS

Organic Traffic

Consultation Requests

Keyword Rankings

Average Session Duration

Pages Per Session

Core Web Vitals

Local Visibility

Conversion Rate

---

# SEO RULES

Never keyword stuff.

Never duplicate content.

Never sacrifice readability.

Never compromise luxury positioning.

Always prioritize user experience.

---

# FUTURE EXPANSION

International SEO

Multilingual Support

City Landing Pages

Editorial Journal

Luxury Guides

AI Fashion Assistant

Voice Search Optimization

---

# FINAL OBJECTIVE

Every indexed page should strengthen Rangbastra's authority as a luxury couture house that creates personalized fashion experiences rather than simply selling clothing.

Search visibility should generate trust before generating traffic.

---

Document Status

Production Ready

Framework

Cloutora Luxury Framework

Version

1.0


---


# RANGBASTRA.LUXURY

# PERFORMANCE

Version: 1.0

Last Updated

June 2026

Status

Production Ready

Owner

Cloutora

---

# PURPOSE

This document defines the performance standards for Rangbastra.luxury.

Performance is a luxury feature.

Every optimization should improve speed, smoothness and perceived quality without compromising design.

---

# PERFORMANCE PHILOSOPHY

Fast

↓

Responsive

↓

Smooth

↓

Delightful

↓

Luxury

Performance is part of the user experience.

---

# PERFORMANCE OBJECTIVES

Instant interactions

Minimal loading

Smooth scrolling

Zero layout shifts

Optimized animations

Consistent responsiveness

---

# LIGHTHOUSE TARGETS

Performance

98+

Accessibility

100

Best Practices

100

SEO

100

These targets are mandatory.

---

# CORE WEB VITALS

Largest Contentful Paint

< 2.0s

Interaction To Next Paint

< 150ms

Cumulative Layout Shift

< 0.05

First Contentful Paint

< 1.2s

Time To Interactive

< 2.5s

---

# IMAGE STRATEGY

Preferred

AVIF

Fallback

WebP

Last Resort

JPEG

Every image must

Be responsive

Be lazy loaded

Use Cloudinary transformations

Specify width and height

Maintain aspect ratio

Prevent layout shift

---

# FONT STRATEGY

Primary Fonts

Cormorant Garamond

Montserrat

Segoe Script

Rules

Subset fonts

Preload critical fonts

Use font-display swap

Minimize font weights

Avoid unnecessary requests

---

# CSS STRATEGY

Tailwind only

No duplicated utilities

Minimal custom CSS

Use CSS variables

Critical styles first

Unused CSS removed during build

---

# JAVASCRIPT STRATEGY

Ship minimal JavaScript

Prefer Astro islands

Hydrate only when necessary

Avoid unnecessary client scripts

Code split aggressively

---

# GSAP STRATEGY

Load GSAP only when required

Register plugins once

Destroy timelines on cleanup

Use transform and opacity

Never animate layout properties

---

# ANIMATION PERFORMANCE

Animate

transform

opacity

Avoid

top

left

width

height

margin

padding

Animations should remain GPU accelerated.

---

# MEDIA STRATEGY

Video

Compressed

Muted

Loop

Autoplay

Poster Image

Lazy loaded

Images

Responsive

Optimized

Modern formats

---

# LAZY LOADING

Images

Videos

Galleries

Testimonials

Instagram Feed

Non critical components

Load only when needed.

---

# PRELOADING

Fonts

Hero Image

Hero Video Poster

Critical CSS

Logo

Navigation

Only preload above-the-fold assets.

---

# PREFETCHING

Next likely pages

Collections

Lookbook

Consultation

Journal

Navigation links

Never prefetch everything.

---

# CLOUDINARY

Automatic format

Automatic quality

Responsive sizing

Blur placeholders

Compression

Smart cropping

Versioned assets

---

# BUILD OPTIMIZATION

Tree shaking

Asset hashing

Minification

Compression

Static generation

Chunk splitting

Dead code removal

---

# NETWORK STRATEGY

HTTP2

Compression

Caching

CDN delivery

Minimal requests

Persistent connections

---

# CACHING

Images

365 days

Fonts

365 days

Static assets

365 days

HTML

Short cache

API

Appropriate cache strategy

---

# MOBILE PERFORMANCE

Priority

Touch responsiveness

Battery efficiency

Reduced animations

Optimized media

Minimal JavaScript

---

# THIRD PARTY SERVICES

Load only when required.

Examples

Analytics

Maps

Instagram

Chat

Tracking

All third-party scripts should be deferred.

---

# INTERSECTION OBSERVER

Reveal sections

Lazy load media

Initialize animations

Track visibility

Avoid scroll event listeners whenever possible.

---

# MEMORY MANAGEMENT

Destroy GSAP timelines

Remove listeners

Cleanup observers

Avoid memory leaks

Reuse components

---

# ACCESSIBILITY PERFORMANCE

Reduced motion support

Reduced data usage

Keyboard navigation

Fast focus transitions

Instant feedback

---

# TESTING

Every production build should be tested using

Lighthouse

PageSpeed Insights

WebPageTest

Chrome DevTools

Real mobile devices

---

# SUCCESS METRICS

Page Load Time

Core Web Vitals

Interaction Delay

Animation Smoothness

Scroll Performance

Consultation Conversion

Bounce Rate

Session Duration

---

# PERFORMANCE RULES

Never optimize at the cost of accessibility.

Never optimize at the cost of readability.

Never optimize at the cost of luxury positioning.

Performance should enhance experience, never simplify it.

---

# FINAL OBJECTIVE

Visitors should never consciously think about performance.

The website should simply feel effortless, refined and exceptionally responsive.

Every interaction should reinforce the perception of a premium luxury experience.

---

Document Status

Production Ready

Framework

Cloutora Luxury Framework

Version

1.0


---


# RANGBASTRA.LUXURY

# ACCESSIBILITY

Version: 1.0

Last Updated

June 2026

Status

Production Ready

Owner

Cloutora

---

# PURPOSE

This document defines the accessibility standards for Rangbastra.luxury.

Accessibility is a fundamental quality requirement.

Every visitor should be able to experience the website regardless of ability, device or interaction method.

Accessibility is part of luxury.

---

# ACCESSIBILITY PHILOSOPHY

Inclusive

↓

Understandable

↓

Comfortable

↓

Elegant

↓

Luxury

Good accessibility improves every user's experience.

---

# COMPLIANCE

Target

WCAG 2.2 AA

Accessibility is mandatory for every page and every component.

---

# SEMANTIC HTML

Use

header

nav

main

section

article

aside

footer

button

form

label

figure

figcaption

Avoid unnecessary div elements.

---

# HEADING STRUCTURE

One H1

Logical H2

Supporting H3

Supporting H4

Never skip hierarchy.

Never use headings for styling only.

---

# KEYBOARD NAVIGATION

Every interactive element must be accessible.

Users should navigate the complete website using only:

Tab

Shift + Tab

Enter

Space

Escape

Arrow Keys

No mouse should be required.

---

# FOCUS STATES

Visible

High contrast

Consistent

Elegant

Never remove outlines without providing a better alternative.

---

# COLOR CONTRAST

Text

Minimum AA contrast

Interactive elements

High visibility

Disabled elements

Clearly distinguishable

Never rely on color alone.

---

# TYPOGRAPHY

Readable

Generous spacing

Accessible line height

Responsive scaling

Never use extremely small text.

---

# IMAGES

Every image requires

Meaningful alt text

Decorative images

Empty alt attribute

Dimensions specified

Responsive sizing

---

# ICONS

Every icon button requires

Accessible label

Keyboard support

Visible focus state

Icons should never be the only method of communication.

---

# LINKS

Descriptive text

Clear destination

Visible hover

Visible focus

No ambiguous "Click Here".

---

# BUTTONS

Minimum touch target

44px

Consistent spacing

Accessible labels

Visible interaction states

---

# FORMS

Every input requires

Label

Placeholder (optional)

Description

Validation

Error message

Success state

Never rely on placeholder text alone.

---

# FORM ERRORS

Explain

What happened

Why

How to fix it

Example

Please enter a valid email address.

Never

Invalid Input

---

# MOTION

Respect

prefers-reduced-motion

Disable

Parallax

Continuous animations

Decorative movement

Reduce transitions

Accessibility takes priority over aesthetics.

---

# MODALS

Trap keyboard focus

ESC closes modal

Restore previous focus

Screen reader compatible

Accessible labels

---

# NAVIGATION

Keyboard accessible

Mobile accessible

Visible active states

Logical order

Consistent behavior

---

# CAROUSELS

Pause control

Manual navigation

Keyboard support

Accessible announcements

No automatic interaction required.

---

# VIDEO

Captions

Poster image

Keyboard controls

Pause support

Muted autoplay

Optional audio

---

# AUDIO

User initiated

Pause

Stop

Volume control

Never autoplay sound.

---

# MOBILE ACCESSIBILITY

Large touch targets

Thumb friendly

Readable typography

Accessible spacing

Gesture alternatives

---

# SCREEN READERS

Meaningful structure

ARIA labels

ARIA roles

Landmarks

Announcements

No redundant information

---

# ARIA

Use only when semantic HTML is insufficient.

Prefer native HTML elements.

Avoid unnecessary ARIA attributes.

---

# ERROR PREVENTION

Confirmation

Validation

Undo where possible

Helpful guidance

Never blame the user.

---

# LOADING STATES

Visible

Understandable

Accessible

Announced when necessary

Never leave users guessing.

---

# LANGUAGE

Simple

Clear

Readable

Luxury does not mean complexity.

---

# TESTING

Every release should be tested using

Keyboard only

Screen reader

Reduced motion

Mobile devices

Lighthouse

Accessibility audit

Real users whenever possible

---

# SUCCESS METRICS

Accessibility Score

100

Keyboard Navigation

100%

Screen Reader Compatibility

100%

Visible Focus

100%

WCAG Compliance

AA+

---

# ACCESSIBILITY RULES

Never sacrifice accessibility for animation.

Never sacrifice accessibility for aesthetics.

Never sacrifice accessibility for trends.

Inclusive design is premium design.

---

# FINAL OBJECTIVE

Every visitor should feel that Rangbastra is effortless to explore, regardless of ability, device or interaction method.

Accessibility should quietly elevate the experience without drawing attention to itself.

---

Document Status

Production Ready

Framework

Cloutora Luxury Framework

Version

1.0


---


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


---


# RANGBASTRA.LUXURY

# DEPLOYMENT

Version: 1.0

Last Updated: June 2026

Status: Production Ready

Owner: Cloutora

---

# PURPOSE

Define the complete deployment strategy for Rangbastra.luxury.

Every deployment must be predictable, repeatable, secure and reversible.

Deployment should never introduce unexpected behavior.

---

# DEPLOYMENT PHILOSOPHY

Documentation

↓

Development

↓

Testing

↓

Optimization

↓

Build

↓

Deployment

↓

Verification

↓

Monitoring

Never skip any stage.

---

# HOSTING

Primary: Vercel

Framework: Astro

CDN: Vercel Edge Network

Media: Cloudinary

Version Control: GitHub

---

# ENVIRONMENTS

Local

Development

Preview

Production

Every environment should behave consistently.

---

# BRANCH STRATEGY

main

Production Ready

develop

Integration

feature/*

New Features

hotfix/*

Urgent Fixes

Never develop directly on main.

---

# PRE DEPLOYMENT CHECKLIST

Documentation Updated

Build Successful

TypeScript Errors: 0

Lint Errors: 0

Broken Links: 0

Accessibility Verified

Performance Verified

SEO Verified

Images Optimized

Animations Tested

Responsive Testing Completed

---

# BUILD REQUIREMENTS

Production Build

Zero Console Errors

Zero Runtime Errors

Zero Missing Assets

Zero Failed Imports

---

# PERFORMANCE REQUIREMENTS

Lighthouse: 98+

Accessibility: 100

Best Practices: 100

SEO: 100

CLS: < 0.05

LCP: < 2 seconds

---

# ASSET REQUIREMENTS

Images: AVIF/WebP

Videos: Optimized

Fonts: Preloaded

Icons: SVG

Unused Assets Removed

---

# ENVIRONMENT VARIABLES

Never hardcode

API Keys

Cloudinary Credentials

Analytics IDs

Third Party Tokens

Secrets belong in environment variables only.

---

# SECURITY

HTTPS Required

Secure Headers

No Sensitive Data

Minimal Client Exposure

Sanitized Inputs

Validated Forms

---

# CACHE STRATEGY

Static Assets: 365 Days

Images: 365 Days

Fonts: 365 Days

HTML: Short Cache

Dynamic Content: Appropriate Cache

---

# POST DEPLOYMENT VERIFICATION

Homepage

Navigation

Collections

Products

Consultation

Forms

WhatsApp

Instagram

Google Maps

Animations

Mobile

Desktop

Dark Sections

Accessibility

Every page should be verified manually.

---

# CROSS DEVICE TESTING

Mobile

Tablet

Laptop

Desktop

Large Displays

Landscape

Portrait

---

# BROWSER SUPPORT

Chrome

Safari

Edge

Firefox

Latest Stable Versions

---

# ANALYTICS

Google Analytics

Google Search Console

Microsoft Clarity

Consultation Events

WhatsApp Events

Form Submissions

---

# MONITORING

404 Errors

Performance

Core Web Vitals

Console Errors

Broken Images

Broken Links

Accessibility Score

SEO Health

---

# ROLLBACK STRATEGY

Previous deployment remains available.

Rollback should complete within minutes.

Never deploy without rollback capability.

---

# VERSIONING

Major

Breaking Changes

Minor

New Features

Patch

Bug Fixes

Follow Semantic Versioning.

---

# RELEASE NOTES

Every deployment must include

Summary

Features

Fixes

Performance Improvements

Known Issues

Future Tasks

---

# SUCCESS CRITERIA

Successful Build

Successful Deployment

Successful Verification

Successful Monitoring

No Critical Issues

---

# DEPLOYMENT RULES

Never deploy without testing.

Never deploy with known critical bugs.

Never deploy without documentation updates.

Never deploy directly from experimental branches.

---

# FINAL OBJECTIVE

Deployment should become a routine engineering operation rather than a stressful event.

Every release should increase stability, quality and confidence while preserving the premium experience expected from Rangbastra.luxury.

---

Document Status: Production Ready

Framework: Cloutora Luxury Framework

Version: 1.0




# RANGBASTRA.LUXURY

# QA CHECKLIST

Version: 1.0

Last Updated: June 2026

Status: Production Ready

Owner: Cloutora

---

# PURPOSE

Define the quality assurance standards for Rangbastra.luxury.

Every release must pass this checklist before deployment.

Quality is mandatory.

---

# QA PHILOSOPHY

Business

↓

Experience

↓

Functionality

↓

Performance

↓

Accessibility

↓

Deployment

Every layer must be verified.

---

# VISUAL QA

□ Brand colors consistent

□ Typography matches Design System

□ Logo renders correctly

□ Images maintain aspect ratio

□ Whitespace consistent

□ Border radius consistent

□ Shadows consistent

□ Gradients render correctly

□ No layout breaks

□ No overflow

---

# RESPONSIVE QA

□ Mobile (320px)

□ Mobile (375px)

□ Mobile (430px)

□ Tablet (768px)

□ Laptop (1024px)

□ Desktop (1440px)

□ Large Display (1920px+)

□ Portrait mode

□ Landscape mode

---

# NAVIGATION QA

□ Logo links home

□ Navigation links work

□ Mobile menu works

□ Active states visible

□ Keyboard navigation works

□ Focus states visible

□ Footer navigation works

---

# COMPONENT QA

□ Hero renders correctly

□ Buttons behave consistently

□ Cards animate correctly

□ Forms validate properly

□ Gallery opens correctly

□ Modals trap focus

□ CTA sections function correctly

---

# CONTENT QA

□ No placeholder text

□ No lorem ipsum

□ No duplicate content

□ Grammar verified

□ Brand Voice maintained

□ Copywriting System followed

□ Product information accurate

□ Contact information accurate

---

# IMAGE QA

□ AVIF/WebP loading

□ Responsive images

□ Lazy loading works

□ Alt text available

□ No broken images

□ Cloudinary transformations correct

---

# ANIMATION QA

□ GSAP initialized correctly

□ Reveal animations smooth

□ Hover interactions consistent

□ No animation glitches

□ Reduced motion respected

□ No layout shifts

---

# PERFORMANCE QA

□ Lighthouse Performance 98+

□ Accessibility 100

□ Best Practices 100

□ SEO 100

□ LCP < 2 seconds

□ CLS < 0.05

□ Smooth scrolling

---

# ACCESSIBILITY QA

□ Semantic HTML

□ Keyboard navigation

□ Screen reader compatibility

□ Visible focus

□ Proper heading hierarchy

□ Form labels present

□ Color contrast verified

□ ARIA attributes correct

---

# SEO QA

□ Meta titles

□ Meta descriptions

□ Canonical URLs

□ Open Graph

□ Twitter Cards

□ Structured Data

□ Sitemap

□ Robots.txt

□ Internal links

---

# FORM QA

□ Required validation

□ Error messages

□ Success messages

□ WhatsApp integration

□ Email submission

□ File uploads

□ Keyboard support

---

# CONSULTATION QA

□ Consultation CTA

□ WhatsApp CTA

□ Visit Boutique CTA

□ Appointment flow

□ Confirmation state

---

# CROSS BROWSER QA

□ Chrome

□ Edge

□ Firefox

□ Safari

Latest stable versions only.

---

# DEVICE QA

□ Android

□ iPhone

□ Tablet

□ Windows

□ macOS

---

# LINK QA

□ Internal links

□ External links

□ Instagram

□ Google Maps

□ WhatsApp

□ Email

□ Policy pages

---

# SECURITY QA

□ HTTPS active

□ Environment variables secure

□ No exposed secrets

□ Forms validated

□ Inputs sanitized

---

# ANALYTICS QA

□ Google Analytics

□ Search Console

□ Microsoft Clarity

□ Consultation events

□ WhatsApp events

□ Form tracking

---

# DEPLOYMENT QA

□ Production build successful

□ Zero console errors

□ Zero runtime errors

□ Zero missing assets

□ Zero broken imports

---

# MANUAL REVIEW

□ Homepage reviewed

□ Collection pages reviewed

□ Product pages reviewed

□ Consultation reviewed

□ Footer reviewed

□ Mobile reviewed

□ Desktop reviewed

---

# FINAL APPROVAL

Technical Lead

□ Approved

Creative Lead

□ Approved

Founder

□ Approved

Client

□ Approved

---

# RELEASE DECISION

All critical issues resolved

YES / NO

Deployment Approved

YES / NO

---

# FINAL OBJECTIVE

Every visitor should experience Rangbastra as a flawless luxury digital experience.

No detail is too small.

No inconsistency is acceptable.

Quality is the product.

---

Document Status: Production Ready

Framework: Cloutora Luxury Framework

Version: 1.0



---


# RANGBASTRA.LUXURY

# AI WORKFLOW

Version: 1.0

Last Updated: June 2026

Status: Production Ready

Owner: Cloutora

---

# PURPOSE

Define the standard workflow for collaborating with AI systems during planning, design, development, testing and maintenance.

AI is an engineering partner.

AI is never the source of truth.

Project documentation is always the source of truth.

---

# AI PHILOSOPHY

Business Vision

↓

Documentation

↓

Architecture

↓

Design

↓

AI Context

↓

Implementation

↓

Review

↓

Optimization

↓

Deployment

AI never skips documentation.

---

# SOURCE OF TRUTH

Priority Order

1. Project Documentation

2. Design System

3. Development Rules

4. Current Task

5. AI Suggestions

If AI conflicts with documentation,

documentation always wins.

---

# AI RESPONSIBILITIES

Generate Components

Generate Layouts

Generate Utilities

Generate Types

Generate Tests

Generate Documentation

Suggest Improvements

Identify Bugs

Optimize Performance

Never modify architecture without approval.

---

# HUMAN RESPONSIBILITIES

Business Decisions

Brand Decisions

Architecture Approval

Final Review

Deployment Approval

Client Communication

AI assists.

Humans decide.

---

# STANDARD AI EXECUTION FLOW

Read Documentation

↓

Understand Context

↓

Plan Solution

↓

Explain Approach

↓

Generate Implementation

↓

Self Review

↓

Optimization

↓

Final Output

Never jump directly to code.

---

# TASK EXECUTION

Every task begins with

Objective

Requirements

Constraints

Expected Output

Success Criteria

AI should never assume missing requirements.

---

# COMPONENT GENERATION

Input

Component Specification

↓

Design System

↓

Motion System

↓

Accessibility

↓

Development Rules

↓

Output

Production Ready Component

---

# PAGE GENERATION

Pages compose

Experiences

↓

Sections

↓

Components

Pages never duplicate logic.

---

# CONTENT GENERATION

Always follow

Brand Voice

↓

Copywriting System

↓

SEO Strategy

↓

Current Context

---

# CODE GENERATION RULES

Readable

Reusable

Accessible

Responsive

Typed

Optimized

Documented

Maintainable

No shortcuts.

---

# SELF REVIEW

Before completing any task AI should verify

Architecture

Performance

Accessibility

SEO

Responsiveness

Naming

Consistency

---

# IMPROVEMENT POLICY

AI should proactively suggest

Better Architecture

Better Performance

Better Accessibility

Better UX

Better Maintainability

Better Scalability

without waiting for permission.

---

# REFACTOR POLICY

If AI identifies

Duplicated Code

Complex Logic

Poor Naming

Performance Issues

Accessibility Issues

it should recommend refactoring before adding features.

---

# ERROR HANDLING

Never guess.

Never fabricate.

Ask for clarification only when required.

Otherwise choose the safest documented approach.

---

# COMMUNICATION STYLE

Explain decisions.

Keep responses structured.

Provide reasoning.

Recommend best practices.

Prioritize long-term maintainability.

---

# DOCUMENTATION UPDATES

If architecture changes,

recommend updating

Project Architecture

Development Rules

AI Execution Context

before implementation.

---

# QUALITY CHECK

Every generated output should satisfy

Design System

Brand Voice

Motion System

Accessibility

Performance

SEO

Development Rules

QA Checklist

---

# AI LIMITATIONS

AI provides recommendations.

AI does not replace

Testing

Manual Review

Business Approval

Client Approval

Deployment Approval

---

# FUTURE AI

This workflow should remain compatible with

Claude Code

Codex

GitHub Copilot

Cursor

Gemini

Future AI systems

without modification.

---

# SUCCESS METRICS

Consistent Code

Minimal Refactoring

Predictable Architecture

High Maintainability

Fast Development

Reusable Components

Stable Releases

---

# FINAL OBJECTIVE

Every AI interaction should make the project more consistent, more maintainable and more valuable.

AI should behave like a senior engineering partner that understands the complete Cloutora Luxury Framework before writing a single line of code.

---

Document Status: Production Ready

Framework: Cloutora Luxury Framework

Version: 1.0.