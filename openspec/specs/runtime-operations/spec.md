# Runtime Operations Specification

## Purpose
Define the runtime composition and external integration boundaries that keep the blog platform operational.

## Requirements

### Requirement: The platform runs as separate frontend and backend services
The system SHALL run the public web application and the Koa API as separate runtime concerns connected through environment-driven routing.

#### Scenario: Frontend requests API data
- **WHEN** the Next.js application sends a request to `/api/{path}`
- **THEN** runtime routing forwards that request to the configured backend API origin

#### Scenario: Frontend serves uploaded media
- **WHEN** the Next.js application requests `/public/uploads/{path}`
- **THEN** runtime routing forwards that request to the backend upload-serving path

### Requirement: Runtime behavior is environment-configurable
The system SHALL derive runtime endpoints and integration credentials from environment configuration rather than hard-coded deployment values.

#### Scenario: Configure backend origin
- **WHEN** deployment sets a custom API origin through environment variables
- **THEN** the frontend uses that configured origin for API and upload rewrites

#### Scenario: Configure optional integrations
- **WHEN** deployment enables external integrations such as OAuth or image storage
- **THEN** runtime behavior uses the corresponding environment configuration for those integrations

### Requirement: The platform integrates with external content-adjacent services
The system SHALL support the configured external services used for comments, media, OAuth, and music-adjacent capabilities without requiring them to be embedded into the frontend codebase as first-party services.

#### Scenario: Use third-party comment or discussion integration
- **WHEN** the site renders a page that includes comment or discussion capability
- **THEN** the page uses the configured external integration endpoint or component

#### Scenario: Use optional music-related integration
- **WHEN** article or player functionality depends on the configured music service
- **THEN** runtime behavior calls the configured service boundary instead of hard-coding local-only assumptions
