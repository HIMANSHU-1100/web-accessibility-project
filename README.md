# Web Accessibility & Architecture Project

## Project Overview

This project demonstrates a web accessibility audit and a monorepo-style
project architecture.

The project includes an accessibility audit of a public-facing website,
evidence of identified issues, and a setup-ready structure for a
frontend and backend web application.

---

## Website Audited

**Website:** https://www.india.gov.in/

**Audit Tool:** Google Lighthouse

**Accessibility Score:** 85/100

A keyboard-only navigation test was also performed to manually verify
keyboard accessibility.

---

## Accessibility Audit

The audit identified four accessibility issues:

| # | Issue | Severity | Priority |
|---|---|---|---|
| 1 | Incorrect ARIA role hierarchy | High | P1 |
| 2 | Focusable elements inside `aria-hidden="true"` | High | P1 |
| 3 | Insufficient color contrast | High | P1 |
| 4 | Incorrect list item structure | Medium | P2 |

The keyboard-only navigation test passed, with focus moving through
interactive elements in a logical order.

For detailed findings, evidence, and recommended fixes, see:

`docs/accessibility-audit.md`

---

## Project Structure

```text
web-accessibility-project/
│
├── client/
│   └── Frontend application
│
├── server/
│   └── Backend application and APIs
│
├── docs/
│   ├── accessibility-audit.md
│   └── architecture.md
│
├── tests/
│   └── Automated and manual test files
│
├── screenshots/
│   └── Accessibility audit evidence
│
└── README.md