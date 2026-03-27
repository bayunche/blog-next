## MODIFIED Requirements

### Requirement: The API exposes public content retrieval endpoints
The system SHALL provide public API endpoints for article lists, article details, and archive-oriented article discovery through backend code and supported offline restore assets that agree on the article fields queried at runtime.

#### Scenario: Restore offline database and query article list
- **WHEN** an operator restores the supported offline SQL assets and then the backend queries article records
- **THEN** the restored schema includes the article metadata columns already queried by the shipped backend image, including `cardCover`, so list/detail endpoints do not fail on missing-column errors
