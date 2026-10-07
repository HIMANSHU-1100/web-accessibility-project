# Accessibility Audit Report

## Website Audited

**Website:** https://www.india.gov.in/

**Tool:** Google Lighthouse

**Audit Type:**
- Lighthouse accessibility audit
- Keyboard-only navigation test

**Accessibility Score:** 85/100

---

## Audit Summary

The India.gov.in website received an accessibility score of 85/100 in the Lighthouse audit.

The audit identified issues related to ARIA structure, hidden focusable elements, color contrast, and semantic HTML structure.

A manual keyboard-only navigation test was also performed.

---

## Accessibility Issues

### 1. ARIA Roles Are Not Contained by Required Parent Elements

**Issue:**  
Some elements using ARIA roles are not contained within their required parent elements.

**Evidence:**  
Lighthouse reported:

`[role]s are not contained by their required parent element`

The affected element was associated with:

`#topBarServiceList`

**Impact:**  
Incorrect ARIA structure can cause screen readers and assistive technologies to interpret the page incorrectly.

**Severity:** High

**Priority:** P1

**Recommended Fix:**  
Use the correct parent-child structure for ARIA roles. Where possible, use native HTML elements instead of unnecessary ARIA roles.

**Ownership:** Frontend / Accessibility

---

### 2. Focusable Elements Inside aria-hidden="true"

**Issue:**  
Focusable elements were found inside elements marked with `aria-hidden="true"`.

**Evidence:**  
Lighthouse reported:

`[aria-hidden="true"] elements contain focusable descendants`

Affected content included service and trending links.

**Impact:**  
Screen-reader users may not be able to access content that can still receive keyboard focus.

**Severity:** High

**Priority:** P1

**Recommended Fix:**  
Do not place focusable elements inside `aria-hidden="true"` containers. Properly manage hidden carousel content and keyboard focus.

**Ownership:** Frontend / Accessibility

---

### 3. Insufficient Color Contrast

**Issue:**  
Some foreground text does not have sufficient contrast against its background.

**Evidence:**  
Lighthouse reported:

`Background and foreground colors do not have a sufficient contrast ratio.`

Affected service tiles included text such as:

- CENTRAL GOVERNMENT
- STATE GOVERNMENT
- IMPORTANT SERVICES
- INFORMATION CATEGORIES

**Impact:**  
Low contrast makes text difficult to read for users with low vision or color-vision deficiencies.

**Severity:** High

**Priority:** P1

**Recommended Fix:**  
Increase the contrast between the text and background so that the content is easier to read and meets accessibility requirements.

**Ownership:** Frontend / UI Design

---

### 4. List Items Are Not Contained Within a Valid List

**Issue:**  
Some `<li>` elements are not contained within `<ul>`, `<ol>`, or `<menu>` elements.

**Evidence:**  
Lighthouse reported:

`List items (<li>) are not contained within <ul>, <ol> or <menu> parent elements.`

The affected elements were related to news cards.

**Impact:**  
Screen readers rely on semantic list structures to understand groups of related content.

**Severity:** Medium

**Priority:** P2

**Recommended Fix:**  
Place related `<li>` elements inside an appropriate `<ul>` or `<ol>` element.

Example:

```html
<ul>
    <li>News item 1</li>
    <li>News item 2</li>
    <li>News item 3</li>
</ul>