## Context

The current public theme contract is incomplete in two ways:

- stylistically, many components already contain both default and `dark:` styles, which suggests the UI was built with dual-theme intent
- behaviorally, the root layout and CSS variables force the entire app into dark mode because there is no shared theme state, no persisted preference restoration, and no system-theme detection

The change therefore is not just "add a button". It needs a small public-site theme system that can:

- resolve the active theme from either a saved preference or `prefers-color-scheme`
- stamp the correct theme on the root document before the app becomes interactive
- expose a compact top-right control that lets the reader switch modes without creating layout clutter
- keep embedded or cross-cutting public UI in sync with the active theme

The implementation remains frontend-only, but the design still evaluates cross-system effects because the public site shares shell components, third-party embeds, and route composition with the rest of the application.

## Goals / Non-Goals

**Goals**

- Restore reader-visible light and dark mode support for the public site.
- Default to following the operating-system theme until the reader makes an explicit choice.
- Persist a reader's explicit choice and restore it on later visits.
- Place the theme switcher in the top-right public navigation area while keeping mobile navigation coherent.
- Avoid a first-render flash where the wrong theme is visible before hydration completes.

**Non-Goals**

- Add server-stored appearance preferences or authenticated user profile settings.
- Expand theme switching into the admin backoffice during this change.
- Introduce additional appearance customization such as accent-color pickers or typography presets.
- Change backend API contracts, database schema, upload/media routing, auth behavior, or deployment configuration.

## Decisions

### Decision: Support a three-state preference model with `system` as the default

The public theme preference should be modeled as:

- `system`: no manual override; resolve the active theme from `prefers-color-scheme`
- `light`: explicit reader override to light mode
- `dark`: explicit reader override to dark mode

Why:

- it satisfies the request to support both manual switching and following the system
- it preserves a clean first-visit behavior without assuming dark mode is always preferred
- it gives readers a way to return to "follow system" after trying a manual override

Impacted areas:

- client-side theme state utility/provider
- persistence key shape in browser storage
- theme-control UI copy and iconography

### Decision: Apply the resolved theme at the document root before interactive paint

The implementation should set `data-theme` and any matching root class on the `html` element as early as possible, using a tiny bootstrap script or equivalent pre-hydration mechanism in the root layout.

Why:

- a client-only `useEffect` update would cause a flash of dark mode or light mode on initial load
- the project already relies on `data-theme` selectors for dark variants, so early root mutation is the lowest-friction way to keep the existing styling model
- this avoids reworking the whole application around a different theming library if the existing CSS contract can be preserved

Impacted areas:

- `src/app/layout.tsx`
- public theme bootstrap utility
- `src/app/globals.css`

### Decision: Use semantic CSS variable layers for light and dark tokens

The global stylesheet should define light tokens as the base `:root` contract and override them under `[data-theme="dark"]`. Existing semantic variables such as `--background`, `--foreground`, `--card-bg`, and `--card-border` should remain the public styling API so most components do not need to know about theme mode directly.

Why:

- many components already use semantic variables or dark variants, so this minimizes blast radius
- it creates a real light theme baseline instead of treating dark mode as the only meaningful palette
- it keeps Tailwind utility usage and custom CSS selectors aligned

Impacted areas:

- global CSS token definitions
- components that currently assume dark-only raw colors
- visual QA across public pages and floating surfaces

### Decision: Expose the top-right button as a compact cycle/menu control in public navigation

The top-right action cluster in `Navbar` should gain a theme control. The UI should be compact and accessible, with an explicit label/tooltip and mobile parity. It may cycle through modes or open a small popover, but it must keep all three states reachable from the top-right area.

Why:

- it satisfies the user's requested placement
- it keeps the control discoverable alongside search and GitHub actions
- it avoids reintroducing the older floating settings panel pattern

Impacted areas:

- `src/shared/components/Navbar.tsx`
- mobile navigation interactions and focus handling

