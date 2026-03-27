## MODIFIED Requirements

### Requirement: The public site adapts to user device and theme state
The system SHALL present the blog through responsive layouts and reader theme preferences, with a top-right theme control and support for following the user's operating-system theme.

#### Scenario: Resolve theme for a first-time visitor
- **WHEN** a visitor opens the public site without a saved theme preference
- **THEN** the system follows the browser or operating-system `prefers-color-scheme` setting to choose the active light or dark presentation

#### Scenario: Restore an explicit reader theme choice
- **WHEN** a returning visitor previously selected `light`, `dark`, or `system`
- **THEN** the site restores that saved preference on load and applies the corresponding active theme before the main public UI fully paints

#### Scenario: Change theme from the top-right control
- **WHEN** a visitor uses the theme button in the top-right public navigation area
- **THEN** the site lets the visitor switch between `light`, `dark`, and `system`, updates the active theme immediately, and persists the new preference for future visits

#### Scenario: Read on mobile
- **WHEN** a visitor uses a narrow viewport
- **THEN** the layout collapses secondary navigation into mobile-friendly controls while preserving access to the main article content and the theme-switching entry point
