## MODIFIED Requirements

### Requirement: The platform runs as separate frontend and backend services
The system SHALL run the public web application and the Koa API as separate runtime concerns connected through environment-driven routing, and packaging SHALL validate the backend API contract before exportable artifacts are produced.

#### Scenario: Package Docker artifacts with backend verification
- **WHEN** an operator runs the repository's Docker packaging/export workflow
- **THEN** the workflow executes the backend API test gate before producing the distributable bundle and stops if that verification fails

### Requirement: Runtime behavior is environment-configurable
The system SHALL derive runtime endpoints and integration credentials from environment configuration rather than hard-coded deployment values, and backend API tests SHALL run without requiring production secrets.

#### Scenario: Run package-time backend tests safely
- **WHEN** the backend API suite runs during packaging
- **THEN** it uses test-safe configuration, fixtures, and mocks rather than requiring live production credentials or secret files to be rewritten
