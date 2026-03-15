## MODIFIED Requirements

### Requirement: Administrators can author and edit articles
The system SHALL allow authenticated administrators to create, edit, preview, and update article records with managed image-upload workflows for summary media and inline article content.

#### Scenario: Upload article cover or card media
- **WHEN** an authenticated administrator uploads a `cover` or `cardCover` image from the article editor
- **THEN** the editor stores the returned canonical image URL for that article field and surfaces whether the upload used the configured external provider or the protected local fallback path

#### Scenario: Insert an inline image into article Markdown
- **WHEN** an authenticated administrator uploads an inline image while editing article Markdown
- **THEN** the editor inserts a usable Markdown image reference into the article content without requiring manual URL copy/paste

#### Scenario: Continue authoring when the external provider is unavailable
- **WHEN** the configured external image provider rejects or cannot complete an article-media upload and protected local fallback is available
- **THEN** the editor can continue the upload flow through the fallback path without losing the current draft state
