# Changelog

All notable governed releases for `fpia-website` are recorded here.

## [0.9.0] - 2026-04-13

First controlled beta-ready governed release.

- Aligned public certificate and verify pages with the governed authority-backed trust model.
- Added clearer public authority identity presentation for inspector name, inspector code, badge number, registry standing, certificate number, and verification reference.
- Brought registrations intake and inspection request flows into the governed beta baseline.
- Added abuse protection to public intake endpoints, including rate limiting, honeypot checks, spam heuristics, and safer error handling.
- Replaced hardcoded operational recipient routing with environment-driven support and ops email configuration.
- Removed fragile external font fetch dependency at build time for deterministic production builds.
- Added governed release version display in the public footer for supportability and rollback traceability.
