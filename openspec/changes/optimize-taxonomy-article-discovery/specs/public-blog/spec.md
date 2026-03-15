## MODIFIED Requirements

### Requirement: Readers can browse published article collections
The system SHALL allow public visitors to browse published articles from the home page, listing pages, archive views, category pages, and tag pages through taxonomy navigation that stays aligned with published content only.

#### Scenario: Browse by taxonomy
- **WHEN** a visitor opens a category page or tag page
- **THEN** the system shows only published articles associated with that taxonomy and exposes related taxonomy suggestions derived from current published content

#### Scenario: Browse uncategorized published articles
- **WHEN** a visitor opens the uncategorized category page
- **THEN** the system shows published articles without a stored category relation instead of rendering an empty result solely because no category row exists

#### Scenario: Use public taxonomy navigation
- **WHEN** a visitor uses taxonomy chips or topic links on the home page, posts index, footer, or article cards
- **THEN** the system uses normalized taxonomy names and counts derived from published content so navigation does not point to draft-only or mismatched taxonomy pages