### Decision: Keep admin and backend boundaries unchanged in this change

The admin shell already uses `dark:` styles because the whole app currently renders under a dark root marker. This change will not add a separate admin theme feature. Admin pages should continue to render acceptably under the resolved root theme, but the approved scope is limited to the public-site capability.

Why:

- the user requested public theme switching behavior and control placement, not a broader backoffice appearance redesign
- keeping admin out of scope reduces implementation risk and review scope
- any admin-specific visual regressions discovered during implementation can be captured as follow-up work instead of silently expanding scope

## Alternatives Considered

### Alternative: Use `next-themes` or another dedicated theming package

Rejected for now because the project already has a working `data-theme` selector model and does not yet need a heavier abstraction. A small in-repo theme utility can satisfy persistence, system detection, and early root stamping with less dependency churn.

### Alternative: Offer only a binary light/dark toggle and automatically fall back to system on first visit

Rejected because it does not give readers an explicit way to return to "follow system" after manually switching. The request includes both manual switching and system following, so `system` needs to remain a visible supported state.

### Alternative: Put the theme control back into a floating toolbar or site settings panel

Rejected because the user explicitly asked for a right-top button, and the public UI already has a natural action cluster in the navbar. Reintroducing a separate settings surface would add unnecessary indirection.

## Risks / Trade-offs

- [First-paint mismatch] If the root theme is still set too late, users will see a flash of the wrong palette. Mitigation: use an early bootstrap script in the root layout and keep the theme key format simple.
- [Component color assumptions] Some public components currently hard-code dark-friendly colors outside semantic tokens. Mitigation: audit the theme-switching surface area and patch the obvious dark-only assumptions as part of implementation.
- [Admin visual coupling] Because the `html` theme marker is shared, admin pages may render differently under light mode than they do today. Mitigation: verify admin shell readability during implementation and keep admin-specific refactors out of scope unless they are required for basic correctness.
- [Spec conflict] `simplify-public-theme-to-dark-only` conflicts with this direction. Mitigation: treat this change as the active proposal for public theming and do not implement both directions simultaneously.
- [Validation limits] Repository-wide `npm run lint` and `npm run build` are already known to fail for unrelated reasons. Mitigation: run targeted checks where possible and document residual risk.

## Migration Plan

1. Add a public theme bootstrap utility that resolves `system` / `light` / `dark` and stamps the correct root attributes before the app paints.
2. Refactor global theme tokens so light mode is the base contract and dark mode is an override.
3. Add a top-right theme switcher in the public navbar and mobile navigation experience.
4. Persist manual theme preference in browser storage and keep public shared components synchronized with the active theme.
5. Verify representative public routes in both light and dark modes, plus system-following behavior and reload restoration.

Rollback strategy:

- Remove the public theme switcher and bootstrap utility.
- Restore the fixed root theme marker if the multi-theme behavior proves unstable.
- No backend, data, or deployment rollback is required because the change is frontend-only.

## Cross-System Impact Review

- Public frontend (`src/`): directly affected across root layout, global styles, navigation, floating reader utilities, and any third-party public embeds that should match theme.
- Backoffice (`src/app/admin/`): not a target capability for this change, but basic readability under the shared root theme must still be sanity-checked.
- Backend API (`server/`): intentionally unaffected; no route, controller, model, auth, or rewrite changes are expected.
- MySQL/data: intentionally unaffected; no schema, seed, or migration work is needed.
- Uploads/media/image bed/music integrations: no service contract change is expected, but public player/surface styling must stay coherent with the active theme.
- Build/test/runtime/Docker: no new runtime or deployment boundary change is intended; validation remains frontend-focused.
- Security/secrets: no secret-handling change is involved, and tracked local configuration files must remain untouched.
- Observability/docs: no new telemetry is introduced; OpenSpec artifacts become the source of truth for the theme behavior contract.
