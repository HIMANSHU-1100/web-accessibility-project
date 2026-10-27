# Semantic HTML5 & Accessible Component Architecture

This project is an accessible multi-page enterprise dashboard foundation built with semantic HTML5 and WCAG 2.1-oriented practices.

## Pages

- `index.html` — dashboard overview, metrics, activity table, and modal dialog
- `users.html` — user management, data table, filters, and invitation modal
- `reports.html` — reports table and accessible report request form
- `settings.html` — profile and notification settings form

## Accessibility practices

- Semantic landmarks: `header`, `nav`, `main`, `section`, `article`, `aside`, and `footer`
- Skip link for keyboard users
- Visible keyboard focus indicators
- `aria-current` for active navigation
- Explicit form labels associated with controls
- `fieldset` and `legend` for related controls
- Native HTML validation with `required`, `type`, `minlength`, and `pattern`
- Accessible data tables with captions and `scope="col"`
- Native `<dialog>` modal with labelled heading
- Responsive layout and readable document hierarchy

## Local setup

No build step is required. Open `index.html` in a browser, or serve the folder with any static HTTP server.

Example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Validation

Validate every HTML page with the W3C Nu HTML Checker before submission:
https://validator.w3.org/nu/

Record the validation result/screenshots as submission evidence.


## Task 5: Dynamic JavaScript DOM Logic & RESTful API Client

- `products.html` provides a product catalogue using the public FakeStore API.
- `js/api.js` contains the asynchronous API client, response validation, and short-lived `localStorage` cache.
- `js/app.js` handles rendering, live search, category filtering, sorting, loading states, retry/error UI, and saved sort preferences.
- Product cards are created with DOM APIs and text content rather than inserting API text as HTML.
- The catalogue keeps the dashboard's semantic structure, labelled controls, live status announcements, visible keyboard focus, responsive layout, and theme preference.

### Run locally

From the project root, run:

```bash
python -m http.server 8000
```

Open `http://localhost:8000/products.html`. An internet connection is required to fetch fresh FakeStore API data. Cached results are retained for up to five minutes when available.
