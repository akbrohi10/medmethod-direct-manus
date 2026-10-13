
## Intake Consent Checkbox Repair — 2026-10-13
- [x] Reproduce the live `/intake/?prefill=demo` failure: both final consent checkboxes were rendered disabled whenever the currently open disclosure state did not include both `Possible side effects` and `Serious risks`; the disabled Continue button in the reported screenshot was therefore expected from the defective condition.
- [x] With owner approval, update only the imported `/intake/` document: record the two default-open required disclosures as read, retain that read state if the user collapses them, and keep both final checkbox controls usable.
- [x] Make the two final choices mutually exclusive: selecting consent clears decline and enables Continue; selecting decline clears consent, displays the existing cannot-continue explanation, and keeps Continue disabled. Do not submit, store, transmit, activate, or alter PayPal/Keragon/API behavior.
- [x] Add regression coverage and validate 6 focused tests, TypeScript, production build, fresh-production static serving/noindex, and non-submitting desktop/mobile browser QA. Browser QA confirms collapsed disclosures do not disable controls, consent/decline choices are exclusive, consent enables Continue, decline blocks it, and no integration request occurs.
- [x] Full suite remains 334 passing/2 failing across 69 files—the same previously documented compliance guard failures from the earlier imported weight-loss prototypes; no new test failure introduced.
- [ ] Save this approved repair as an unpublished checkpoint; no live publication is authorized.
