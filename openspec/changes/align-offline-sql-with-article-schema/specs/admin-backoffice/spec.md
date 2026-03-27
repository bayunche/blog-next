## MODIFIED Requirements

### Requirement: Administrators can author and edit articles
The system SHALL allow authenticated administrators to create, edit, preview, and update article records with rich content metadata, and supported offline restore workflows must preserve the stored schema needed to read that metadata afterward.

#### Scenario: Read article metadata after offline restore
- **WHEN** an offline-restored deployment loads article data that includes card-cover metadata configured through the editor
- **THEN** the backend can read that metadata from the restored schema without failing on missing article columns
