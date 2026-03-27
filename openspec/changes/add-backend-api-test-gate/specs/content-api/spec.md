## MODIFIED Requirements

### Requirement: The API exposes public content retrieval endpoints
The system SHALL provide public API endpoints for article lists, article details, archive-oriented article discovery, and executable route-level verification for the supported content API surface.

#### Scenario: Verify public content routes in automated tests
- **WHEN** repository validation or packaging runs the backend API suite
- **THEN** the suite exercises the public content retrieval endpoints and fails if their expected contract responses regress

### Requirement: Protected management endpoints require authentication
The system MUST require authenticated administrator credentials before allowing protected content-management operations, and that behavior SHALL be covered by automated backend API tests.

#### Scenario: Reject unauthenticated management requests in the test suite
- **WHEN** the backend API suite sends a protected request without a valid bearer token
- **THEN** the suite observes an unauthorized result and fails if the endpoint becomes incorrectly accessible

#### Scenario: Allow authenticated management requests in the test suite
- **WHEN** the backend API suite sends a protected request with valid administrator credentials or equivalent test auth setup
- **THEN** the suite observes the route-family contract expected for authorized access

### Requirement: Uploaded assets can be served from the API domain
The system SHALL serve uploaded files through a public upload path while preventing path traversal outside the configured upload root, and both behaviors SHALL be covered by automated backend API tests.

#### Scenario: Verify upload path safety
- **WHEN** repository validation or packaging runs the backend API suite
- **THEN** the suite verifies both successful serving of allowed files and rejection of paths that resolve outside the upload root
