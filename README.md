# Portfolio Website

Salem Elatrash’s personal portfolio for software engineering, applied AI and data work.

[Visit the current portfolio](https://slooma951.github.io/portfolio/)

## This refresh

A bright white, cobalt and pale-blue design with real project screenshots, responsive navigation, filterable project stories, education, experience, skills and contact links. Filters progressively enhance a page that remains complete without JavaScript. Motion is restrained and respects reduced-motion preferences. No framework, external fonts, analytics or runtime dependencies are required.

The homepage includes Assistant S, Scribevo, Reunio and DVS Note, with clear distinctions between ongoing development, published work, prototypes and academic archives. Education and experience are based on the current CV. The DataCamp Introduction to Python completion is dated 15 November 2026. No unverified certifications, customers or outcomes are claimed.

The public CV download is retained. It omits private phone and student contact details. Product screenshots are presentation evidence, not current adoption figures. The Assistant S screenshot is historical and labelled accordingly.

## Repository and compatibility

The existing repository slug remains **portfolio**, preserving its published GitHub Pages address and incoming links. The separate **projectweb** repository preserves historical Scribevo support and privacy URLs. Renaming either repository needs a compatibility review before any live change.

This repository contains static portfolio pages and public project explanations, not the private implementation of Assistant S or Scribevo. Private data, credentials, datasets and model artefacts must remain excluded.

## Review locally

```sh
python -m http.server 8000
```

Open `http://localhost:8000/`. There is no installation or build step. The homepage uses `css/refresh.css` and `js/refresh.js`. Original styles, scripts, case-study routes, legal pages and assets are retained. `build_content.py` is a historical generator: do not run it over hand-maintained pages without reviewing its output, because it can restore older project descriptions.

## Verification and publication

Review desktop and mobile layouts, keyboard navigation, project filters, no-JavaScript behavior, reduced-motion preferences, local links and metadata before publication. A local branch is a review preview, not a deployed update. Publishing, repository renaming and hosting/settings changes require Salem’s approval.
