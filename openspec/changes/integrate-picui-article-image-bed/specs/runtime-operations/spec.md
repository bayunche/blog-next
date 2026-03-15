## MODIFIED Requirements

### Requirement: Runtime behavior is environment-configurable
The system SHALL derive runtime endpoints and integration credentials from environment configuration rather than hard-coded deployment values.

#### Scenario: Configure external article image storage
- **WHEN** deployment enables PicUI-backed article media through environment variables for the provider API base, server-held token, provider defaults, and public image host
- **THEN** backend upload brokering uses those server-side settings while the frontend only receives the public-host information required for rendering

#### Scenario: Keep provider secrets out of the frontend runtime
- **WHEN** the application is built and deployed with external image storage enabled
- **THEN** the permanent provider credential remains server-only and is not embedded into browser-visible configuration or client requests

### Requirement: The platform integrates with external content-adjacent services
The system SHALL support the configured external services used for comments, media, OAuth, and music-adjacent capabilities without requiring them to be embedded into the frontend codebase as first-party services.

#### Scenario: Use optional external image storage for article media
- **WHEN** article authoring depends on the configured external image-storage provider
- **THEN** runtime behavior calls the configured provider boundary for managed uploads while preserving the platform's local upload-serving path as a distinct fallback concern
