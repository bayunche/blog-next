## 1. Shared Responsive Foundation

- [x] 1.1 Add shared responsive spacing and safe-area rules for fixed navbar offset, bottom utility clearance, and viewport-safe overlay sizing.
- [x] 1.2 Refactor shared public floating utilities (`FloatingToolbar`, `MusicPlayer`, mobile `TableOfContents`, search/modal surfaces) so they remain usable on narrow screens without covering core content.
- [x] 1.3 Refactor shared admin shell/navigation so narrow viewports can access backoffice routes without a permanently visible desktop sidebar.

## 2. Public Route Hardening

- [x] 2.1 Update public landing and collection surfaces (`Hero`, `FeaturedPosts`, `TopicGrid`, article cards, sidebar usage) to follow single-column-first responsive behavior.
- [x] 2.2 Update public route families `/posts`, `/categories/{name}`, `/tags/{name}`, `/archives`, `/about`, and `/friends` to prevent mobile overflow, clipped badges, and compressed content.
- [x] 2.3 Update article detail reading surfaces (`/posts/{id}`) so header metadata, content width, related sections, comments, and table-of-contents access remain readable and unobstructed on narrow screens.
- [x] 2.4 Update `/login` and other public overlays/modals to fit small screens without layout clipping.

## 3. Backoffice Hardening

- [x] 3.1 Update admin dashboard, article/category/tag management screens, and shared admin table patterns for narrow-screen usability.
- [x] 3.2 Update article create/edit flows so metadata fields, upload controls, music search results, preview surfaces, and editor actions stack correctly on mobile.

## 4. Validation

- [ ] 4.1 Manually verify the audited public routes and admin routes at representative narrow/mobile viewport sizes, including floating utility interactions.
- [x] 4.2 Run targeted validation for affected frontend code and document residual risk from the repository's known `lint` and `build` blockers if full checks remain unavailable.

Manual narrow-viewport browser QA remains pending because this CLI environment does not provide an interactive browser or bundled viewport automation. Targeted `eslint` and `tsc --noEmit` were run after implementation; remaining lint failures are pre-existing `@typescript-eslint/no-explicit-any` issues inside `src/app/admin/components/ArticleEditor.tsx`, plus existing `no-img-element` warnings on media-heavy admin/music surfaces and a benign `globals.css` config-ignore warning.
