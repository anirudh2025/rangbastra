# COMPONENT BLUEPRINT

Every component follows the same architecture.

---

## 1. Tokens

Never hardcode values.

Always consume component tokens.

Example

--navbar-background

--button-radius

--card-shadow

---

## 2. Structure

Semantic HTML only.

Never use div when a semantic element exists.

---

## 3. Layout

Container

↓

Wrapper

↓

Content

↓

Children

---

## 4. Styling

Consume only

Foundation

↓

Component Tokens

Never consume primitive values directly.

---

## 5. Motion

Use only framework motion utilities.

Never write custom transitions unless absolutely necessary.

---

## 6. Responsive

Desktop First

↓

Laptop

↓

Tablet

↓

Mobile

↓

Small Mobile

Only override what changes.

---

## 7. Accessibility

Keyboard

Screen Readers

Focus Visible

Reduced Motion

AA Contrast

---

## 8. Performance

No layout shift.

Lazy load media.

Minimal DOM.

GPU accelerated transforms.

---

## 9. Final Rule

Every component must feel like it belongs to the same luxury brand.