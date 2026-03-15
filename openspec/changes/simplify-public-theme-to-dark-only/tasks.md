## 1. Public Theme Foundation

- [x] 1.1 Replace the public reader theme contract with a deterministic dark-only presentation and remove client-side reader theme/color preference persistence.
- [x] 1.2 Update any public integrations that currently depend on dynamic theme state so they render consistently in dark mode.

## 2. Reader UI Cleanup

- [x] 2.1 Remove desktop and mobile navigation theme-toggle controls from the public site.
- [x] 2.2 Remove the floating quick-settings panel, gear trigger, and theme-color selector while preserving remaining utility actions such as back-to-top.

## 3. Validation

- [x] 3.1 Verify public home, listing, article-detail, and mobile navigation flows still render correctly with the fixed dark presentation.
- [x] 3.2 Run targeted validation for affected frontend files and document residual risk from the repository's known `lint` and `build` issues if full checks remain blocked.
