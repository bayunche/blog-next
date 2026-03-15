## MODIFIED Requirements

### Requirement: Readers can browse published article collections
The system SHALL allow public visitors to browse published articles from the home page, listing pages, archive views, category pages, and tag pages, including article cover media hosted on configured external image providers.

#### Scenario: Browse recent content with externally hosted cover media
- **WHEN** published article summaries reference `cover` or `cardCover` images on a configured external host
- **THEN** the system renders those images on public collection pages without broken-host assumptions in the frontend

### Requirement: Readers can open article detail pages
The system SHALL render article detail pages with structured content, metadata, navigation to surrounding content, and article images that can come from configured external hosts.

#### Scenario: Open a published article with externally hosted imagery
- **WHEN** a visitor opens an article whose cover or inline body images reference the configured external image provider
- **THEN** the page renders those images alongside the rest of the article content without requiring local-upload-only assumptions
