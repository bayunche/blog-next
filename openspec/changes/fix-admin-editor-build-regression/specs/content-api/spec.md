## MODIFIED Requirements

### Requirement: The API exposes public content retrieval endpoints
The system SHALL provide article-related API behavior using controller code that remains syntactically valid at runtime, including bootstrap logic for required system article records.

#### Scenario: Boot the article controller during API startup
- **WHEN** the backend service loads the article controller and initializes article-related routes
- **THEN** the controller source parses successfully and does not crash the Koa process because of corrupted bootstrap strings or malformed JavaScript literals
