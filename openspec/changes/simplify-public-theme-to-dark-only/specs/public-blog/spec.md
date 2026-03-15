## MODIFIED Requirements

### Requirement: The public site adapts to user device with a fixed dark presentation
The system SHALL present the blog through responsive layouts with a single supported dark theme, without reader-selectable theme or accent-color controls.

#### Scenario: Open any public page
- **WHEN** a visitor opens a public page
- **THEN** the site renders in the supported dark presentation without restoring a saved reader theme or color preference

#### Scenario: Read on mobile
- **WHEN** a visitor uses a narrow viewport
- **THEN** the layout collapses secondary navigation into mobile-friendly controls while preserving access to the main article content without exposing theme-management actions

#### Scenario: Read article discussions
- **WHEN** a visitor opens a page with the discussion integration
- **THEN** the discussion UI matches the site's fixed dark presentation
