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
