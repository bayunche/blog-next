## MODIFIED Requirements

### Requirement: Administrators can authenticate into the backoffice
The system SHALL provide an authenticated backoffice shell that remains navigable on narrow and wide viewports before protected management actions are allowed.

#### Scenario: Open a protected backoffice screen on mobile
- **WHEN** an authenticated administrator opens an admin route on a narrow viewport
- **THEN** the backoffice provides mobile-friendly navigation to management screens without permanently consuming desktop sidebar width or forcing horizontal page overflow

### Requirement: Administrators can author and edit articles
The system SHALL allow authenticated administrators to create, edit, preview, and update article records through layouts that remain operable on narrow viewports.

#### Scenario: Edit an article on mobile
- **WHEN** an authenticated administrator opens article create or edit screens on a narrow viewport
- **THEN** metadata fields, upload controls, music-selection UI, preview surfaces, and save/cancel actions remain visible and usable without clipped controls or inaccessible horizontal overflow

### Requirement: Administrators can manage taxonomy records
The system SHALL allow authenticated administrators to manage categories and tags through responsive listing and row-action patterns.

#### Scenario: Manage categories or tags on mobile
- **WHEN** an authenticated administrator opens taxonomy or article-management list screens on a narrow viewport
- **THEN** record information and edit/delete actions remain reachable through responsive table or compact-list behavior without hiding required controls off-screen
