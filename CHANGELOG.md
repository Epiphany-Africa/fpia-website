# Changelog

All notable governed releases for `fpia-website` are recorded here.

## [0.9.6] - 2026-04-29

- Restored the protected certificate PDF Reinstatement Estimate row so public PDFs always show the estimate state in the certificate details block.
- Improved the diagonal FPIA integrity watermark visibility while keeping the locked-certificate layout and footer structure unchanged.
- Corrected the compact valuation-disclaimer logic so pending estimate records show pending wording instead of a market-value disclaimer.
- Expanded the public PDF fallback-wording guard so internal location placeholders are never emitted on protected certificates.

## [0.9.5] - 2026-04-28

- Added the FPIA Seller Readiness Assessment public intake and the Pre-Listing Property Readiness Report surface.
- Added seller property and visible damage evidence capture, governed seller-readiness submission handling, storage-backed image intake, and ops event/email hooks.
- Added public seller-readiness report output and downloadable PDF output with clear separation between reinstatement estimate, visible damage repair exposure, and seller listing-posture guidance.
- Added conservative disclaimers so the feature is not interpreted as a formal valuation, QS report, engineering opinion, insurer assessment, or guaranteed sale-price estimate.

## [0.9.4] - 2026-04-28

- Fix protected certificate PDF regression: restored clean locked-certificate layout, removed internal fallback wording from public PDFs, improved property location rendering, restored subtle FPIA/hash watermark, and moved reinstatement estimate disclaimer out of the main certificate body.

## [0.9.0] - 2026-04-13

First controlled beta-ready governed release.

- Aligned public certificate and verify pages with the governed authority-backed trust model.
- Added clearer public authority identity presentation for inspector name, inspector code, badge number, registry standing, certificate number, and verification reference.
- Brought registrations intake and inspection request flows into the governed beta baseline.
- Added abuse protection to public intake endpoints, including rate limiting, honeypot checks, spam heuristics, and safer error handling.
- Replaced hardcoded operational recipient routing with environment-driven support and ops email configuration.
- Removed fragile external font fetch dependency at build time for deterministic production builds.
- Added governed release version display in the public footer for supportability and rollback traceability.
