# Portfolio Website

Salem Elatrash’s personal portfolio for software engineering, applied AI and data work.

[Visit the current portfolio](https://slooma951.github.io/portfolio/)

## This version (November 2026)

A dark, chrome-and-iridescent design built around Assistant S's voice orb. The hero orb is drawn live on a canvas: it breathes, bulges toward the pointer and pauses when off screen or when reduced motion is requested. Projects (Assistant S, Scribevo, Teist, Reunio and smaller work), experience, education, certificates, skills and contact details come from the current CV and verified records. The Assistant S screenshots are from the current build, captured from a clean state.

Hand-written HTML, CSS and JavaScript. No frameworks, trackers or external requests; the Lexend font is self-hosted under the SIL Open Font Licence.

## Repository and compatibility

The existing repository slug remains **portfolio**, preserving its published GitHub Pages address and incoming links. The separate **projectweb** repository preserves historical Scribevo support and privacy URLs. Renaming either repository needs a compatibility review before any live change.

This repository contains static portfolio pages and public project explanations, not the private implementation of Assistant S or Scribevo. Private data, credentials, datasets and model artefacts must remain excluded.

## Review locally

```sh
python -m http.server 8000
```

Open `http://localhost:8000/`. There is no installation or build step. The homepage uses `css/main.css` and `js/main.js`; case-study pages keep `css/home.css`. Original styles, scripts, case-study routes, legal pages and assets are retained. `build_content.py` is a historical generator: do not run it over hand-maintained pages without reviewing its output, because it can restore older project descriptions.

## Verification and publication

Review desktop and mobile layouts, keyboard navigation, project filters, no-JavaScript behavior, reduced-motion preferences, local links and metadata before publication. A local branch is a review preview, not a deployed update. Publishing, repository renaming and hosting/settings changes require Salem’s approval.
