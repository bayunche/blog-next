## MODIFIED Requirements

### Requirement: The public site adapts to user device and theme state
The system SHALL present the blog through responsive layouts and persisted theme preferences across all supported public page families, including shared floating reader utilities and overlays.

#### Scenario: Read on mobile across public pages
- **WHEN** a visitor uses a narrow viewport on the home page, listing pages, taxonomy pages, archives, article detail pages, about page, or friends page
- **THEN** the layout keeps primary content readable in the viewport, reflows secondary content into compact/mobile-friendly composition, and avoids horizontal overflow or overlapping badges and actions

#### Scenario: Use reader utilities on mobile
- **WHEN** a visitor opens mobile search, table of contents, music controls, or quick utility actions on a narrow viewport
- **THEN** those controls remain reachable, dismissible, and positioned within viewport-safe areas without covering critical reading content or trapping other controls off-screen

#### Scenario: Read article content with secondary navigation on mobile
- **WHEN** a visitor reads a long article on a narrow viewport
- **THEN** the page preserves access to article metadata, comments, related content, and in-page navigation cues without requiring desktop-only sidebars
