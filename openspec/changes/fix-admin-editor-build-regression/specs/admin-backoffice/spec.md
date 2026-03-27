## MODIFIED Requirements

### Requirement: Administrators can author and edit articles
The system SHALL allow authenticated administrators to create, edit, preview, and update article records with managed image-upload workflows that remain compatible with the production admin bundle.

#### Scenario: Compile the article editor with managed upload controls enabled
- **WHEN** the production frontend bundle includes the article editor's `cover`, `cardCover`, and inline-image upload controls
- **THEN** the admin bundle compiles successfully without callback-ordering regressions that prevent administrators from loading the editor
