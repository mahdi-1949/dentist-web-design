# Sepid dental portfolio

Static, Persian RTL multi-page portfolio. Open index.html or serve this folder with any static HTTP server.

## Architecture
20 independent HTML pages share assets/site.css and assets/site.js. No client-side route rendering or duplicate runtime page builders. The booking and contact forms are demos: they make no network requests and store no personal data.

## Images
Illustrative stock photographs from Unsplash, not actual patients or clinic staff. Source photo IDs: smile 1494790108377-be9c29b29330; clinic 1629909613654-28e377c37b09; equipment 1629909615184-74f495363b67; clinician 1622253692010-333f2da6031d; child 1503454537195-1dcabb73ffb9; aligner 1609840114035-3c981b782dfe. Optimized WebP copies are stored locally. Font: Vazirmatn via Google Fonts.

## Demo interactions
Responsive header with keyboard Escape support, searchable FAQ, journal topic filters, three-step booking with validation and summary, contact demo. Respect prefers-reduced-motion; page contents remain readable with JavaScript disabled.
