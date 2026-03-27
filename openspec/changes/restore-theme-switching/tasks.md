## 1. Theme Foundation

- [x] 1.1 Add a public theme bootstrap and shared state utility that supports `system`, `light`, and `dark`, restores saved preference, and resolves the active theme before interactive paint.
- [x] 1.2 Refactor global theme tokens and root theme markers so both light and dark presentations are supported across shared public surfaces.

## 2. Reader Controls

- [x] 2.1 Add an accessible theme switcher button in the top-right public navigation area, with mobile parity and access to `system`, `light`, and `dark`.
- [x] 2.2 Update public shared components and embeds that currently assume dark-only behavior so they respond correctly to the resolved active theme.

## 3. Validation

- [ ] 3.1 Manually verify representative public routes in light mode, dark mode, and system-following mode, including reload restoration and mobile navigation behavior.
- [x] 3.2 Run targeted validation for affected frontend code and document residual risk from the repository's known `lint` and `build` blockers if full checks remain unavailable.

Manual browser verification remains pending in this CLI environment. Targeted `eslint` and `tsc --noEmit` were run for the new theme-related files; `globals.css` remains outside the active ESLint file matching, and the repository's known full `build` blocker around the missing Windows `lightningcss` native binary still applies.
