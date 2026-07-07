# RANGBASTRA.LUXURY

# DESIGN DECISIONS

Version: 1.0

Last Updated: June 2026

Status: Living Document

Owner: Cloutora

---

# PURPOSE

This document records every significant architectural, design and engineering decision made during the development of Rangbastra.luxury.

Every decision includes context, reasoning and expected long-term impact.

Nothing important should rely on memory.

---

# DECISION FORMAT

Decision ID

Date

Category

Problem

Options Considered

Decision

Reasoning

Long Term Impact

Status

---

# DECISION 001

Category

Project Philosophy

Problem

Traditional websites become difficult to scale and maintain.

Decision

Adopt Documentation First Development.

Reason

Documentation creates consistency for humans and AI.

Long Term Impact

Faster onboarding

Better AI generation

Reduced refactoring

Status

Accepted

---

# DECISION 002

Category

Architecture

Problem

Traditional page-first architecture limits storytelling.

Decision

Adopt Experience Driven Architecture.

Reason

Luxury brands communicate through experiences instead of pages.

Long Term Impact

Better storytelling

Reusable experiences

Higher perceived value

Status

Accepted

---

# DECISION 003

Category

Framework

Problem

Need high performance with minimal JavaScript.

Decision

Use Astro.

Reason

Excellent static performance

Island architecture

SEO friendly

Simple deployment

Long Term Impact

98+ Lighthouse

Better maintainability

Reduced JavaScript

Status

Accepted

---

# DECISION 004

Category

Styling

Decision

Use Tailwind CSS.

Reason

Consistency

Design tokens

Rapid development

Maintainability

Status

Accepted

---

# DECISION 005

Category

Animation

Decision

Use GSAP.

Reason

Production quality motion

Timeline support

Performance

Fine control

Status

Accepted

---

# DECISION 006

Category

Media

Decision

Use Cloudinary.

Reason

Automatic optimization

Responsive images

AVIF

WebP

Transformation API

Status

Accepted

---

# DECISION 007

Category

Content

Decision

Use Content Collections and JSON driven architecture.

Reason

Content independent from presentation.

Status

Accepted

---

# DECISION 008

Category

Commerce

Problem

Traditional ecommerce feels transactional.

Decision

Luxury Consultation Flow instead of Add To Cart.

Flow

Select Outfit

↓

Customize

↓

Upload Inspiration

↓

Measurements

↓

WhatsApp Consultation

Reason

Supports personalized couture experience.

Status

Accepted

---

# DECISION 009

Category

Brand Positioning

Decision

Position Rangbastra as

Luxury Couture House

instead of

Online Clothing Store.

Reason

Higher perceived value.

Better differentiation.

Status

Accepted

---

# DECISION 010

Category

Design

Decision

Obsidian Cocoa Color System.

Primary Gradient

#0F0F10

↓

#6A4E42

Reason

Premium

Timeless

Elegant

Status

Accepted

---

# DECISION 011

Category

Typography

Decision

Cormorant Garamond

Montserrat

Segoe Script

Reason

Editorial hierarchy

Luxury feel

Readable body copy

Signature product identity

Status

Accepted

---

# DECISION 012

Category

Documentation

Decision

Documentation before implementation.

Reason

Architecture should guide code.

Never the opposite.

Status

Accepted

---

# DECISION 013

Category

AI

Decision

AI assists.

Documentation decides.

Reason

Predictable architecture.

Consistent output.

Status

Accepted

---

# DECISION 014

Category

Performance

Decision

Performance Budget

Initial Payload < 1 MB

JavaScript < 150 KB

CSS < 80 KB

Reason

Performance is luxury.

Status

Accepted

---

# DECISION 015

Category

Accessibility

Decision

WCAG 2.2 AA mandatory.

Reason

Accessibility is invisible luxury.

Status

Accepted

---

# DECISION 016

Category

SEO

Decision

Brand Voice

↓

Copywriting

↓

SEO

Reason

Search engines should understand the brand through authentic content.

Status

Accepted

---

# DECISION 017

Category

Documentation

Decision

Use Title Case filenames.

Reason

Human readable

AI friendly

Cleaner repository

Status

Accepted

---

# DECISION 018

Category

Engineering

Decision

One Component

↓

One Responsibility

Reason

Maintainability

Scalability

Testing

Status

Accepted

---

# DECISION 019

Category

Development

Decision

Business

↓

Documentation

↓

Design

↓

Architecture

↓

AI

↓

Code

↓

Review

↓

Optimization

↓

Deployment

Reason

Long-term stability.

Status

Accepted

---

# DECISION 020

Category

Framework

Decision

Build Cloutora Luxury Framework instead of a single client website.

Reason

Reusable systems create exponential value.

Status

Accepted

---

# FUTURE DECISIONS

Every major architectural change should be recorded here before implementation.

No undocumented architectural change should reach production.

---

# FINAL OBJECTIVE

The project should preserve not only its code but also the reasoning behind every important decision.

Future developers and AI systems should understand not only what was built, but why it was built.

---

Document Status: Living Document

Framework: Cloutora Luxury Framework

Version: 1.0