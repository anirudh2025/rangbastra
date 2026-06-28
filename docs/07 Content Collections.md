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